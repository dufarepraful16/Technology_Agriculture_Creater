const User = require('../userModel');
const MESSAGES = require('../../helpers/messagesHelper');
const { resCode, apiErrorStrings, apiSuccessStrings, errorTypes } = MESSAGES;
const { usersRoles } = require('../../config/options');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getAndCountAll = async (query) => {
   const res = await User.aggregate(query);
   return {
     data: res[0].data,
     count: res[0].metadata
       ? res[0].metadata.length
         ? res[0].metadata[0].total
         : 0
       : 0,
   };
 };

exports.createUser = async (data) => {
  return await User.create(data);
};

exports.createFarmer = async (userData) => User.create(userData);

exports.findByUserByEmail = async (email) => User.findOne({ email });

exports.findById = async (id) => {
  return await User.findById(id);
};

exports.checkAndCreateUser = async (body) => {
   const isDuplicate = await this.checkDuplicateUser(body);
 
   if (isDuplicate) {
     return {
       success: false,
       message: apiErrorStrings.USER_EXISTS('email or phone'),
       errorType: errorTypes.ACCOUNT_ALREADY_EXIST,
     };
   }
 
   const hashedPassword = await bcrypt.hash(body.password, 10);
 
   const user = await this.createUser({
     name: body.name,
     email: body.email,
     password: hashedPassword,
     phone: body.phone,
     role: usersRoles.SCP,
   });
 
   return {
     success: true,
     message: apiSuccessStrings.SIGNUP_SUCCESS,
     userId: user._id,
   };
 };

 exports.checkDuplicateUser = async (body, id) => {
   try {
     const query = {
       $or: [
         { email: body.email },
         { phone: body.phone },
       ],
     };
 
     if (id) {
       query._id = { $ne: id };
     }
 
     return await User.findOne(query);
   } catch (error) {
     throw new Error(error.message || 'Error checking for duplicate user.');
   }
 };


 exports.checkAndLoginUser = async (body) => {
   const { email, password } = body;
 
   const user = await this.findByUserByEmail(email);
   if (!user) {
     return {
       success: false,
       message: apiErrorStrings.INVALID_CREDENTIALS,
       errorType: errorTypes.UNAUTHORIZED_ACCESS,
     };
   }
 
   if (user.role !== usersRoles.SCP) {
     return {
       success: false,
       message: apiErrorStrings.UNAUTHORIZED_ACCESS,
       errorType: errorTypes.UNAUTHORIZED_ACCESS,
     };
   }
 
   const isMatch = await bcrypt.compare(password, user.password);
   if (!isMatch) {
     return {
       success: false,
       message: apiErrorStrings.INVALID_CREDENTIALS,
       errorType: errorTypes.UNAUTHORIZED_ACCESS,
     };
   }
 
   const token = jwt.sign(
     { userId: user._id, role: user.role },
     process.env.JWT_SECRET,
     { expiresIn: '1h' }
   );
 
   return {
     success: true,
     message: apiSuccessStrings.SIGNIN_SUCCESS,
     token,
   };
 };
 
 


exports.checkAndCreate = async (body) => {
   const isDuplicate = await this.checkDuplicateFarmer(body);
   if (isDuplicate) {
     return {
       success: false,
       message: apiErrorStrings.Data_EXISTS('Farmer'),
     };
   } else {
     existingData = await createFarmer(body);
     return {
       success: true,
       message: apiSuccessStrings.ADDED('Farmer'),
     };
   }
 };


 exports.checkDuplicateFarmer = async (body, id) => {
   try {
     const query = {
       $or: [
         { phone: body.phone },
       ]
     };
 
     if (id) {
       query._id = { $ne: id };
     }
 
     return await User.findOne(query);
   } catch (error) {
     throw new Error(error.message || 'Error checking for duplicate farmer.');
   }
 };


 const createFarmer = async (payload) =>
   await User.create({
       name: payload.name,
       phone: payload.phone,
       village: payload.village,
       cropType: payload.cropType,
       createdBy: payload.createdBy,
       role: usersRoles.FARMER,
   });

