/**
 * Migration Script: Convert date field from String to Date
 * 
 * This script converts the 'date' field in all projects from String format (MM/DD/YYYY)
 * to proper Date objects for correct sorting.
 * 
 * Usage:
 *   node scripts/migrateDateField.js
 * 
 * IMPORTANT:
 *   1. Backup your database first
 *   2. Update MongoDB connection string in .env
 *   3. Test on a development database first
 */

require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB connection
const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI_PROD || process.env.MONGO_URI_PROD);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

/**
 * Convert date string (MM/DD/YYYY) to Date object
 * @param {string|Date} dateValue - Date as string or Date object
 * @returns {Date} Date object
 */
function convertToDate(dateValue) {
    // If already a Date object, return it
    if (dateValue instanceof Date) {
        return dateValue;
    }

    // If it's a string, try to parse it
    if (typeof dateValue === 'string') {
        // Try MM/DD/YYYY format
        const mmddyyyyMatch = dateValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (mmddyyyyMatch) {
            const [, month, day, year] = mmddyyyyMatch;
            return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        }

        // Try ISO format or other standard formats
        const parsedDate = new Date(dateValue);
        if (!isNaN(parsedDate.getTime())) {
            return parsedDate;
        }
    }

    // If we can't parse it, return current date as fallback
    console.warn(`⚠️  Could not parse date: ${dateValue}, using current date`);
    return new Date();
}

/**
 * Main migration function
 */
async function migrateDateField() {
    try {
        console.log('🔄 Starting date field migration...\n');

        // Get direct access to the collection
        const db = mongoose.connection.db;
        const projectsCollection = db.collection('projects');

        // Find all projects
        const projects = await projectsCollection.find({}).toArray();
        console.log(`📦 Found ${projects.length} projects to check\n`);

        if (projects.length === 0) {
            console.log('⚠️  No projects found');
            return;
        }

        let updatedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;
        const errors = [];

        // Process each project
        for (const project of projects) {
            try {
                // Check if date field exists and needs conversion
                if (!project.date) {
                    // If no date field, try to use createdAt or current date
                    const dateValue = project.createdAt || new Date();
                    await projectsCollection.updateOne({ _id: project._id }, { $set: { date: dateValue } });
                    updatedCount++;
                    console.log(`✅ Added date field to: ${project.title || project._id} (using ${project.createdAt ? 'createdAt' : 'current date'})`);
                } else if (typeof project.date === 'string') {
                    // Convert string date to Date object
                    const dateObject = convertToDate(project.date);
                    await projectsCollection.updateOne({ _id: project._id }, { $set: { date: dateObject } });
                    updatedCount++;
                    console.log(`✅ Converted date for: ${project.title || project._id} (${project.date} → ${dateObject.toISOString()})`);
                } else if (project.date instanceof Date) {
                    // Already a Date object, skip
                    skippedCount++;
                    console.log(`⏭️  Skipped (already Date): ${project.title || project._id}`);
                } else {
                    // Unknown type, convert to Date
                    const dateObject = new Date(project.date);
                    await projectsCollection.updateOne({ _id: project._id }, { $set: { date: dateObject } });
                    updatedCount++;
                    console.log(`✅ Converted date for: ${project.title || project._id}`);
                }
            } catch (error) {
                errorCount++;
                const errorMsg = `❌ Error processing project "${project.title || project._id}": ${error.message}`;
                errors.push(errorMsg);
                console.error(errorMsg);
            }
        }

        // Summary
        console.log('\n' + '='.repeat(60));
        console.log('📊 Migration Summary:');
        console.log(`✅ Updated: ${updatedCount}`);
        console.log(`⏭️  Skipped (already correct): ${skippedCount}`);
        console.log(`❌ Errors: ${errorCount}`);
        console.log('='.repeat(60));

        if (errors.length > 0) {
            console.log('\n⚠️  Errors encountered:');
            errors.forEach(err => console.log(`   ${err}`));
        }

        // Verify migration
        const verifyProjects = await projectsCollection.find({}).toArray();
        const dateTypeCount = verifyProjects.filter(p => p.date instanceof Date).length;
        console.log(`\n📈 Verification: ${dateTypeCount}/${verifyProjects.length} projects have Date type for 'date' field`);

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
        await migrateDateField();
        console.log('\n✅ Migration completed successfully!');
        console.log('\n💡 Next steps:');
        console.log('   1. Verify the data in your database');
        console.log('   2. Test the API endpoints to ensure sorting works correctly');
        console.log('   3. Restart your server to apply the schema changes');
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

module.exports = { migrateDateField, convertToDate };