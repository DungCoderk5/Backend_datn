const slugify = require("slugify");
const prisma = require("../../../shared/prisma");
const { generateUniqueSKU } = require("../../../utils/generateUniqueSKU");

async function updateProductUsecase(req) {
  const productId = parseInt(req.params.id, 10);
  let data = { ...req.body };

  // Kiểm tra sản phẩm tồn tại
  const existingProduct = await prisma.products.findUnique({
    where: { products_id: productId },
    include: { images: true, product_variants: true },
  });
  if (!existingProduct) throw { status: 404, message: "Sản phẩm không tồn tại" };

  // Parse JSON cho variants
  if (data.product_variants && typeof data.product_variants === "string") {
    try { data.product_variants = JSON.parse(data.product_variants); }
    catch { throw { status: 400, message: "product_variants không phải JSON hợp lệ" }; }
  }
  if (!Array.isArray(data.product_variants)) data.product_variants = [];

  // Ép kiểu số
  data.categories_id = data.categories_id ? parseInt(data.categories_id, 10) : null;
  data.brand_id = data.brand_id ? parseInt(data.brand_id, 10) : null;
  data.gender_id = data.gender_id ? parseInt(data.gender_id, 10) : 1;
  data.status = data.status ? parseInt(data.status, 10) : 1;
  data.price = data.price ? Number(data.price) : 0;
  data.sale_price = data.sale_price !== undefined && data.sale_price !== "" ? Number(data.sale_price) : null;

  // Validate tồn tại category, brand, gender
  const [categoryRecord, brandRecord, genderRecord] = await Promise.all([
    prisma.categories.findUnique({ where: { categories_id: data.categories_id } }),
    prisma.brands.findUnique({ where: { brand_id: data.brand_id } }),
    prisma.genders.findUnique({ where: { id: data.gender_id } }),
  ]);
  if (!categoryRecord) throw { status: 400, message: "categories_id không tồn tại" };
  if (!brandRecord) throw { status: 400, message: "brand_id không tồn tại" };
  if (!genderRecord) throw { status: 400, message: "gender_id không tồn tại" };

  // Slug
  data.slug = slugify(data.name, { lower: true, strict: true });

  // Prefix SKU
  const prefix = `${categoryRecord.name?.charAt(0).toUpperCase() || "X"}${brandRecord.name?.charAt(0).toUpperCase() || "X"}${genderRecord.name?.charAt(0).toUpperCase() || "X"}`;

  // --- Cập nhật / thêm ảnh sản phẩm chính ---
  const mainImagesFiles = req.files.filter(f => f.fieldname === "images");
  for (let i = 0; i < mainImagesFiles.length; i++) {
    const file = mainImagesFiles[i];
    const existingImage = existingProduct.images[i];
    if (existingImage) {
      await prisma.images.update({
        where: { images_id: existingImage.images_id },
        data: { url: file.filename, alt_text: file.originalname },
      });
    } else {
      await prisma.images.create({
        data: { product_id: productId, url: file.filename, alt_text: file.originalname, type: "main" },
      });
    }
  }

  // --- Xử lý colors ---
  const colorImageMap = {};
  req.files.forEach(file => {
    if (file.fieldname.startsWith("variant_image_")) {
      let codeColor = file.fieldname.replace("variant_image_", "").split("-")[0];
      colorImageMap[codeColor] = file.filename;
    }
  });

  const uniqueColors = [...new Set(data.product_variants.map(v => {
    let baseColor = v.code_color.split("-")[0];
    if (!baseColor.startsWith("#")) baseColor = `#${baseColor.replace(/^#/, "")}`;
    return baseColor;
  }))];

  const colorToColorRecordMap = {};
  for (const codeColor of uniqueColors) {
    let colorRecord = await prisma.colors.findFirst({ where: { code_color: codeColor } });
    if (!colorRecord) {
      const variantExample = data.product_variants.find(v => `#${v.code_color.split("-")[0].replace(/^#/, "")}` === codeColor);
      colorRecord = await prisma.colors.create({
        data: {
          code_color: codeColor,
          name_color: variantExample.name_color,
          images: colorImageMap[codeColor.replace(/^#/, "")] || null,
        },
      });
    }
    colorToColorRecordMap[codeColor] = colorRecord;
  }

  // --- Cập nhật sản phẩm ---
  await prisma.products.update({
    where: { products_id: productId },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      short_desc: data.short_desc,
      price: data.price,
      sale_price: data.sale_price,
      categories_id: data.categories_id,
      brand_id: data.brand_id,
      gender_id: data.gender_id,
      status: data.status,
    },
  });

  // --- Xử lý variant ---
  const oldVariants = await prisma.product_variants.findMany({ where: { product_id: productId } });
  const newVariantIds = [];

  for (const variant of data.product_variants) {
    let baseColor = variant.code_color.split("-")[0];
    if (!baseColor.startsWith("#")) baseColor = `#${baseColor.replace(/^#/, "")}`;
    const colorRecord = colorToColorRecordMap[baseColor];
    const sizeId = variant.size_id ? parseInt(variant.size_id, 10) : null;
    const stock = variant.stock_quantity ? parseInt(variant.stock_quantity, 10) : 0;
    const baseSKU = `${prefix}-${baseColor.replace(/^#/, "").charAt(0).toUpperCase()}-${sizeId}`;

    if (variant.product_variants_id) {
      await prisma.product_variants.update({
        where: { product_variants_id: variant.product_variants_id },
        data: { color_id: colorRecord.id, size_id: sizeId, stock_quantity: stock, sku: await generateUniqueSKU(baseSKU, variant.product_variants_id) },
      });
      newVariantIds.push(variant.product_variants_id);
    } else {
      const created = await prisma.product_variants.create({
        data: { product_id: productId, color_id: colorRecord.id, size_id: sizeId, stock_quantity: stock, sku: await generateUniqueSKU(baseSKU) },
      });
      newVariantIds.push(created.product_variants_id);
    }
  }

  // Xóa variant cũ không còn trong danh sách
  const idsToDelete = oldVariants.map(v => v.product_variants_id).filter(id => !newVariantIds.includes(id));
  if (idsToDelete.length) {
    await prisma.product_variants.deleteMany({ where: { product_variants_id: { in: idsToDelete } } });
  }

  // --- Trả về sản phẩm ---
  return await prisma.products.findUnique({
    where: { products_id: productId },
    include: { images: true, product_variants: { include: { color: true, size: true } } },
  });
}

module.exports = updateProductUsecase;
