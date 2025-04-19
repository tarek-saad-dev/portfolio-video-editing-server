const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');

// GET all skills
router.get('/', skillController.getSkills);

// POST create a new skill
router.post('/', skillController.createSkill);

// POST create multiple skills
router.post('/batch', skillController.createManySkills);

// GET a single skill by ID
router.get('/:id', skillController.getSkillById);

// PUT update a skill
router.put('/:id', skillController.updateSkill);

// DELETE a skill
router.delete('/:id', skillController.deleteSkill);

module.exports = router;