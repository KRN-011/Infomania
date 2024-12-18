import express from 'express';
import { Category } from '../models/category.models.js';
import { isAdminAuthenticated } from '../middlewares/auth.js';
import { addCategory, deleteCategory, getAllCategories, getCategoryDataForEditing, updateCategory } from '../controller/categoryController.js';

const router = express.Router();

router.get("/all", isAdminAuthenticated, getAllCategories)
router.get("/edit", isAdminAuthenticated, getCategoryDataForEditing)
router.post("/edit", isAdminAuthenticated, updateCategory)
router.get("/delete", isAdminAuthenticated, deleteCategory)
router.post("/add", isAdminAuthenticated, addCategory)


// render templates

// to render add new category page

router.get("/add-category", isAdminAuthenticated, async (req, res) => {
    res.render("addCategory", {
        user: req.user
    })
})


export default router;