const Project = require('../models/projectModel');

// Get all projects
const getProjects = async(req, res) => {
    try {
        const projects = await Project.find({});
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single project by ID
const getProjectById = async(req, res) => {
    try {
        const project = await Project.findOne({ id: req.params.id });
        if (project) {
            res.json(project);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
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
        const project = await Project.findOne({ id: req.params.id });
        if (project) {
            Object.keys(req.body).forEach(key => {
                project[key] = req.body[key];
            });
            const updatedProject = await project.save();
            res.json(updatedProject);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a project
const deleteProject = async(req, res) => {
    try {
        const project = await Project.findOne({ id: req.params.id });
        if (project) {
            await project.remove();
            res.json({ message: 'Project removed' });
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
};