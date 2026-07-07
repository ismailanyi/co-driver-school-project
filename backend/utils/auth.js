const jsonwebtoken = require("jsonwebtoken");

const verifyToken = (req) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    const err = new Error("Not Authorized");
    err.statusCode = 403;
    throw err;
  }
  
  try {
    return jsonwebtoken.verify(token, process.env.jwtSecret);
  } catch (error) {
    const err = new Error("Invalid Token");
    err.statusCode = 401;
    throw err;
  }
};

module.exports = {
  verifyToken
};
