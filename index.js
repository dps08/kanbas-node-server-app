import express from 'express';
import Hello from './Hello.js';
import Lab5 from './Lab5/index.js';
import UserRoutes from './Kanbas/Users/routes.js';
import CourseRoutes from './Kanbas/Courses/routes.js';
import cors from "cors";
import session from "express-session";
import ModuleRoutes from "./Kanbas/Modules/routes.js";
import "dotenv/config";
import AssignmentRoutes from './Kanbas/Assignments/routes.js';
const app = express();
app.use(
    cors({
        credentials: true,
        origin: "https://luxury-lokum-4d9a8c.netlify.app" || "http://localhost:3000",
    })
);
const sessionOptions = {
    secret: process.env.SESSION_SECRET || "kanbas",
    resave: false,
    saveUninitialized: false,
};
if (process.env.NODE_ENV !== "development") {
    sessionOptions.proxy = true;
    sessionOptions.cookie = {
        sameSite: "none",
        secure: true,
        domain: process.env.NODE_SERVER_DOMAIN,
    };
}
app.use(session(sessionOptions));


app.use(express.json());
Lab5(app);
Hello(app);
UserRoutes(app);
CourseRoutes(app);
ModuleRoutes(app);
AssignmentRoutes(app);
app.listen(process.env.PORT || 4000)