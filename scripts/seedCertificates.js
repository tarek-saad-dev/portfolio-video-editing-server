const mongoose = require('mongoose');
require('dotenv').config();
const Certificate = require('../models/certificateModel');

// Initial certificates data
const initialCertificates = [
  {
    imgPath: "/assets/certificates/mongo.png",
    title: "Introduction to MongoDB",
    description: "This course introduces you to NoSql databases and Mongo DB capabilities as one of NoSql DBMS to create your flexible, lightweight and cloud adaptive database.",
    orgLogos: ["/assets/company/mahara.png"],
    liveLink: "https://maharatech.gov.eg/mod/customcert/view.php?id=8665&downloadown=1",
    order: 1
  },
  {
    imgPath: "/assets/certificates/frank.png",
    title: "CIB - Frankfurt Summer training 2024",
    description: "This program focused on the principles, approaches, enhancing the participant's ability to effectively engage and collaborate within a professional environment.",
    orgLogos: ["/assets/company/cib.png", "/assets/company/frankfort.png"],
    order: 2
  },
  {
    imgPath: "/assets/certificates/linked.png",
    title: "CIB - LinkedIn Summer training 2024",
    description: "gaining valuable insights into the banking industry and enhancing professional skills through LinkedIn's curated learning modules. Acquired knowledge in financial services.",
    orgLogos: ["/assets/company/cib.png", "/assets/company/linkedin.png"],
    order: 3
  }
];

// Connect to MongoDB
const connectDB = async () => {
    try {
        const dbURI = process.env.MONGO_URI_PROD;
        await mongoose.connect(dbURI);
        console.log('MongoDB connected...');
        
        // Clear existing certificates
        await Certificate.deleteMany({});
        console.log('Existing certificates cleared');
        
        // Insert new certificates
        await Certificate.insertMany(initialCertificates);
        console.log('Certificates seeded successfully');
        
        // Disconnect
        mongoose.disconnect();
        console.log('MongoDB disconnected');
    } catch (error) {
        console.error('Error seeding certificates:', error);
        process.exit(1);
    }
};

connectDB();