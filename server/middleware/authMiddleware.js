const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader?.replace("Bearer ", "") || req.query.token;

  if (!token) {
    console.log(`AUTH DENIED: No token provided for ${req.method} ${req.url}`);
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch user from DB to get their role
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.user = { 
      id: user._id,
      role: user.role,
      email: user.email,
      name: user.name
    };

    next();
  } catch (error) {
    console.error(`AUTH DENIED: Invalid token for ${req.method} ${req.url}. Error: ${error.message}`);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
