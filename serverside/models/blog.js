const mongoose = require('mongoose');

// Define the schema for a blog post
const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  username:{
    type: String,
    },
  categories: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a model based on the schema
const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;
