const Project = require('../models/projectModel');

// Get all projects
const getProjects = async(req, res) => {
    try {
        const projects = await Project.find({}).sort({ sortOrder: 1, year: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get featured projects
const getFeaturedProjects = async(req, res) => {
    try {
        const projects = await Project.getFeatured();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get projects by category
const getProjectsByCategory = async(req, res) => {
    try {
        const { category } = req.params;
        const projects = await Project.getByCategory(category);
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get projects by tool
const getProjectsByTool = async(req, res) => {
    try {
        const { tool } = req.params;
        const projects = await Project.getByTool(tool);
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Search projects
const searchProjects = async(req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ message: 'Search query is required' });
        }
        const projects = await Project.search(q);
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single project by ID
const getProjectById = async(req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (project) {
            res.json(project);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid project ID' });
        }
        res.status(500).json({ message: error.message });
    }
};

// Create a new project
const createProject = async(req, res) => {
    try {
        const project = new Project(req.body);
        const createdProject = await project.save();
        res.status(201).json(createdProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a project
const updateProject = async(req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (project) {
            Object.keys(req.body).forEach(key => {
                if (req.body[key] !== undefined) {
                    project[key] = req.body[key];
                }
            });
            const updatedProject = await project.save();
            res.json(updatedProject);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid project ID' });
        }
        res.status(400).json({ message: error.message });
    }
};

// Delete a project
const deleteProject = async(req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (project) {
            await Project.findByIdAndDelete(req.params.id);
            res.json({ message: 'Project removed' });
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid project ID' });
        }
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProjects,
    getFeaturedProjects,
    getProjectsByCategory,
    getProjectsByTool,
    searchProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
};
