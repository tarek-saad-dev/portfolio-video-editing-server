const Tool = require('../models/toolModel');

// Get all tools
exports.getTools = async (req, res) => {
    try {
        const tools = await Tool.find({});
        res.status(200).json(tools);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tools', error: error.message });
    }
};

// Create a new tool
exports.createTool = async (req, res) => {
    try {
        const tool = new Tool(req.body);
        await tool.save();
        res.status(201).json(tool);
    } catch (error) {
        res.status(400).json({ message: 'Error creating tool', error: error.message });
    }
};

// Create multiple tools at once
exports.createManyTools = async (req, res) => {
    try {
        const { tools } = req.body;
        
        if (!Array.isArray(tools)) {
            return res.status(400).json({ message: 'Tools must be an array' });
        }
        
        const result = await Tool.insertMany(tools, { ordered: false });
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: 'Error creating tools', error: error.message });
    }
};

// Get a single tool by ID
exports.getToolById = async (req, res) => {
    try {
        const tool = await Tool.findById(req.params.id);
        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }
        res.status(200).json(tool);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tool', error: error.message });
    }
};

// Update a tool
exports.updateTool = async (req, res) => {
    try {
        const tool = await Tool.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }
        
        res.status(200).json(tool);
    } catch (error) {
        res.status(400).json({ message: 'Error updating tool', error: error.message });
    }
};

// Delete a tool
exports.deleteTool = async (req, res) => {
    try {
        const tool = await Tool.findByIdAndDelete(req.params.id);
        
        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }
        
        res.status(200).json({ message: 'Tool deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting tool', error: error.message });
    }
};