const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const Product = require("../models/Product");
const verifyToken = require("../middleware/verifyToken");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const productName = req.body.name
      ? req.body.name.replace(/[^a-zA-Z0-9]/g, "_")
      : "unknown_product";
    const fileExtension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, fileExtension);
    cb(null, `${productName}-${Date.now()}${fileExtension}`);
  },
});

const upload = multer({ storage });

router.post("/", verifyToken, upload.array("image"), async (req, res) => {
  try {
    const imagePaths = req.files.map((file) => file.path.replace(/\\/g, "/"));

    const newProductData = { ...req.body, image: imagePaths };

    const newProduct = new Product(newProductData);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("商品作成に失敗しました:", error);
    res.status(400).json({ message: "商品作成に失敗しました", error });
  }
});
// 모든 상품 조회
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "商品を取得できませんでした", error });
  }
});

// 특정 상품 조회
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "商品が見つかりません" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "商品を取得できませんでした", error });
  }
});

router.put("/:id", verifyToken, upload.array("image"), async (req, res) => {
  try {
    const { existingImage, ...updateData } = req.body;

    const uploadedImagePaths = req.files
      ? req.files.map((file) => file.path.replace(/\\/g, "/"))
      : [];

    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "商品が見つかりません" });

    const imagesToDelete = product.image.filter(
      (img) => !existingImage.includes(img)
    );

    imagesToDelete.forEach((imagePath) => {
      const fullPath = path.join(__dirname, "../", imagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlink(fullPath, (err) => {
          if (err) {
            console.error(`Failed to delete file: ${fullPath}`, err);
          } else {
            console.log(`Deleted file: ${fullPath}`);
          }
        });
      }
    });

    product.image = [
      ...(Array.isArray(existingImage) ? existingImage : [existingImage]),
      ...uploadedImagePaths,
    ].filter(Boolean);

    Object.keys(updateData).forEach((key) => {
      product[key] = updateData[key];
    });

    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("商品を更新できませんでした:", error);
    res.status(500).json({ message: "商品を更新できませんでした", error });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "商品が見つかりません" });

    if (product.image && product.image.length > 0) {
      product.image.forEach((imagePath) => {
        const filePath = path.join(__dirname, "../", imagePath);
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Failed to delete file: ${filePath}`, err);
            } else {
              console.log(`File deleted: ${filePath}`);
            }
          });
        }
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "商品が正常に削除されました" });
  } catch (error) {
    console.error("Failed to delete product:", error);
    res.status(500).json({ message: "商品を削除できませんでした", error });
  }
});
``;

module.exports = router;
