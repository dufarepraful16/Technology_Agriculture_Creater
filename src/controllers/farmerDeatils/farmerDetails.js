const UserRepository = require('../../models/repository/userRepository');
const MESSAGES = require('../../helpers/messagesHelper');
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


    createFarmer: async (req, res) => {
        try {
          const createdBy = req.user.id;
          const payload = { ...req.body, createdBy };
          let response = await UserRepository.checkAndCreate(payload);
          return res.status(200).json(response);
        } catch (e) {
          const errors = MESSAGES.apiErrorStrings.SERVER_ERROR;
          return res.status(500).json({ message: errors, error: e.message });
        }
      },
      
      
}

module.exports = farmerDetailsObj;


