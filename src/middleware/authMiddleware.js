const jwt = require('jsonwebtoken');

const auth = (roles = []) => {
  if (typeof roles === 'string') roles = [roles];

  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.sendStatus(401);

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);

      req.user = decoded;
      if (roles.length && !roles.includes(req.user.role)) {
        return res.sendStatus(403);
      }

      next();
    });
  };
};

module.exports = auth;
