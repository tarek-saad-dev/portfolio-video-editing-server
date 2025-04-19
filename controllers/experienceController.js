const Experience = require('../models/experienceModel');

// Get all experiences
exports.getExperiences = async (req, res) => {
    try {
        const experiences = await Experience.find({}).sort({ order: 1 });
        res.status(200).json(experiences);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching experiences', error: error.message });
    }
};

// Create a new experience
exports.createExperience = async (req, res) => {
    try {
        const experience = new Experience(req.body);
        await experience.save();
        res.status(201).json(experience);
    } catch (error) {
        res.status(400).json({ message: 'Error creating experience', error: error.message });
    }
};

// Create multiple experiences at once
exports.createManyExperiences = async (req, res) => {
    try {
        const { experiences } = req.body;
        
        if (!Array.isArray(experiences)) {
            return res.status(400).json({ message: 'Experiences must be an array' });
        }
        
        const result = await Experience.insertMany(experiences, { ordered: false });
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: 'Error creating experiences', error: error.message });
    }
};

// Get a single experience by ID
exports.getExperienceById = async (req, res) => {
    try {
        const experience = await Experience.findById(req.params.id);
        if (!experience) {
            return res.status(404).json({ message: 'Experience not found' });
        }
        res.status(200).json(experience);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching experience', error: error.message });
    }
};

// Update an experience
exports.updateExperience = async (req, res) => {
    try {
        const experience = await Experience.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!experience) {
            return res.status(404).json({ message: 'Experience not found' });
        }
        
        res.status(200).json(experience);
    } catch (error) {
        res.status(400).json({ message: 'Error updating experience', error: error.message });
    }
};

// Delete an experience
exports.deleteExperience = async (req, res) => {
    try {
        const experience = await Experience.findByIdAndDelete(req.params.id);
        
        if (!experience) {
            return res.status(404).json({ message: 'Experience not found' });
        }
        
        res.status(200).json({ message: 'Experience deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting experience', error: error.message });
    }
};