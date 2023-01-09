const db = require("../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");

//Get the user model
const User = db.users;
const Role = db.roles;

//Create a new user / SignUp
const createUser = async (req, res) => {
  let err = "";

  let details = {
    first_name: req.body.first_name ? req.body.first_name : null,
    last_name: req.body.last_name ? req.body.last_name : null,
    mobile: req.body.mobile ? req.body.mobile : null,
    email: req.body.email ? req.body.email : (err = "Email is required"),
    password: req.body.password
      ? req.body.password
      : (err = "Password is required"),
    roleId: req.body.roleId ? req.body.roleId : null,
  };

  if (err) {
    return res.status(400).json({
      status: false,
      errors: { err },
    });
  }

  try {
    //Check if the user already exists
    let user = await User.findOne({ where: { email: details.email } });
    if (user)
      return res.status(400).json({
        status: false,
        errors: {
          message: "Email address already exists.",
        },
      });

    //Check if role exists
    let role = await Role.findOne({ where: { id: details.roleId } });
    if (req.body.roleId && !role) {
      return res.status(400).json({
        status: false,
        errors: {
          message: "Role does not exist.",
        },
      });
    }

    //Hash the password
    const hashPassword = await bcrypt.hash(details.password, 10);
    details.password = hashPassword;

    //Create a new user
    user = await User.create(details);
    delete user.dataValues.password;
    
    //Send the user details
    res.status(201).json({
      status: true,
      content: {
        data: user,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      status: false,
      errors: [
        {
          message: "Something went wrong.",
        },
      ],
    });
  }
};

//Sign in a user / Login
const loginUser = async (req, res) => {
  let err = "";

  //check if both email & password is provided
  let details = {
    email: req.body.email ? req.body.email : (err = "Email is required"),
    password: req.body.password
      ? req.body.password
      : (err = "Password is required"),
  };

  if (err) {
    return res.status(400).json({
      status: false,
      errors: {
        message: err,
      },
    });
  }

  try {
    //Check if the user exists
    let user = await User.findOne({ where: { email: details.email } });
    if (!user)
      return res.status(400).json({
        status: false,
        errors: {
          message: "User does not exist",
        },
      });

    const hashPassword = await bcrypt.hash(details.password, 10);

    //Check if the password is Incorrect
    const validate = await bcrypt.compare(details.password, hashPassword);

    if (!validate)
      return res.status(400).json({
        status: false,
        errors: {
          message: "Password is incorrect",
        },
      });

    delete user.dataValues.password;

    //Create a JWT token with userId as well as their scopes
    const jstoken = await createJWT(user);

    //Send the user details
    res.status(200).json({
      status: true,
      content: {
        data: user,
        token: jstoken,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      status: false,
      errors: {
        message: "Something went wrong.",
      },
    });
  }
};

//Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({
      status: true,
      content: {
        users,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      status: false,
      errors: {
        message: "Something went wrong.",
      },
    });
  }
};

//Get a user by id
const getUserById = async (req, res) => {
  try {
    //get User by id and its associated role
    const user = await User.findOne({
      where: { id: req.params.id },
      include: [Role],
    });
    if (!user)
      return res.status(400).json({
        status: false,
        errors: {
          message: "User does not exist",
        },
      });

    res.status(200).json({
      status: true,
      content: { user },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      status: false,
      errors: {
        message: "Something went wrong.",
      },
    });
  }
};

const createJWT = async (user) => {
  //get user associated role and its scopes
  const scopes = await Role.findOne({
    where: { id: user.roleId },
  });

  //create a token
  const token = sign(
    {
      id: user.id,
      scopes: scopes ? scopes.scopes : [],
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "10h",
    }
  );
  // console.log(token);
  return token;
};

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
};
