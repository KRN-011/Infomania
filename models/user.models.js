import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
        required: true,
        trim: true,
        minlength: [3, 'First Name must be at least 3 characters long'], 
        maxlength: [30, 'First Name cannot exceed 30 characters'] 
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },

    password: {
      type: String,
      required: true,
      minlength: [8, 'Password must be at least 8 characters long!'],
      validate: {
        validator: (password) => validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        }), 
        message: 'Password should be strong!'
      },
      select: false,
    }
  },
  { timestamps: true }
);

// Pre-save hook to hash password before saving
adminSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// compare password with stored hashed password

adminSchema.methods.comparePassword = async function (enteredPassword) {
  try {
      return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
      throw new Error("Error comparing passwords");
  }
};


export const Admin = mongoose.model("Admin", adminSchema);
