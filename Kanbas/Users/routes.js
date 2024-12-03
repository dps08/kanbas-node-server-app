import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app) {
  let currentUser = null;

  const signup = (req, res) => {
    const user = dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already in use" });
      return;
    }
    currentUser = dao.createUser(req.body);
    res.json(currentUser);
  };

  const signin = (req, res) => {
    const { username, password } = req.body;
    currentUser = dao.findUserByCredentials(username, password);
    if (currentUser) {
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Invalid credentials. Please try again." });
    }
  };

  const profile = (req, res) => {
    if (!currentUser) {
      res.status(401).json({ message: "No user is logged in." });
    } else {
      res.json(currentUser);
    }
  };

  const updateUser = (req, res) => {
    const userId = req.params.userId;
    const userUpdates = req.body;
    dao.updateUser(userId, userUpdates);
    currentUser = dao.findUserById(userId);
    res.json(currentUser);
  };

  const signout = (req, res) => {
    currentUser = null;
    res.sendStatus(200);
  };

  const findCoursesForEnrolledUser = (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const courses = courseDao.findCoursesForEnrolledUser(userId);
    res.json(courses);
  };

  const getEnrolledCourses = (req, res) => {
    let { userId } = req.params;

    if (userId === "current") {
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }

    const enrolledCourses = enrollmentsDao.findEnrollmentsByUserId(userId);
    const courses = enrolledCourses
      .map((enrollment) => courseDao.findCoursesById(enrollment.course))
      .flat();

    res.json(courses);
  };

  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
  app.get("/api/users/:userId/enrolled-courses", getEnrolledCourses);
  app.put("/api/users/:userId", updateUser);
}
