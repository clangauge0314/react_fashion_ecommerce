const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const sharp = require("sharp");
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
    cb(null, `${productName}-${Date.now()}${fileExtension}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpg", "image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("지원되지 않는 파일 형식입니다"));
    }
    cb(null, true);
  },
});

// 상품 생성
router.post("/", verifyToken, upload.array("image"), async (req, res) => {
  try {
    const compressedImagePaths = [];

    for (const file of req.files) {
      const compressedPath = `uploads/compressed-${file.filename}`;
      await sharp(file.path)
        .toFormat("webp")
        .webp({ quality: 80 })
        .toFile(compressedPath);

      compressedImagePaths.push(compressedPath.replace(/\\/g, "/"));
    }

    const newProductData = {
      ...req.body,
      image: compressedImagePaths, // 압축된 이미지 경로만 저장
      color: JSON.parse(req.body.color),
    };

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

// 상품 상세 조회
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

// 상품 업데이트
router.put("/:id", verifyToken, upload.array("image"), async (req, res) => {
  try {
    const { existingImage, color, stock, ...updateData } = req.body;

    const uploadedImagePaths = [];
    if (req.files) {
      for (const file of req.files) {
        const compressedPath = `uploads/compressed-${file.filename}`;
        await sharp(file.path)
          .toFormat("webp")
          .webp({ quality: 80 })
          .toFile(compressedPath);

        uploadedImagePaths.push(compressedPath.replace(/\\/g, "/"));

        // 원본 파일 삭제
        fs.unlinkSync(file.path);
      }
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "商品が見つかりません" });
    }

    const existingImagesArray = Array.isArray(existingImage)
      ? existingImage
      : existingImage
      ? [existingImage]
      : [];

    const imagesToDelete = product.image.filter(
      (img) => !existingImagesArray.includes(img)
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

    product.image = [...existingImagesArray, ...uploadedImagePaths].filter(
      Boolean
    );

    if (color) {
      if (typeof color === "string") {
        product.color = color.split(",").map((c) => c.trim());
      } else if (Array.isArray(color)) {
        product.color = color;
      }
    }

    if (stock !== undefined) {
      const stockValue = parseInt(stock, 10);
      if (stockValue < 0) {
        return res.status(400).json({ message: "在庫数は0以上にしてください" });
      }
      product.stock = stockValue;

      if (stockValue <= 1) {
        product.status = "no";
      } else if (!updateData.status) {
        product.status = product.status || "yes";
      }
    }

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

// 상품 삭제
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

module.exports = router;
