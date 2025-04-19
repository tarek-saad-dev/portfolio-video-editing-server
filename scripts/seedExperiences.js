const mongoose = require('mongoose');
require('dotenv').config();
const Experience = require('../models/experienceModel');

// Initial experiences data
const initialExperiences = [
  {
    title: "PHP and SQL Intern",
    company: "Information Technology Institute (ITI)",
    duration: "July 2023",
    type: "Internship Remotely",
    role: [
      "Studied full-stack web fundamentals including HTML, CSS, JavaScript, and backend development with PHP.",
      "Designed and implemented relational databases, and practiced API development and integration.",
    ],
    order: 1
  },
  {
    title: "IoT Project Consultant",
    company: "STEM School, El Obour, Egypt",
    duration: "January 2022",
    type: "Freelance Project Support",
    role: [
      "Collaborated with students on an IoT project involving temperature and soil moisture sensors to automate irrigation.",
      "Designed the mobile application UI/UX and improved backend logic and database integration.",
      "Guided students in understanding programming logic and Arduino code implementation.",
    ],
    order: 2
  },
  {
    title: "Android Full-Stack Development Trainee",
    company: "Information Technology Institute (ITI)",
    duration: "Summer 2024",
    type: "Training Program",
    role: [
      "Learned clean code principles and clean architecture through intensive training and a final 3-week team project.",
      "Led the team as project leader, managing GitHub branches and task distribution.",
      "Enhanced problem-solving and debugging skills through continuous feedback from instructors.",
    ],
    order: 3
  },
  {
    title: "Graduation Project – AI-Based Learning Path Recommender",
    company: "Faculty of Computers and Information",
    duration: "July 2024 – Present",
    type: "Academic Project",
    role: [
      "Developing an intelligent educational platform using machine learning to generate personalized programming learning paths.",
      "System analyzes users' learning styles, prior knowledge, and goals to suggest a tailored curriculum.",
      "Handled core logic design, algorithm development, and full-stack implementation.",
    ],
    order: 4
  },
  {
    title: "Top 10 Finalist – Benha Hackathon",
    company: "Benha University",
    duration: "January 2024",
    type: "Competition",
    role: [
      "Created a software solution to translate sign language into speech, aiding communication for the deaf and mute community.",
      "Selected among the top 10 teams from leading universities across Egypt.",
      "The idea was featured in Egyptian newspapers as a technological solution for a humanitarian challenge.",
    ],
    order: 5
  }
];

// Connect to MongoDB
const connectDB = async () => {
    try {
        const dbURI = process.env.MONGO_URI_PROD;
        await mongoose.connect(dbURI);
        console.log('MongoDB connected...');
        
        // Clear existing experiences
        await Experience.deleteMany({});
        console.log('Existing experiences cleared');
        
        // Insert new experiences
        await Experience.insertMany(initialExperiences);
        console.log('Experiences seeded successfully');
        
        // Disconnect
        mongoose.disconnect();
        console.log('MongoDB disconnected');
    } catch (error) {
        console.error('Error seeding experiences:', error);
        process.exit(1);
    }
};

connectDB();