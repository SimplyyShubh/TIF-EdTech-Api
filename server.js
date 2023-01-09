const express = require("express");
const cors = require("cors");
const db = require("./models");

require("dotenv").config();

const app = express();

//Midlewares
app.use(cors()) ;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routes
app.get("/", (req, res) => {
  res.json({ a: "Test to Home page" });
});

//Routes for all the API endpoints
const router = require("./routes");
app.use("/", router);

//Start the server on the port
const PORT = process.env.APP_PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running => http://localhost:"+ PORT);
});
