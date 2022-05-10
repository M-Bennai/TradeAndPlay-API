require("dotenv").config();
//rsconst jwt = require("jsonwebtoken");
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

// module.exports = (req, res, next) => {
//   const authorizationHeader = req.headers.authorization;

//   if (!authorizationHeader) {
//     const message =
//       "'Vous n'avez pas fourni de jeton d'authentification. Ajoutez-en un dans l'entête de la requete";
//     return res.status(401).json({ message });
//   }

//   const token = authorizationHeader.split(" ")[1];
//   const decodedToken = jwt.verify(
//     token,
//     process.env.JWT_SECRET,
//     (error, decodedToken) => {
//       if (error) {
//         const message = `L'utilisateur n'est pas autorisé à accèder à cette ressource.`;
//         return res.status(401).json({ message, data: error });
//       }

//       const userId = decodedToken.userId;
//       if (req.body.userId && req.body.userId !== userId) {
//         const message = `L'identifiant de l'utilisateur est invalide`;
//         res.status(401).json({ message });
//       } else {
//         next();
//       }
//     }
//   );
// };
