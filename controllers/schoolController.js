const db = require("../models");

//Get the School Model
const School = db.schools;

//create school
const createSchool = async (req, res) => {
  let err = "";

  let details = {
    name: req.body.name ? req.body.name : (err = "Name is required"),
    city: req.body.city ? req.body.city : null,
    state: req.body.state ? req.body.state : null,
    country: req.body.country ? req.body.country : null,
  };

  if (err) {
    return res.status(400).json({
      status: false,
      errors: { err },
    });
  }

  try {
    //Check if the school already exists
    let school = await School.findOne({ where: { name: details.name } });
    if (school)
      return res.status(400).json({
        status: false,
        errors: {
          message: "School already exists.",
        },
      });

    //Create a new school
    school = await School.create(details);

    //Send the school details
    res.status(200).json({
      status: true,
      content: {
        data: school,
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

//get all schools
const getAllSchools = async (req, res) => {
  try {
    const schools = await School.findAll();
    res.status(200).json({
      status: true,
      content: {
        data: schools,
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

//get all students along with their school
const getAllSchoolStudents = async (req, res) => {
    try {
        const students = await School.findAll({
        include: [
            {
            model: db.students,
            as: "students",
            },
        ],
        });
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
}

module.exports = {
    createSchool,
    getAllSchools,
    getAllSchoolStudents,
}