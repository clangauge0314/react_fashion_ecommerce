const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const verifyToken = require("../middleware/verifyToken");

// 상품 생성
router.post("/", verifyToken, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
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

// 특정 상품 수정
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct)
      return res.status(404).json({ message: "商品が見つかりません" });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "商品を更新できませんでした", error });
  }
});

// 특정 상품 삭제
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ message: "商品が見つかりません" });
    res.status(200).json({ message: "商品が正常に削除されました" });
  } catch (error) {
    res.status(500).json({ message: "商品を削除できませんでした", error });
  }
});

module.exports = router;
