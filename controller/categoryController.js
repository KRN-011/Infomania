import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Category } from "../models/category.models.js";

// get all categories

export const getAllCategories = catchAsyncErrors(async (req, res, next) => {
  try {
    const categories = await Category.find({});

    res.render("allCategories", { categories });
  } catch (error) {
    console.error("Error fetching categories: ", error);
    res.status(500).send("Internal Server Error!");
  }
});

// get category data for editing

export const getCategoryDataForEditing = catchAsyncErrors(
  async (req, res, next) => {
    try {
      const category = await Category.findById(req.params.id);

      res.render("editCategory", { category });
    } catch (error) {
      console.error("Error fetching category: ", error);
      res.status(500).send("Internal Server Error!");
    }
  }
);

// to update the category

export const updateCategory = catchAsyncErrors(async (req, res, next) => {
  try {
    await Category.findByIdAndUpdate(req.params.id, req.body);

    res.redirect("/category/all");
  } catch (error) {
    console.error("Error updating category: ", error);
    res.status(500).send("Internal Server Error!");
  }
});

// to delete the category

export const deleteCategory = catchAsyncErrors(async (req, res, next) => {
  try {
    await Category.findByIdAndDelete(req.params.id);

    res.redirect("/category/all");
  } catch (error) {
    console.error("Error deleting category: ", error);
    res.status(500).send("Internal Server Error!");
  }
});

// add new category

export const addCategory = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name } = req.body;

    const category = new Category({ name });
    await category.save();

    res.redirect("/category/all");
  } catch (error) {
    console.error("Error adding category: ", error);
    res.status(500).send("Internal Server Error!");
  }
});