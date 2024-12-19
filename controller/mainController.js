import { isAdminAuthenticated } from "../middlewares/auth.js";

export default function (app) {
    // Route to render the home page
    app.get("/", (req, res) => {
        res.render("home.ejs");
    });

    // Route to render the post page
    app.get("/post", (req, res) => {
        res.render("post.ejs");
    });

    // Route to render the login page
    app.get("/login", (req, res) => {
        res.render("login.ejs");
    });

    // Route to render the dashboard page; only accessible to authenticated users
    app.get("/dashboard", isAdminAuthenticated, (req, res) => {
        res.render("dashboard.ejs");
    });
}