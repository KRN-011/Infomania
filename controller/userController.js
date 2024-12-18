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
})

export const adminLogin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  console.log("Login attempt", { email, password });

  if (!email || !password) {
      return next(new Error("Please Fill Full Form!", 400));
  }

  const user = await Admin.findOne({ email }).select("+password");

  if (!user) {
      console.log("User not found");
      return next(new Error("Invalid Credentials!", 400));
  }

  console.log("User found", user.email);

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
      console.log("Password does not match");
      return next(new Error("Invalid Credentials!", 400));
  }

  console.log("Password matched, generating token");

  generateToken(user, "User Login Successfully!", 200, res);
});

export const adminLogout = catchAsyncErrors(async (req, res, next) => {
  res.status(200).cookie("adminToken", "", {
    httpOnly: true,
    expires: new Date(Date.now())
  }).json({
    success: true,
    message: "Admin Logout Successfully!"
  })
})