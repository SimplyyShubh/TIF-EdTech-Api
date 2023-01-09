const db = require("../models");

//Get the role Model
const Role = db.roles;

//Create a new Role
const createRole = async (req, res) => {
  let err = "";

  let details = {
    name: req.body.name ? req.body.name : (err = "Role name is required"),
    scopes: req.body.scopes ? req.body.scopes : (err = "Scopes are required"),
  };

  if (err) {
    return res.status(400).json({
      status: false,
      content: {
        errors: {
          message: err,
        },
      },
    });
  }

  try {
    //Check if the role already exists
    let role = await Role.findOne({ where: { name: details.name } });
    if (role) return res.status(400).json({ 
        status: false,
        errors: {
            message: "Role already exists"
        }
    });

    //Create a new role
    role = await Role.create(details);

    //Send the role details
    res.status(201).json({
      status: true,
      content: {
        data: role,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(400).send({
        status: false,
        errors: [ error]
    });
  }
};

//Get All Roles
const getRoles = async (req, res) => {
  let err = "";

  try {
    //Get all roles
    let roles = await Role.findAll();

    //Send the roles
    res.status(200).json({
        status: true,
        content: {
            data: roles
        }
    });
  } catch (err) {
    console.error(error.message);
    res.status(500).send(
        {
            status: false,
            errors: {error}
        }
    );
  }
};

module.exports = {
  createRole,
  getRoles,
};
