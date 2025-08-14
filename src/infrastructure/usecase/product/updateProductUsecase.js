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
  } else if (!Array.isArray(data.product_variants)) data.product_variants = [];

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

  // Ảnh sản phẩm chính (nếu có upload mới)
  let productImages = [];
  if (req.files.some(f => f.fieldname === "images")) {
    productImages = req.files.filter(f => f.fieldname === "images").map(file => ({
      url: file.filename,
      alt_text: file.originalname,
      type: "main"
    }));
    await prisma.images.deleteMany({ where: { product_id: productId } });
  }

  // Map ảnh variant từ FE
  const colorImageMap = {};
  req.files.forEach(file => {
    if (file.fieldname.startsWith("variant_image_")) {
      const codeColor = file.fieldname.replace("variant_image_", "").toLowerCase();
      colorImageMap[codeColor] = file.filename;
    }
  });

  // Slug mới
  data.slug = slugify(data.name, { lower: true, strict: true });

  // Prefix SKU
  const cateLetter = categoryRecord.name?.charAt(0).toUpperCase() || "X";
  const brandLetter = brandRecord.name?.charAt(0).toUpperCase() || "X";
  const genderLetter = genderRecord.name?.charAt(0).toUpperCase() || "X";
  const prefix = `${cateLetter}${brandLetter}${genderLetter}`;

  // Update sản phẩm
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
      ...(productImages.length > 0 && { images: { create: productImages } }),
    },
  });

  // --- Xử lý xóa variant không còn trong request ---
  const existingVariantIds = existingProduct.product_variants.map(v => v.product_variants_id);
  const incomingVariantIds = data.product_variants.map(v => v.product_variants_id).filter(Boolean);
  const variantsToDelete = existingVariantIds.filter(id => !incomingVariantIds.includes(id));
  if (variantsToDelete.length > 0) {
    await prisma.product_variants.deleteMany({
      where: { product_variants_id: { in: variantsToDelete } }
    });
  }

  // Xử lý variants thêm hoặc update
  for (const variant of data.product_variants) {
    let baseColor = variant.code_color;
    if (!baseColor.startsWith("#")) baseColor = `#${baseColor.replace(/^#/, "")}`;
    const colorKey = baseColor.replace(/^#/, "").toLowerCase();

    // Lấy ảnh: ưu tiên file mới FE, nếu không thì ảnh cũ trong payload
    let variantImage = colorImageMap[colorKey] || data.variantImages?.[colorKey];

    // Variant mới bắt buộc có ảnh
    if (!variant.product_variants_id && !variantImage) {
      throw { status: 400, message: `Màu ${baseColor} chưa có ảnh` };
    }

    let colorRecord;
    if (variant.color_id) {
      // giữ nguyên color cũ
      colorRecord = await prisma.colors.findUnique({ where: { id: variant.color_id } });
      if (!colorRecord) throw { status: 400, message: "Color không tồn tại" };
      // Cập nhật ảnh nếu có file mới
      if (variantImage && typeof variantImage === "string") {
        await prisma.colors.update({
          where: { id: colorRecord.id },
          data: { images: variantImage, name_color: variant.name_color }
        });
      }
    } else {
      // Tạo color mới cho variant mới
      if (!variantImage) throw { status: 400, message: `Màu ${baseColor} chưa có ảnh` };
      colorRecord = await prisma.colors.create({
        data: { code_color: baseColor, name_color: variant.name_color, images: variantImage }
      });
    }

    const sizeId = variant.size_id ? parseInt(variant.size_id, 10) : null;
    const stock = variant.stock_quantity ? parseInt(variant.stock_quantity, 10) : 0;
    const colorLetter = colorKey.charAt(0).toUpperCase() || "X";
    const baseSKU = `${prefix}-${colorLetter}-${sizeId}`;
    const sku = await generateUniqueSKU(baseSKU);

    if (variant.product_variants_id) {
      await prisma.product_variants.update({
        where: { product_variants_id: variant.product_variants_id },
        data: { color_id: colorRecord.id, size_id: sizeId, stock_quantity: stock, sku }
      });
    } else {
      await prisma.product_variants.create({
        data: { product_id: productId, color_id: colorRecord.id, size_id: sizeId, stock_quantity: stock, sku }
      });
    }
  }

  return await prisma.products.findUnique({
    where: { products_id: productId },
    include: { images: true, product_variants: { include: { color: true, size: true } } },
  });
}

module.exports = updateProductUsecase;
