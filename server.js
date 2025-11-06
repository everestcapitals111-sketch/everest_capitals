require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/everest');

const authRoutes = require('./auth');
const adminRoutes = require('./admin');
const clientRoutes = require('./client');


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
