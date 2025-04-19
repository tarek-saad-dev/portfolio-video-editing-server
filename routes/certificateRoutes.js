const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');

// GET all certificates
router.get('/', certificateController.getCertificates);

// POST create a new certificate
router.post('/', certificateController.createCertificate);

// POST create multiple certificates
router.post('/batch', certificateController.createManyCertificates);

// GET a single certificate by ID
router.get('/:id', certificateController.getCertificateById);

// PUT update a certificate
router.put('/:id', certificateController.updateCertificate);

// DELETE a certificate
router.delete('/:id', certificateController.deleteCertificate);

module.exports = router;