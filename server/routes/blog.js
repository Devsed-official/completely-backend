import express from "express";
import blog from "../controllers/blog.js";
// controllers

const router = express.Router();

router
  .get("", blog.getAllBlogs)
  .get(":id", blog.getBlogById)
  .post("", blog.createNewBlog);

export default router;
