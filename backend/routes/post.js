const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const verifyToken = require("../middleware/verifyToken");
const PostView = require("../models/PostView");

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const prevPost = await Post.findOne({ 
      createdAt: { $lt: post.createdAt } 
    }).sort({ createdAt: -1 }).select('title _id');
    
    const nextPost = await Post.findOne({ 
      createdAt: { $gt: post.createdAt } 
    }).sort({ createdAt: 1 }).select('title _id');

    const ip = req.ip;
    const userAgent = req.headers['user-agent'];
    
    const existingView = await PostView.findOne({
      postId: post._id,
      ip,
      userAgent,
      viewedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // 24시간 이내
    });

    if (!existingView) {
      await PostView.create({
        postId: post._id,
        ip,
        userAgent
      });
      post.viewCount += 1;
      await post.save();
    }

    res.status(200).json({
      post,
      navigation: {
        prevPost,
        nextPost
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", verifyToken, async (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    author: req.body.author || 'admin',
    isImportant: req.body.isImportant,
  });

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    post.author = req.body.author || post.author;
    post.isImportant = req.body.isImportant ?? post.isImportant;
    post.updatedAt = Date.now();

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
