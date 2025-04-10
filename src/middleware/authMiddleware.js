const jwt = require('jsonwebtoken');
const MESSAGES = require('../helpers/messagesHelper');
const { resCode, apiErrorStrings, apiSuccessStrings, errorTypes } = MESSAGES;

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: MESSAGES.apiErrorStrings.UNAUTHORIZED_ACCESS });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: MESSAGES.apiErrorStrings.FORBIDDEN });
  }
};

module.exports = authenticateUser;
