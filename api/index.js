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
const corsOptions = {
    origin: ['http://localhost:5001', 'https://portfolio-graphic-design-umber.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // if needed for cookies
};

app.use(cors(corsOptions));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', 'https://portfolio-graphic-design-umber.vercel.app');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
}



app.use(morgan('dev'));
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
const connection = require('../conn/connection');
connection();

// Routes
const projectRoutes = require('../routes/projectRoutes');
const skillRoutes = require('../routes/skillRoutes');
const toolRoutes = require('../routes/toolRoutes');
const experienceRoutes = require('../routes/experienceRoutes');
const certificateRoutes = require('../routes/certificateRoutes');

app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/certificates', certificateRoutes);

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