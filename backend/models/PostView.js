const mongoose = require('mongoose');

const postViewSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  ip: { type: String, required: true },
  userAgent: { type: String, required: true },
  viewedAt: { type: Date, default: Date.now }
});

postViewSchema.index({ postId: 1, ip: 1, userAgent: 1 });

module.exports = mongoose.model('PostView', postViewSchema);
