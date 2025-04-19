const mongoose = require('mongoose');
require('dotenv').config();
const Tool = require('../models/toolModel');

// Initial tools data with icon mapping information
const initialTools = [
    { name: "VS Code", category: "development", iconType: "react-icon", iconName: "SiVisualstudiocode" },
    { name: "Postman", category: "api", iconType: "react-icon", iconName: "SiPostman" },
    { name: "MongoDB Compass", category: "database", iconType: "react-icon", iconName: "DiMongodb" },
    { name: "Swagger", category: "api", iconType: "react-icon", iconName: "SiSwagger" },
    { name: "GitHub", category: "version-control", iconType: "react-icon", iconName: "SiGithub" },
    { name: "Git", category: "version-control", iconType: "react-icon", iconName: "DiGit" },
    { name: "neondb", category: "database", iconType: "react-icon", iconName: "SiPostgresql" },
    { name: "Firebase", category: "deployment", iconType: "react-icon", iconName: "SiFirebase" },
    { name: "Vercel", category: "deployment", iconType: "react-icon", iconName: "SiVercel" },
    { name: "Netlify", category: "deployment", iconType: "react-icon", iconName: "SiNetlify" },
    { name: "Render", category: "deployment", iconType: "react-icon", iconName: "SiRender" },
    { name: "Stripe", category: "other", iconType: "react-icon", iconName: "FaCcStripe" },
    { name: "Figma", category: "design", iconType: "react-icon", iconName: "SiFigma" },
    { name: "API", category: "api", iconType: "react-icon", iconName: "TbApi" },
    { name: "Axios", category: "api", iconType: "react-icon", iconName: "SiAxios" },
    { name: "JWT", category: "authentication", iconType: "react-icon", iconName: "SiJsonwebtokens" },
    { name: "Open Ai", category: "other", iconType: "react-icon", iconName: "SiOpenai" }
];

// Connect to MongoDB
const connectDB = async () => {
    try {
        const dbURI = process.env.MONGO_URI_PROD;
        await mongoose.connect(dbURI);
        console.log('MongoDB connected...');
        
        // Clear existing tools
        await Tool.deleteMany({});
        console.log('Existing tools cleared');
        
        // Insert new tools
        await Tool.insertMany(initialTools);
        console.log('Tools seeded successfully');
        
        // Disconnect
        mongoose.disconnect();
        console.log('MongoDB disconnected');
    } catch (error) {
        console.error('Error seeding tools:', error);
        process.exit(1);
    }
};

connectDB();