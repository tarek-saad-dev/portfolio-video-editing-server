const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    imgPath: {
        type: String,
        required: true
    },
    imagePaths: {
        type: [String],
        default: []
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    ghLink: {
        type: String,
        required: true
    },
    demoLink: {
        type: String,
        default: ''
    },
    skills: {
        type: [String],
        default: []
    },
    technologies: {
        type: [String],
        default: []
    },
    tools: {
        type: [String],
        default: []
    },
    keyFeatures: {
        type: [String],
        default: []
    },
    date: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;