const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const verifyToken = require("../middleware/verifyToken");

router.post('/', async (req, res) => {
  const { customerName, customerEmail, productId, quantity, ipAddress } = req.body;

  try {
    const newOrder = new Order({
      customerName,
      customerEmail,
      productId,
      quantity,
      ipAddress,
      status: 'pending'
    });

    const savedOrder = await newOrder.save();

    console.log('Order submission saved:', {
      customerName,
      customerEmail,
      productId,
      quantity,
      ipAddress,
      status: 'pending'
    });

    res.status(200).json({ 
      message: '注文を受け付けました',
      _id: savedOrder._id 
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'エラーが発生しました' });
  }
});

router.get('/', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('productId')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'エラーが発生しました' });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('productId');

    if (!updatedOrder) {
      return res.status(404).json({ message: '注文が見つかりません' });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'ステータスの更新に失敗しました' });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);
    
    if (!deletedOrder) {
      return res.status(404).json({ message: '注文が見つかりません' });
    }

    res.status(200).json({ message: '注文を削除しました' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: '削除に失敗しました' });
  }
});

module.exports = router;
