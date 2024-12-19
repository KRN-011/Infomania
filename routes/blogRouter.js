import express from "express";
import { isAdminAuthenticated } from "../middlewares/auth.js";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogForEditing,
  updateBlog,
  upload,
} from "../controller/blogController.js";
import { Category } from "../models/category.models.js";
import { Blog } from "../models/blog.models.js";

const router = express.Router();

router.get("/all", isAdminAuthenticated, getAllBlogs);
router.get("/edit/:id", isAdminAuthenticated, getBlogForEditing);
router.post("/edit/:id", isAdminAuthenticated, updateBlog);
router.post("/add", isAdminAuthenticated, upload, createBlog);
router.get("/delete/:id", isAdminAuthenticated, deleteBlog)

//* render templates

// to render add blog page

router.get("/add-new", isAdminAuthenticated, async (req, res) => {
  try {
    const categories = await Category.find({});
    res.render("addBlog", {
      user: req.user,
      categories,
    });
  } catch (error) {
    console.error("Error fetching categories: ", error);
    res.status(500).send("Internal Server Error!");
  }
});

// to render single blog page
router.get("/:slug", async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
      .populate("createdBy", "fullname")
      .populate("category");
    if (!blog) {
      return res.status(404).send("Blog post not found!");
    }

    res.render("blog", {
      user: req.user,
      blog,
    });
  } catch (error) {
    console.error("Error fetching blog: ", error);
    res.status(500).send("Internal Server Error!");
  }
});

export default router;
