const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    imgPath: {
        type: String,
        required: true,
        trim: true
    },
    orgLogos: {
        type: [String],
        required: true
    },
    liveLink: {
        type: String,
        trim: true,
        default: ''
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Certificate = mongoose.model('Certificate', certificateSchema);

module.exports = Certificate;