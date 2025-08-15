const slugify = require("slugify");
const prisma = require("../../../shared/prisma");
const productRepository = require("../../repository/productRepository");
const { generateUniqueSKU } = require("../../../utils/generateUniqueSKU");

async function updateProductUsecase(req) {
  const productId = parseInt(req.params.id, 10);
  let data = { ...req.body };

  // Kiểm tra sản phẩm tồn tại
  const existingProduct = await prisma.products.findUnique({
    where: { products_id: productId },
    include: {
      images: true,
      product_variants: true,
    },
  });
  if (!existingProduct) {
    throw { status: 404, message: "Sản phẩm không tồn tại" };
  }

  // Parse JSON cho variants
  if (data.product_variants && typeof data.product_variants === "string") {
    try {
      data.product_variants = JSON.parse(data.product_variants);
    } catch {
      throw { status: 400, message: "product_variants không phải JSON hợp lệ" };
    }
  } else if (!Array.isArray(data.product_variants)) {
    data.product_variants = [];
  }

  // Ép kiểu số
  data.categories_id = data.categories_id
    ? parseInt(data.categories_id, 10)
    : null;
  data.brand_id = data.brand_id ? parseInt(data.brand_id, 10) : null;
  data.gender_id = data.gender_id ? parseInt(data.gender_id, 10) : 1;
  data.status = data.status ? parseInt(data.status, 10) : 1;
  data.price = data.price ? Number(data.price) : 0;
  data.sale_price =
    data.sale_price !== undefined && data.sale_price !== ""
      ? Number(data.sale_price)
      : null;

  // Validate tồn tại category, brand, gender
  const [categoryRecord, brandRecord, genderRecord] = await Promise.all([
    prisma.categories.findUnique({
      where: { categories_id: data.categories_id },
    }),
    prisma.brands.findUnique({ where: { brand_id: data.brand_id } }),
    prisma.genders.findUnique({ where: { id: data.gender_id } }),
  ]);
  if (!categoryRecord)
    throw { status: 400, message: "categories_id không tồn tại" };
  if (!brandRecord) throw { status: 400, message: "brand_id không tồn tại" };
  if (!genderRecord) throw { status: 400, message: "gender_id không tồn tại" };

  // Ảnh sản phẩm chính (nếu có upload mới)
  let productImages = [];
  if (req.files.some((f) => f.fieldname === "images")) {
    productImages = req.files
      .filter((f) => f.fieldname === "images")
      .map((file) => ({
        url: file.filename,
        alt_text: file.originalname,
        type: "main",
      }));

    // Xóa ảnh cũ
    await prisma.images.deleteMany({
      where: { product_id: productId },
    });
  }

// Map ảnh variant: key = mã màu bỏ # + lowercase
const colorImageMap = {};
req.files.forEach((file) => {
  if (file.fieldname.startsWith("variant_image_")) {
    const codeColorKey = file.fieldname
      .replace("variant_image_", "")
      .replace(/^#/, "")
      .toLowerCase()
      .split("-")[0];

    colorImageMap[codeColorKey] = file.filename;
  }
});

console.log("DEBUG - colorImageMap:", colorImageMap);

// Danh sách màu duy nhất từ variants
const uniqueColors = [
  ...new Set(
    data.product_variants.map((v) => {
      let baseColor = v.code_color.split("-")[0].toLowerCase();
      if (!baseColor.startsWith("#")) {
        baseColor = `#${baseColor.replace(/^#/, "")}`;
      }
      return baseColor;
    })
  ),
];

console.log("DEBUG - uniqueColors:", uniqueColors);

// Validate ảnh cho màu mới
for (let codeColor of uniqueColors) {
  const codeWithoutHash = codeColor.replace(/^#/, "").toLowerCase();
  console.log(`DEBUG - Checking color: ${codeColor}, key: ${codeWithoutHash}`);
  
  const colorExists = await prisma.colors.findFirst({
    where: { code_color: codeColor },
  });

  if (!colorExists && !colorImageMap[codeWithoutHash]) {
    throw { status: 400, message: `Màu ${codeColor} chưa có ảnh` };
  }
}

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
      ...(productImages.length > 0 && {
        images: { create: productImages },
      }),
    },
  });

  // Lấy tất cả màu hiện có của sản phẩm này
  const existingColors = await prisma.colors.findMany({
    where: {
      product_variants: {
        some: { product_id: productId },
      },
    },
  });

  const colorToColorRecordMap = {};

  for (const variant of data.product_variants) {
    let baseColor = variant.code_color.split("-")[0];
    if (!baseColor.startsWith("#"))
      baseColor = `#${baseColor.replace(/^#/, "")}`;

    const imageFile = colorImageMap[baseColor.replace(/^#/, "")] || null;

    // Tìm màu đã tồn tại
    let colorRecord = existingColors.find((c) => c.code_color === baseColor);

    if (!colorRecord) {
      // Màu mới → bắt buộc phải có ảnh
      if (!imageFile) {
        throw { status: 400, message: `Màu ${baseColor} chưa có ảnh` };
      }
      colorRecord = await prisma.colors.create({
        data: {
          code_color: baseColor,
          name_color: variant.name_color,
          images: imageFile,
        },
      });
      existingColors.push(colorRecord); // Cập nhật lại list để tránh bị lặp tạo
    } else {
      // Nếu có ảnh mới → update
      if (imageFile) {
        colorRecord = await prisma.colors.update({
          where: { id: colorRecord.id },
          data: { images: imageFile },
        });
        // Update lại list
        const idx = existingColors.findIndex((c) => c.id === colorRecord.id);
        if (idx > -1) existingColors[idx] = colorRecord;
      }
      // Nếu không có ảnh mới → giữ ảnh cũ, không làm gì
    }

    colorToColorRecordMap[baseColor] = colorRecord;
  }

  // Xóa variants cũ
  await prisma.product_variants.deleteMany({
    where: { product_id: productId },
  });

  // Tạo variants mới
  const variantsToCreate = data.product_variants.map((variant) => {
    let baseColor = variant.code_color.split("-")[0];
    if (!baseColor.startsWith("#"))
      baseColor = `#${baseColor.replace(/^#/, "")}`;

    const sizeId = variant.size_id ? parseInt(variant.size_id, 10) : null;
    const stock = variant.stock_quantity
      ? parseInt(variant.stock_quantity, 10)
      : 0;
    const colorRecord = colorToColorRecordMap[baseColor];
    const colorLetter =
      baseColor.replace(/^#/, "").charAt(0).toUpperCase() || "X";
    const baseSKU = `${prefix}-${colorLetter}-${sizeId}`;

    return { ...variant, sizeId, stock, colorRecord, baseSKU };
  });

  for (let v of variantsToCreate) {
    v.sku = await generateUniqueSKU(v.baseSKU);
  }

  await prisma.product_variants.createMany({
    data: variantsToCreate.map((v) => ({
      product_id: productId,
      color_id: v.colorRecord.id,
      size_id: v.sizeId,
      stock_quantity: v.stock,
      sku: v.sku,
    })),
  });
  // Sau khi tạo variants mới, xoá các màu không còn dùng
await prisma.colors.deleteMany({
  where: {
    id: {
      in: existingColors
        .filter(c => 
          !data.product_variants.some(v => {
            let baseColor = v.code_color.split("-")[0];
            if (!baseColor.startsWith("#"))
              baseColor = `#${baseColor.replace(/^#/, "")}`;
            return c.code_color === baseColor;
          })
        )
        .map(c => c.id)
    }
  }
});

  // Trả về sản phẩm đầy đủ sau update
  return await prisma.products.findUnique({
    where: { products_id: productId },
    include: {
      images: true,
      product_variants: { include: { color: true, size: true } },
    },
  });
}

module.exports = updateProductUsecase;
