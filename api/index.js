// api/index.js

const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(cors({ origin: true, credentials: true }));
app.use(cors({ origin: '*' }));
// app.use(cors({ origin: 'http://localhost:5001' })); // For local development
// app.use(cors({ origin: 'https://portfolio-ten-jet-74.vercel.app/' })); // Replace with your production URL

app.use(morgan('dev'));
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
const connection = require('../conn/connection');
connection();

// Routes

const projectRoutes = require('../routes/projectRoutes');

app.use('/api/projects', projectRoutes);

// Health check route
app.get('/', (req, res) => {
    res.send('API is running...');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// 👇 Export handler for Vercel
module.exports = app;
module.exports.handler = serverless(app);