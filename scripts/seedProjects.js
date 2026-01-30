const mongoose = require('mongoose');
require('dotenv').config();
const Project = require('../models/projectModel');

// Initial projects data
// Note: Replace YouTube URLs with your actual video URLs
const initialProjects = [
  {
    title: "Neon Nights",
    category: "Short Film",
    year: 2024,
    durationSec: 180, // 3:00
    description: "A visually stunning short film exploring the vibrant nightlife of urban landscapes through neon-lit streets and dynamic cinematography.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Replace with actual YouTube URL
    // thumbnailUrl is optional - will be auto-generated from YouTube if not provided
    tools: ["Adobe Premiere Pro", "After Effects", "DaVinci Resolve", "Cinema 4D"],
    isFeatured: true,
    sortOrder: 1
  },
  {
    title: "Golden Hour",
    category: "Commercial",
    year: 2024,
    durationSec: 90, // 1:30
    description: "A commercial project capturing the essence of luxury brands during the golden hour, featuring elegant transitions and color grading.",
    youtubeUrl: "https://youtu.be/dQw4w9WgXcQ", // Can use short URL format
    tools: ["Final Cut Pro", "Color Finale", "Motion"],
    isFeatured: true,
    sortOrder: 2
  },
  {
    title: "The Interview",
    category: "Documentary",
    year: 2023,
    durationSec: 1200, // 20:00
    description: "An in-depth documentary featuring interviews with industry leaders, showcasing authentic storytelling and professional editing techniques.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Replace with actual YouTube URL
    thumbnailUrl: "/thumbnails/the-interview.jpg", // Manual thumbnail (optional)
    tools: ["Adobe Premiere Pro", "Audition", "Photoshop"],
    isFeatured: false,
    sortOrder: 0
  },
  {
    title: "Skyline",
    category: "Reel",
    year: 2024,
    durationSec: 60, // 1:00
    description: "A dynamic showreel showcasing architectural videography and time-lapse techniques of urban skylines.",
    youtubeUrl: "dQw4w9WgXcQ", // Can use just the video ID
    tools: ["DaVinci Resolve", "LRTimelapse", "After Effects"],
    isFeatured: true,
    sortOrder: 3
  },
  {
    title: "Breaking Point",
    category: "Short Film",
    year: 2023,
    durationSec: 240, // 4:00
    description: "A dramatic short film exploring themes of resilience and transformation, featuring intense editing and sound design.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Replace with actual YouTube URL
    tools: ["Adobe Premiere Pro", "After Effects", "Pro Tools"],
    isFeatured: true,
    sortOrder: 4
  },
  {
    title: "Chromatic",
    category: "Music Video",
    year: 2024,
    durationSec: 210, // 3:30
    description: "A vibrant music video with experimental color grading and rhythmic editing synchronized to the beat.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Replace with actual YouTube URL
    tools: ["Final Cut Pro", "DaVinci Resolve", "After Effects", "Trapcode Suite"],
    isFeatured: true,
    sortOrder: 5
  }
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_PROD);
    console.log('✅ MongoDB connected...');
    
    // Drop old indexes that might conflict
    try {
      await Project.collection.dropIndex('id_1');
      console.log('🗑️  Dropped old id index');
    } catch (err) {
      // Index might not exist, that's okay
      if (err.code !== 27) { // 27 = IndexNotFound
        console.log('⚠️  Could not drop old index (might not exist)');
      }
    }
    
    // Clear existing projects
    await Project.deleteMany({});
    console.log('🗑️  Existing projects cleared');
    
    // Insert new projects
    await Project.insertMany(initialProjects);
    console.log(`✅ ${initialProjects.length} projects seeded successfully`);
    
    // Display seeded projects
    const projects = await Project.find({}).sort({ sortOrder: 1 });
    console.log('\n📋 Seeded Projects:');
    projects.forEach((project, index) => {
      console.log(`   ${index + 1}. ${project.title} (${project.category}, ${project.year})`);
    });
    
    // Disconnect
    await mongoose.disconnect();
    console.log('\n✅ MongoDB disconnected');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding projects:', error);
    process.exit(1);
  }
};

connectDB();

