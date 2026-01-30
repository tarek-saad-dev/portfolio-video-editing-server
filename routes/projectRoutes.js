const express = require('express');
const router = express.Router();
const {
    getProjects,
    getFeaturedProjects,
    getProjectsByCategory,
    getProjectsByTool,
    searchProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
} = require('../controllers/projectController');

// Search route (must be before /:id to avoid conflicts)
router.get('/search', searchProjects);

// Featured projects
router.get('/featured', getFeaturedProjects);

// Projects by category
router.get('/category/:category', getProjectsByCategory);

// Projects by tool
router.get('/tool/:tool', getProjectsByTool);

// Standard CRUD routes
router.route('/').get(getProjects).post(createProject);
router.route('/:id').get(getProjectById).put(updateProject).delete(deleteProject);

module.exports = router;
