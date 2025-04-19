const express = require('express');
const router = express.Router();
const experienceController = require('../controllers/experienceController');

// GET all experiences
router.get('/', experienceController.getExperiences);

// POST create a new experience
router.post('/', experienceController.createExperience);

// POST create multiple experiences
router.post('/batch', experienceController.createManyExperiences);

// GET a single experience by ID
router.get('/:id', experienceController.getExperienceById);

// PUT update an experience
router.put('/:id', experienceController.updateExperience);

// DELETE an experience
router.delete('/:id', experienceController.deleteExperience);

module.exports = router;