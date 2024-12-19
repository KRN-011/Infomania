import express from 'express';
import { adminLogout, adminLogin, adminRegister } from '../controller/userController.js';
import { isAdminAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

// admin routes

router.get('/login', (req, res) => { return res.render('login') })
router.get('/dashboard', isAdminAuthenticated, (req, res) => { res.render('dashboard') })

router.post('/register', adminRegister)
router.post("/login", adminLogin)
router.get("/logout", isAdminAuthenticated, adminLogout)

export default router;