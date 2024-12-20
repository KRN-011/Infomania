import jwt from "jsonwebtoken";
import { catchAsyncErrors } from "./catchAsyncErrors.js"
import { Admin } from "../models/user.models.js";

export const setAdminState = async (req, res, next) => {
    const token = req.cookies.adminToken;

    if (!token) {
        res.locals.admin = false; 
    } else {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const admin = await Admin.findById(decoded.id);
            res.locals.admin = !!admin; 
        } catch (error) {
            res.locals.admin = false;
        }
    }

    next();
};

export const isAdminAuthenticated = catchAsyncErrors( async (req, res, next) => {
    const token = req.cookies.adminToken;

    if( !token ) {
        return next(res.status(401).redirect('/admin/login'))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Admin.findById(decoded.id);

    next();
});