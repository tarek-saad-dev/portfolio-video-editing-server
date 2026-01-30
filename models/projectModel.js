const mongoose = require('mongoose');
const { extractYouTubeId, normalizeYouTubeUrl } = require('../utils/youtubeHelper');

/**
 * Project Schema for Video Editing Portfolio
 * 
 * Fields:
 * - title: Project title (required)
 * - category: Project category from predefined list (required)
 * - year: Year of project, 1900-2100 (required)
 * - durationSec: Duration in seconds (required)
 * - description: Project description (required)
 * - youtubeUrl: YouTube video URL or ID (optional)
 * - thumbnailUrl: Manual thumbnail URL (optional, auto-generated from YouTube if not provided)
 * - tools: Array of tool names used (required, default [])
 * - isFeatured: Whether project is featured (optional, default true)
 * - sortOrder: Display sort order (optional, default 0)
 * - createdAt: Creation timestamp (auto)
 * - updatedAt: Update timestamp (auto)
 */
const projectSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [1, 'Title must be at least 1 character'],
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: {
            values: ['Short Film', 'Documentary', 'Commercial', 'Corporate', 'Reel', 'Music Video'],
            message: 'Category must be one of: Short Film, Documentary, Commercial, Corporate, Reel, Music Video'
        }
    },
    year: {
        type: Number,
        required: [true, 'Year is required'],
        min: [1900, 'Year must be at least 1900'],
        max: [2100, 'Year cannot exceed 2100']
    },
    durationSec: {
        type: Number,
        required: [true, 'Duration in seconds is required'],
        min: [0, 'Duration cannot be negative']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        minlength: [1, 'Description must be at least 1 character'],
        maxlength: [5000, 'Description cannot exceed 5000 characters']
    },
    youtubeUrl: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                if (!v) return true; // Optional field
                // Basic validation - full validation happens in pre-save hook
                return typeof v === 'string' && v.trim().length > 0;
            },
            message: 'YouTube URL must be a non-empty string'
        }
    },
    thumbnailUrl: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                if (!v) return true; // Optional field
                // Validate URL or path format
                return /^(https?:\/\/|\/).*/.test(v);
            },
            message: 'Thumbnail URL must be a valid URL or path'
        }
    },
    tools: {
        type: [String],
        required: true,
        default: [],
        validate: {
            validator: function(v) {
                return Array.isArray(v) && v.every(tool => typeof tool === 'string' && tool.trim().length > 0);
            },
            message: 'Tools must be an array of non-empty strings'
        }
    },
    isFeatured: {
        type: Boolean,
        default: true
    },
    sortOrder: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
    collection: 'projects'
});

// Pre-save hook: Normalize YouTube URL
projectSchema.pre('save', function(next) {
    if (this.youtubeUrl) {
        const normalized = normalizeYouTubeUrl(this.youtubeUrl);
        if (normalized) {
            this.youtubeUrl = normalized;
        }
    }
    next();
});

// Indexes for performance
projectSchema.index({ category: 1, year: -1 });
projectSchema.index({ isFeatured: 1, sortOrder: 1, year: -1 });
projectSchema.index({ tools: 1 });
projectSchema.index({ title: 'text', description: 'text' });

// Virtual for formatted duration (mm:ss)
projectSchema.virtual('durationFormatted').get(function() {
    const minutes = Math.floor(this.durationSec / 60);
    const seconds = this.durationSec % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// Ensure virtuals are included in JSON output
projectSchema.set('toJSON', { virtuals: true });
projectSchema.set('toObject', { virtuals: true });

// Static method: Get featured projects
projectSchema.statics.getFeatured = function() {
    return this.find({ isFeatured: true })
        .sort({ sortOrder: 1, year: -1 });
};

// Static method: Get projects by category
projectSchema.statics.getByCategory = function(category) {
    return this.find({ category })
        .sort({ year: -1 });
};

// Static method: Get projects by tool
projectSchema.statics.getByTool = function(tool) {
    return this.find({ tools: tool })
        .sort({ year: -1 });
};

// Static method: Search projects
projectSchema.statics.search = function(query) {
    return this.find({ $text: { $search: query } })
        .sort({ score: { $meta: 'textScore' } });
};

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;