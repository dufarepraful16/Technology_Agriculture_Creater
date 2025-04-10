const User = require('../userModel');
const MESSAGES = require('../../helpers/messagesHelper');
const { resCode, apiErrorStrings, apiSuccessStrings, errorTypes } = MESSAGES;
const { usersRoles } = require('../../config/options');

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


exports.checkAndCreate = async (body) => {
   const isDuplicate = await this.checkDuplicateRole(body);
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


 exports.checkDuplicateRole = async (body, id) => {
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

