const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split("")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId; //recup userId token
    req.auth = { userId: userId };
    if (req.body.userId && req.body.userId !== userId) {
      throw " Invalid UserId";
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Invalid request !"),
    });
  }
};

