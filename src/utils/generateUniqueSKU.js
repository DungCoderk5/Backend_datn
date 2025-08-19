const prisma = require("../shared/prisma");

// Hàm tạo SKU duy nhất (version 2: giới hạn số lần thử)
async function generateUniqueSKU(baseSKU) {
  let sku = baseSKU;
  let count = 1;
  const maxAttempts = 100;

  while (count <= maxAttempts) {
    const existing = await prisma.product_variants.findFirst({
      where: { sku },
    });

    if (!existing) break; // Không trùng → dừng vòng lặp

    sku = `${baseSKU}-${count}`;
    count++;
  }

  if (count > maxAttempts) {
    throw new Error("Không thể tạo SKU duy nhất sau 100 lần thử");
  }

  return sku;
}

module.exports = {
  generateUniqueSKU,
};
