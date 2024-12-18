import { Blog } from "../models/blog.models.js";
import { Category } from "../models/category.models.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import multer from "multer";
import path from "path";


// set up for upload file
const storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: (req, res, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

export const upload = multer({
    storage: storage,
    limits: { fileSize: 2000000 },
    fileFilter: (req, res, cb) => {
        checkFileType(file,cb)
    }
}).fields([
    { name: 'imageThumbnail', maxCount: 1 },
    { name: 'imageFeatured', maxCount: 1 }
])

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if ( mimetype && extname ) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!')
    }
}


// get all blogs

export const getAllBlogs = catchAsyncErrors(async (req, res, next) => {
  try {
    const blogs = await Blog.find({}).populate("category");
    const categories = await Category.find({});

    res.render("allBlogs", {
      user: req.user,
      blogs: blogs,
      categories,
    });
  } catch (error) {
    console.error("Error fetching Blogs: " + error);
    res.status(500).send("Internal Server Error!");
  }
});

// get blog data for editing

export const getBlogForEditing = catchAsyncErrors(async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("category");
    const categories = await Category.find({});

    res.render("editingBlog", {
      user: req.user,
      blog,
      categories,
    });
  } catch (error) {
    console.error("Error fetching Blog data: " + error);
    res.status(500).send("Internal Server Error!");
  }
});

// update blog data

export const updateBlog = catchAsyncErrors(async (req, res, next) => {
  try {
    await Blog.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/blog/all-blogs");
  } catch (error) {
    console.error("Error updating blog: ", error);
    res.status(500).send("Internal Server Error!");
  }
});

// delete blog

export const deleteBlog = catchAsyncErrors(async (req, res, next) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect("/blog/all-blogs");
  } catch (error) {
    console.error("Error deleting blog: ", error);
    res.status(500).send("Internal Server Error");
  }
});

// create a new blog

export const createBlog = catchAsyncErrors(async (req, res, next) => {
  try {
    const { title, description, category } = req.body;
    const imageThumbnail = req.files.imageThumbnail
      ? `/uploads/${req.files.imageThumbnail[0].filename}`
      : "";
    const imageFeatured = req.files.imageFeatured
      ? `/uploads/${req.files.imageFeatured[0].filename}`
      : "";

    const blog = new Blog({
      title,
      description,
      category,
      imageThumbnail,
      imageFeatured,
      createdBy: req.user._id,
    });

    await blog.save();
    res.redirect(`/blog/${blog.slug}`);

  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).send("Internal Server Error!");
  }
});
