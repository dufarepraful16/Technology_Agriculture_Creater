require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('../src/controllers/user/routes');
const farmerDetailsRoutes = require('../src/controllers/farmerDeatils/routes');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

app.use('/api/auth', authRoutes);
app.use('/api/farmer-details', farmerDetailsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
