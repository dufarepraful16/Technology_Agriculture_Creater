const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepo = require('../../models/repository/userRepository');
const { usersRoles } = require('../../config/options');
const MESSAGES = require('../../helpers/messagesHelper');
const { resCode, apiErrorStrings, apiSuccessStrings, errorTypes } = MESSAGES;

const userObj = {


  registerUser: async (req, res) => {
    try {
      const response = await userRepo.checkAndCreateUser(req.body);
      return res.status(response.success ? 201 : 400).json(response);
    } catch (e) {
      return res.status(500).json({
        message: apiErrorStrings.SERVER_ERROR,
        error: e.message,
        errorType: errorTypes.INTERNAL_SERVER_ERROR,
      });
    }
  },


  loginUser: async (req, res) => {
    try {
      const response = await userRepo.checkAndLoginUser(req.body);
      return res.status(response.success ? 200 : 400).json(response);
    } catch (e) {
      return res.status(500).json({
        message: apiErrorStrings.SERVER_ERROR,
        error: e.message,
        errorType: errorTypes.INTERNAL_SERVER_ERROR,
      });
    }
  },
  


}
module.exports = userObj;

