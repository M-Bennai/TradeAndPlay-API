require("dotenv").config();

const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const accessToken = req.header("accessToken");
  if (!accessToken)
    return res.status(400).json({ error: "user not logged IN " });
  try {
    const validToken = verify(accessToken, process.env.JWT_SECRET);

    req.user = validToken;
    if (validToken) {
      return next();
    }
  } catch (error) {
    console.log("error :>> ", error);
    return res.json({ error: error });
  }
};

module.exports = validateToken;
