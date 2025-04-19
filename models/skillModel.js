const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    category: {
        type: String,
        enum: ['frontend', 'backend', 'database', 'language', 'framework', 'library', 'other'],
        default: 'other'
    },
    iconType: {
        type: String,
        enum: ['react-icon', 'custom-svg', 'none'],
        default: 'none'
    },
    iconName: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;