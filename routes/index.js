const userController = require("../controllers/userController");
const roleController = require("../controllers/roleController");
const studentController = require("../controllers/studentController");
const schoolController = require("../controllers/schoolController");

const router = require("express").Router();

//Routes for user
router.post("/User/signup", userController.createUser);
router.post("/User/login", userController.loginUser);
router.get("/User/", userController.getAllUsers);
router.get("/User/:id", userController.getUserById);

//Routes for role
router.get("/role", roleController.getRoles);
router.post("/role", roleController.createRole);

//Routes for school
router.get("/school", schoolController.getAllSchools);
router.post("/school", schoolController.createSchool);
router.get("/school/students", schoolController.getAllSchoolStudents )

//Routes for student
router.get("/student", studentController.getAllStudents);
router.post("/student", studentController.createStudent);


module.exports = router;