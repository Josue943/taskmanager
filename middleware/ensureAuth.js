const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) return res.status(403).send("Invalid Token");

  try {
    var user = jwt.verify(token, process.env.SECRET);
    req.user = user.id;
    next();
  } catch (ex) {
    return res.status(404).send("Invalid token");
  }
};
