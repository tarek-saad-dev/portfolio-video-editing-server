const express = require('express');
const router = express.Router();
const toolController = require('../controllers/toolController');

// GET all tools
router.get('/', toolController.getTools);

// POST create a new tool
router.post('/', toolController.createTool);

// POST create multiple tools
router.post('/batch', toolController.createManyTools);

// GET a single tool by ID
router.get('/:id', toolController.getToolById);

// PUT update a tool
router.put('/:id', toolController.updateTool);

// DELETE a tool
router.delete('/:id', toolController.deleteTool);

module.exports = router;