const Skill = require('../models/skillModel');

// Get all skills
exports.getSkills = async (req, res) => {
    try {
        const skills = await Skill.find({});
        res.status(200).json(skills);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching skills', error: error.message });
    }
};

// Create a new skill
exports.createSkill = async (req, res) => {
    try {
        const skill = new Skill(req.body);
        await skill.save();
        res.status(201).json(skill);
    } catch (error) {
        res.status(400).json({ message: 'Error creating skill', error: error.message });
    }
};

// Create multiple skills at once
exports.createManySkills = async (req, res) => {
    try {
        const { skills } = req.body;
        
        if (!Array.isArray(skills)) {
            return res.status(400).json({ message: 'Skills must be an array' });
        }
        
        const result = await Skill.insertMany(skills, { ordered: false });
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: 'Error creating skills', error: error.message });
    }
};

// Get a single skill by ID
exports.getSkillById = async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }
        res.status(200).json(skill);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching skill', error: error.message });
    }
};

// Update a skill
exports.updateSkill = async (req, res) => {
    try {
        const skill = await Skill.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }
        
        res.status(200).json(skill);
    } catch (error) {
        res.status(400).json({ message: 'Error updating skill', error: error.message });
    }
};

// Delete a skill
exports.deleteSkill = async (req, res) => {
    try {
        const skill = await Skill.findByIdAndDelete(req.params.id);
        
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }
        
        res.status(200).json({ message: 'Skill deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting skill', error: error.message });
    }
};