// api/index.js

const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv').config();

// Initialize Express app
const app = express();

// ============================================
// CORS CONFIGURATION - ضع هذا قبل الـ routes
// ============================================
const PRODUCTION_ORIGIN = 'https://portfolio-video-editing-wheat.vercel.app';

const corsOptions = {
    origin: function(origin, callback) {
        // Production Frontend
        if (origin === PRODUCTION_ORIGIN) {
            return callback(null, true);
        }

        // Optional: Allow Vercel preview URLs
        if (origin && origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }

        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight support

// ============================================
// OTHER MIDDLEWARE
// ============================================
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
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