import { error } from "console";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Admin } from "../models/user.models.js";
import { generateToken } from "../utils/jwtToken.js";

export const adminRegister = catchAsyncErrors(async (req, res, next) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return next(new Error("Please Fill Full Form!"), 400);
  }

  let admin = await Admin.findOne({ email });

  if (admin) {
    return next(new Error("Admin already registered!", 400));
  }

  admin = await Admin.create({ fullname, email, password });

  generateToken(admin, "Admin registered!", 200, res);
});

export const adminLogin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render("login", { error: "Please Fill Full Form!" });
  }

  const user = await Admin.findOne({ email }).select("+password");

  if (!user) {
    return res.render("login", {
      error: "Incorrect Email and Username!",
    });
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return res.render("login", { error: "Invalid Credentials!" });
  }

  generateToken(user, res);
  return res.redirect("/admin/dashboard");
});

export const adminLogout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("adminToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .redirect("/");
});
