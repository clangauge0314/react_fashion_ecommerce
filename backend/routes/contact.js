const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const verifyToken = require("../middleware/verifyToken");

router.post('/', async (req, res) => {
  const { name, email, message, ipAddress } = req.body;

  try {
    const newContact = new Contact({
      name,
      email,
      message,
      ipAddress,
      status: 'pending' 
    });

    const savedContact = await newContact.save();

    console.log('Contact form submission saved:', {
      name,
      email,
      message,
      ipAddress,
      status: 'pending'
    });

    res.status(200).json({ 
      message: 'お問い合わせを受け付けました',
      _id: savedContact._id 
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'エラーが発生しました' });
  }
});

router.get('/', verifyToken, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'エラーが発生しました' });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ message: 'お問い合わせが見つかりません' });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ message: 'ステータスの更新に失敗しました' });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedContact = await Contact.findByIdAndDelete(id);
    
    if (!deletedContact) {
      return res.status(404).json({ message: 'お問い合わせが見つかりません' });
    }

    res.status(200).json({ message: 'お問い合わせを削除しました' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ message: '削除に失敗しました' });
  }
});

module.exports = router;