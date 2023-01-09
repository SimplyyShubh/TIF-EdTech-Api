const userController = require("../controllers/userController");
const roleController = require("../controllers/roleController");
const studentController = require("../controllers/studentController");
const schoolController = require("../controllers/schoolController");

const router = require("express").Router();

//Custom auth middleware to check token and scope
const { checkAuth } = require("../auth/validation");

//Routes for user
router.post("/User/signup", userController.createUser);
router.post("/User/login", userController.loginUser);
router.get("/User/", checkAuth("user-get"), userController.getAllUsers);
router.get("/User/:id", checkAuth("user-get"), userController.getUserById);

//Routes for role
router.get("/role", checkAuth("role-get"), roleController.getRoles);
router.post("/role", roleController.createRole);

//Routes for student
router.get("/student", checkAuth("student-get"), studentController.getAllStudents);
router.post("/student", checkAuth("student-create"), studentController.createStudent);

//Routes for school
router.get("/school", checkAuth("school-get"), schoolController.getAllSchools);
router.post("/school", checkAuth("school-create"), schoolController.createSchool);
router.get("/school/students", checkAuth("school-students"), schoolController.getAllSchoolStudents
);

module.exports = router;
