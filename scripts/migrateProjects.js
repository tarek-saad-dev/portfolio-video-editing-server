/**
 * Migration Script: Projects Collection
 * 
 * Migrates from old schema to new video editing projects schema
 * 
 * Usage:
 *   node scripts/migrateProjects.js
 * 
 * Make sure to:
 *   1. Backup your database first
 *   2. Update MongoDB connection string in .env
 *   3. Test on a development database first
 */

require('dotenv').config();
const mongoose = require('mongoose');
const ProjectOld = require('../models/projectModel'); // Old model
const ProjectNew = require('../models/projectModel.new'); // New model

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

/**
 * Convert duration from "mm:ss" format to seconds
 * @param {string} durationString - Duration in "mm:ss" format
 * @returns {number} Duration in seconds
 */
function durationToSeconds(durationString) {
  if (!durationString || typeof durationString !== 'string') {
    return 0;
  }
  
  const parts = durationString.split(':');
  if (parts.length === 2) {
    const minutes = parseInt(parts[0], 10) || 0;
    const seconds = parseInt(parts[1], 10) || 0;
    return (minutes * 60) + seconds;
  }
  
  // If it's already a number (seconds), return it
  if (!isNaN(durationString)) {
    return parseInt(durationString, 10);
  }
  
  return 0;
}

/**
 * Convert year from string to number
 * @param {string|number} yearValue - Year as string or number
 * @returns {number} Year as number (1900-2100)
 */
function yearToNumber(yearValue) {
  if (typeof yearValue === 'number') {
    return (yearValue >= 1900 && yearValue <= 2100) ? yearValue : new Date().getFullYear();
  }
  
  if (typeof yearValue === 'string') {
    // Try to extract year from date string
    const yearMatch = yearValue.match(/\d{4}/);
    if (yearMatch) {
      const year = parseInt(yearMatch[0], 10);
      return (year >= 1900 && year <= 2100) ? year : new Date().getFullYear();
    }
  }
  
  return new Date().getFullYear();
}

/**
 * Convert thumbnail path to URL
 * @param {string} thumbnail - Thumbnail path or URL
 * @returns {string} Thumbnail URL
 */
function getThumbnailUrl(thumbnail) {
  if (!thumbnail) {
    return '/thumbnails/default.jpg'; // Default thumbnail
  }
  
  // If it's already a URL, use it
  if (thumbnail.startsWith('http://') || thumbnail.startsWith('https://') || thumbnail.startsWith('/')) {
    return thumbnail;
  }
  
  // If it's a local import path, convert to URL path
  // Adjust this logic based on your actual thumbnail storage
  return `/thumbnails/${thumbnail}`;
}

/**
 * Map category to valid enum value
 * @param {string} category - Category string
 * @returns {string} Valid category enum value
 */
function mapCategory(category) {
  const validCategories = ['Short Film', 'Documentary', 'Commercial', 'Corporate', 'Reel', 'Music Video'];
  
  if (!category) {
    return 'Short Film'; // Default
  }
  
  // Check if it's already valid
  if (validCategories.includes(category)) {
    return category;
  }
  
  // Try to map common variations
  const categoryMap = {
    'short film': 'Short Film',
    'short': 'Short Film',
    'film': 'Short Film',
    'doc': 'Documentary',
    'documentary': 'Documentary',
    'commercial': 'Commercial',
    'corporate': 'Corporate',
    'reel': 'Reel',
    'showreel': 'Reel',
    'music video': 'Music Video',
    'mv': 'Music Video'
  };
  
  return categoryMap[category.toLowerCase()] || 'Short Film';
}

/**
 * Main migration function
 */
async function migrateProjects() {
  try {
    console.log('🔄 Starting migration...\n');
    
    // Fetch all old projects
    const oldProjects = await ProjectOld.find({});
    console.log(`📦 Found ${oldProjects.length} projects to migrate\n`);
    
    if (oldProjects.length === 0) {
      console.log('⚠️  No projects found to migrate');
      return;
    }
    
    let successCount = 0;
    let errorCount = 0;
    const errors = [];
    
    // Migrate each project
    for (const oldProject of oldProjects) {
      try {
        // Convert old project to new format
        const newProjectData = {
          title: oldProject.title || 'Untitled Project',
          category: mapCategory(oldProject.category),
          year: yearToNumber(oldProject.year || oldProject.date),
          durationSec: durationToSeconds(oldProject.duration),
          description: oldProject.description || '',
          thumbnailUrl: getThumbnailUrl(oldProject.thumbnail || oldProject.imgPath),
          tools: Array.isArray(oldProject.tools) ? oldProject.tools : [],
          isFeatured: oldProject.isFeatured !== undefined ? oldProject.isFeatured : true,
          sortOrder: oldProject.sortOrder || 0,
          createdAt: oldProject.createdAt || new Date(),
          updatedAt: new Date()
        };
        
        // Create new project document
        const newProject = new ProjectNew(newProjectData);
        await newProject.save();
        
        successCount++;
        console.log(`✅ Migrated: ${newProjectData.title}`);
        
      } catch (error) {
        errorCount++;
        const errorMsg = `❌ Error migrating project "${oldProject.title || oldProject.id}": ${error.message}`;
        errors.push(errorMsg);
        console.error(errorMsg);
      }
    }
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Migration Summary:');
    console.log(`✅ Successfully migrated: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log('='.repeat(50));
    
    if (errors.length > 0) {
      console.log('\n⚠️  Errors encountered:');
      errors.forEach(err => console.log(`   ${err}`));
    }
    
    // Verify migration
    const newProjectCount = await ProjectNew.countDocuments({});
    console.log(`\n📈 Total projects in new collection: ${newProjectCount}`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    await connectDB();
    await migrateProjects();
    console.log('\n✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if script is executed directly
if (require.main === module) {
  main();
}

module.exports = { migrateProjects, durationToSeconds, yearToNumber, getThumbnailUrl, mapCategory };

