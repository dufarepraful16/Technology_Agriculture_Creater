const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepo = require('../../models/repository/userRepository');
const { usersRoles } = require('../../config/options');
const MESSAGES = require('../../helpers/messagesHelper');
const { resCode, apiErrorStrings, apiSuccessStrings, errorTypes } = MESSAGES;

const userObj = {


  register: async (req, res) => {
    const { name, email, password, phone } = req.body;
  
    try {
      const existingUser = await userRepo.findByUserByEmail(email);
      if (existingUser) {
        return res.status(resCode.HTTP_BAD_REQUEST).json({
          message: apiErrorStrings.USER_EXISTS('email'),
          errorType: errorTypes.ACCOUNT_ALREADY_EXIST,
        });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = await userRepo.createUser({
        name,
        email,
        password: hashedPassword,
        phone,
        role: usersRoles.SCP,
      });
  
      return res.status(resCode.HTTP_CREATE).json({
        message: apiSuccessStrings.SIGNUP_SUCCESS,
        userId: user._id,
      });
    } catch (err) {
      return res.status(resCode.HTTP_INTERNAL_SERVER_ERROR).json({
        message: apiErrorStrings.SERVER_ERROR,
        error: err.message,
        errorType: errorTypes.INTERNAL_SERVER_ERROR,
      });
    }
  },
  
  login: async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await userRepo.findByUserByEmail(email);
      if (!user) {
        return res.status(resCode.HTTP_BAD_REQUEST).json({
          message: apiErrorStrings.INVALID_CREDENTIALS,
          errorType: errorTypes.UNAUTHORIZED_ACCESS,
        });
      }
  
      if (user.role !== usersRoles.SCP) {
        return res.status(resCode.HTTP_FORBIDDEN).json({
          message: apiErrorStrings.UNAUTHORIZED_ACCESS,
          errorType: errorTypes.UNAUTHORIZED_ACCESS,
        });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(resCode.HTTP_BAD_REQUEST).json({
          message: apiErrorStrings.INVALID_CREDENTIALS,
          errorType: errorTypes.UNAUTHORIZED_ACCESS,
        });
      }
  
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      return res.status(resCode.HTTP_OK).json({ token });
    } catch (err) {
      return res.status(resCode.HTTP_INTERNAL_SERVER_ERROR).json({
        message: apiErrorStrings.SERVER_ERROR,
        error: err.message,
        errorType: errorTypes.INTERNAL_SERVER_ERROR,
      });
    }
  }
  

}
module.exports = userObj;

