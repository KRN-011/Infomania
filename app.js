import dotenv from "dotenv";
dotenv.config();

// import modules
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import ejsMate from "ejs-mate";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// import routes
import userRouter from "./routes/userRouter.js";
import blogRouter from "./routes/blogRouter.js";
import categoryRouter from "./routes/categoryRouter.js";

//

// connect to DB
import connectDB from "./database/db.js";
import { Blog } from "./models/blog.models.js";
import { Category } from "./models/category.models.js";
import addUserToLocals from "./middlewares/addUserToLocals.js";
import { setAdminState } from "./middlewares/auth.js";

const app = express();

// set up template engine

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(addUserToLocals)
app.use(setAdminState);
app.use("/blog", express.static(path.join(__dirname, "/public")));
app.use("/admin", express.static(path.join(__dirname, "/public")));

app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Routes

app.use("/admin", userRouter);
app.use("/blog", blogRouter);
app.use("/category", categoryRouter);


// Connect to MongoDB

connectDB();

// Define routes

app.get("/", async (req, res) => {
  try {
    const allBlogs = await Blog.find({})
      .populate("createdBy", "fullname")
      .populate("category");
    const categories = await Category.find({});

    res.render("home", {
      user: req.user,
      blogs: allBlogs,
      categories,
      isSearch: false,
    });
  } catch (error) {
    console.error("Error fetching data for home page: ", error);
    res.status(500).send("Internal Server Error!");
  }
});

// Search route

app.get("/search", async (req, res) => {
  try {
    const { title } = req.body;
    const searchResults = await Blog.find({
      title: { $regex: title, $options: "i" },
    })
      .populate("createdBy", "fullname")
      .populate("category");
    const categories = await Category.find({});

    res.render("/", {
      user: req.user,
      blogs: searchResults,
      categories,
      isSearch: true,
    });
  } catch (error) {
    console.error("Error searching for blogs: ", error);
    res.status(500).send("Internal Server Error!");
  }
});

// Listen on port

app.listen(process.env.PORT || 3000);
console.log("Server is running on port: " + process.env.PORT);
