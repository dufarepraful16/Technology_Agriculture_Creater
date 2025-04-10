const UserRepository = require('../../models/repository/userRepository');
const { usersRoles } = require('../../config/options');
const MESSAGES = require('../../helpers/messagesHelper');
const { resCode, apiErrorStrings, apiSuccessStrings, errorTypes } = MESSAGES;
const mongoose = require('mongoose');


const farmerDetailsObj = {

    getAll: async (req, res) => {
        try {
            let {
                page = 1,
                pageSize = 10,
                search = '',
                column = 'createdAt',
                direction = -1,
                userId,
            } = req.query;

            const skip = Math.max(0, parseInt(page, 10) - 1) * parseInt(pageSize, 10);

            const matchStage = {
                createdBy: new mongoose.Types.ObjectId(userId),
            };

            if (search.trim()) {
                matchStage.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { phone: { $regex: search, $options: 'i' } },
                ];
            }

            const pipeline = [
                { $match: matchStage },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        phone: 1,
                        village: 1,
                        cropType: 1,
                        createdAt: 1,
                    },
                },
                { $sort: { [column]: parseInt(direction) } },
                {
                    $facet: {
                        metadata: [{ $count: 'total' }],
                        data: [{ $skip: skip }, { $limit: parseInt(pageSize, 10) }],
                    },
                },
            ];

            const resp = await UserRepository.getAndCountAll(pipeline);
            return res.status(200).json(resp);
        } catch (e) {
            const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
            res.status(500).json({ message: errors });
            throw new Error(e);
        }
    },


    // registerFarmer: async (req, res) => {
    //     const { name, phone, village, cropType, createdBy } = req.body;

    //     try {
    //         const creator = await UserRepository.findById(createdBy);
    //         console.log("creator", creator);

    //         if (!creator || creator.role !== usersRoles.SCP) {
    //             return res.status(resCode.HTTP_FORBIDDEN).json({
    //                 message: apiErrorStrings.UNAUTHORIZED_ACCESS,
    //                 errorType: errorTypes.UNAUTHORIZED_ACCESS,
    //             });
    //         }

    //         const farmer = await UserRepository.createFarmer({
    //             name,
    //             phone,
    //             village,
    //             cropType,
    //             createdBy,
    //             role: usersRoles.FARMER,
    //             password: null,
    //         });

    //         return res.status(resCode.HTTP_CREATE).json({
    //             message: apiSuccessStrings.ADDED('Farmer'),
    //             farmerId: farmer._id,
    //         });
    //     } catch (err) {
    //         return res.status(resCode.HTTP_INTERNAL_SERVER_ERROR).json({
    //             message: apiErrorStrings.SERVER_ERROR,
    //             error: err.message,
    //             errorType: errorTypes.INTERNAL_SERVER_ERROR,
    //         });
    //     }

    // },


    createFarmer: async (req, res) => {
        try {
          let response = await UserRepository.checkAndCreate(req.body);
          return res.status(200).json(response);
        } catch (e) {
          const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
          return res.status(500).json({ message: errors, error: e.message });
        }
      },
      
}

module.exports = farmerDetailsObj;


