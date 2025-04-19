const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    category: {
        type: String,
        enum: ['development', 'design', 'deployment', 'database', 'version-control', 'api', 'authentication', 'other'],
        default: 'other'
    },
    iconType: {
        type: String,
        enum: ['react-icon', 'custom-svg', 'none'],
        default: 'react-icon'
    },
    iconName: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const Tool = mongoose.model('Tool', toolSchema);

module.exports = Tool;