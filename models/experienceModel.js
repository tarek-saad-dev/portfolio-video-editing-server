const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    duration: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: [String],
        required: true
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Experience = mongoose.model('Experience', experienceSchema);

module.exports = Experience;