const Project = require('../models/projectModel');
const { normalizeProject, normalizeProjects } = require('../utils/responseNormalizer');
const { extractYouTubeId, normalizeYouTubeUrl } = require('../utils/youtubeHelper');

/**
 * Sanitize error messages to prevent exposing sensitive information
 */
function sanitizeError(error) {
  const message = error.message || 'An error occurred';
  // Remove any potential connection strings or sensitive data
  return message.replace(/mongodb[^ ]*/gi, '[REDACTED]');
}

/**
 * Prepare project data for save (handle legacy fields)
 */
function prepareProjectData(body) {
  const data = { ...body };

  // Normalize YouTube URL if provided
  if (data.youtubeUrl) {
    const normalized = normalizeYouTubeUrl(data.youtubeUrl);
    if (normalized) {
      data.youtubeUrl = normalized;
    }
  }

  // Handle legacy fields if present
  // Map old 'duration' (string "mm:ss") to durationSec if needed
  if (data.duration && typeof data.duration === 'string' && !data.durationSec) {
    const parts = data.duration.split(':');
    if (parts.length === 2) {
      const minutes = parseInt(parts[0], 10) || 0;
      const seconds = parseInt(parts[1], 10) || 0;
      data.durationSec = (minutes * 60) + seconds;
    }
  }

  // Map old 'year' string to number if needed
  if (data.year && typeof data.year === 'string') {
    const yearNum = parseInt(data.year, 10);
    if (!isNaN(yearNum) && yearNum >= 1900 && yearNum <= 2100) {
      data.year = yearNum;
    }
  }

  // Remove legacy fields that shouldn't be saved
  delete data.id; // Don't save id, use _id
  delete data.duration; // Use durationSec instead

  return data;
}

// Get all projects
const getProjects = async(req, res) => {
  try {
    const projects = await Project.find({}).sort({ sortOrder: 1, year: -1 });
    const normalized = normalizeProjects(projects);
    res.json(normalized);
  } catch (error) {
    res.status(500).json({ message: sanitizeError(error) });
  }
};

// Get featured projects
const getFeaturedProjects = async(req, res) => {
  try {
    const projects = await Project.getFeatured();
    const normalized = normalizeProjects(projects);
    res.json(normalized);
  } catch (error) {
    res.status(500).json({ message: sanitizeError(error) });
  }
};

// Get projects by category
const getProjectsByCategory = async(req, res) => {
  try {
    const { category } = req.params;
    const projects = await Project.getByCategory(category);
    const normalized = normalizeProjects(projects);
    res.json(normalized);
  } catch (error) {
    res.status(500).json({ message: sanitizeError(error) });
  }
};

// Get projects by tool
const getProjectsByTool = async(req, res) => {
  try {
    const { tool } = req.params;
    const projects = await Project.getByTool(tool);
    const normalized = normalizeProjects(projects);
    res.json(normalized);
  } catch (error) {
    res.status(500).json({ message: sanitizeError(error) });
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
    const normalized = normalizeProjects(projects);
    res.json(normalized);
  } catch (error) {
    res.status(500).json({ message: sanitizeError(error) });
  }
};

// Get a single project by ID
const getProjectById = async(req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project) {
      const normalized = normalizeProject(project);
      res.json(normalized);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid project ID' });
    }
    res.status(500).json({ message: sanitizeError(error) });
  }
};

// Create a new project
const createProject = async(req, res) => {
  try {
    const projectData = prepareProjectData(req.body);
    const project = new Project(projectData);
    const createdProject = await project.save();
    const normalized = normalizeProject(createdProject);
    res.status(201).json(normalized);
  } catch (error) {
    res.status(400).json({ message: sanitizeError(error) });
  }
};

// Update a project
const updateProject = async(req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project) {
      const updateData = prepareProjectData(req.body);
      
      // Update fields
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          project[key] = updateData[key];
        }
      });

      const updatedProject = await project.save();
      const normalized = normalizeProject(updatedProject);
      res.json(normalized);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid project ID' });
    }
    res.status(400).json({ message: sanitizeError(error) });
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
    res.status(500).json({ message: sanitizeError(error) });
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
