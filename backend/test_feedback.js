const jwt = require("jsonwebtoken");
require("dotenv").config();
const token = jwt.sign({ user: "0e5c3ba0-b246-47fa-a77e-1c9211eb69a2" }, process.env.jwtSecret, { expiresIn: "1h" });
console.log(token);
