const db = require("../models");

//get models to be used
const Student = db.students;
const User = db.users;
const School = db.schools;

//create student
const createStudent = async (req, res) => {
  try {
    let err = "";
    const details = {
      name: req.body.name ? req.body.name : (err = "Name is required"),
      userId: req.body.userId ? req.body.userId : (err = "User Id is required"),
      schoolId: req.body.schoolId
        ? req.body.schoolId
        : (err = "School Id is required"),
    };

    //If any of the fields are missing
    if (err) {
      return res.status(400).json({
        status: false,
        errors: { err },
      });
    }

    //check if user or school exists
    const user = await User.findOne({ where: { id: details.userId } });
    const school = await School.findOne({ where: { id: details.schoolId } });
   
    //if user or school does not exist
    if(!user || !school){
        err = "User does not exist";
        if(!school) err = "School does not exit" ;

        return res.status(400).json({
            status: false,
            errors: { message: err },
        });
    }

    const student = await Student.create(details);

    //Send the student details
    res.status(200).json({
      status: true,
      content: {
        data: student,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      status: false,
      errors: {
        message: "Something went wrong",
      },
    });
  }
};

//get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll();
    res.status(200).json({
      status: true,
      content: {
        data: students,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      status: false,
      errors: {
        message: "Something went wrong",
      },
    });
  }
};

module.exports = {
  createStudent,
  getAllStudents,
};
