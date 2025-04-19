const mongoose = require('mongoose');
require('dotenv').config();
const Skill = require('../models/skillModel');

// Initial skills data with icon mapping information
const initialSkills = [
    { name: "Express.js", category: "backend", iconType: "react-icon", iconName: "SiExpress" },
    { name: "React", category: "frontend", iconType: "react-icon", iconName: "DiReact" },
    { name: "NestJS", category: "backend", iconType: "react-icon", iconName: "SiNestjs" },
    { name: "Next.js", category: "frontend", iconType: "react-icon", iconName: "SiNextdotjs" },
    { name: "TypeScript", category: "language", iconType: "react-icon", iconName: "SiTypescript" },
    { name: "Node.js", category: "backend", iconType: "react-icon", iconName: "DiNodejs" },
    { name: "MongoDB", category: "database", iconType: "react-icon", iconName: "SiMongodb" },
    { name: "MySQL", category: "database", iconType: "react-icon", iconName: "SiMysql" },
    { name: "PostgreSQL", category: "database", iconType: "react-icon", iconName: "SiPostgresql" },
    { name: "SQL Server", category: "database", iconType: "react-icon", iconName: "SiMicrosoftsqlserver" },
    { name: "Neo4j", category: "database", iconType: "react-icon", iconName: "SiNeo4J" },
    { name: "Python", category: "language", iconType: "react-icon", iconName: "DiPython" },
    { name: "Bootstrap", category: "frontend", iconType: "react-icon", iconName: "SiBootstrap" },
    { name: "Tailwind", category: "frontend", iconType: "react-icon", iconName: "SiTailwindcss" },
    { name: "Redux", category: "library", iconType: "react-icon", iconName: "SiRedux" },
    { name: "HTML", category: "frontend", iconType: "react-icon", iconName: "DiHtml5" },
    { name: "CSS", category: "frontend", iconType: "react-icon", iconName: "DiCss3" },
    { name: "JavaScript", category: "language", iconType: "react-icon", iconName: "DiJavascript1" },
    { name: "React Router", category: "library", iconType: "react-icon", iconName: "SiReactrouter" },
    { name: "Hooks", category: "library", iconType: "react-icon", iconName: "SiReacthookform" },
    { name: "Server-Side", category: "backend", iconType: "react-icon", iconName: "FaServer" },
    { name: "Open Ai", category: "other", iconType: "react-icon", iconName: "SiOpenai" },
    { name: "Custom Icon", category: "other", iconType: "custom-svg", iconName: "docker.svg" },
    { name: "No Icon", category: "other", iconType: "none", iconName: "" }
];

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI_PROD);
        console.log('MongoDB connected...');
        
        // Clear existing skills
        await Skill.deleteMany({});
        console.log('Existing skills cleared');
        
        // Insert new skills
        await Skill.insertMany(initialSkills);
        console.log('Skills seeded successfully');
        
        // Disconnect
        mongoose.disconnect();
        console.log('MongoDB disconnected');
    } catch (error) {
        console.error('Error seeding skills:', error);
        process.exit(1);
    }
};

connectDB();