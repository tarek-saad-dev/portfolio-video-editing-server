const Certificate = require('../models/certificateModel');

// Get all certificates
exports.getCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find({}).sort({ order: 1 });
        res.status(200).json(certificates);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching certificates', error: error.message });
    }
};

// Create a new certificate
exports.createCertificate = async (req, res) => {
    try {
        const certificate = new Certificate(req.body);
        await certificate.save();
        res.status(201).json(certificate);
    } catch (error) {
        res.status(400).json({ message: 'Error creating certificate', error: error.message });
    }
};

// Create multiple certificates at once
exports.createManyCertificates = async (req, res) => {
    try {
        const { certificates } = req.body;
        
        if (!Array.isArray(certificates)) {
            return res.status(400).json({ message: 'Certificates must be an array' });
        }
        
        const result = await Certificate.insertMany(certificates, { ordered: false });
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: 'Error creating certificates', error: error.message });
    }
};

// Get a single certificate by ID
exports.getCertificateById = async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id);
        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        res.status(200).json(certificate);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching certificate', error: error.message });
    }
};

// Update a certificate
exports.updateCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        
        res.status(200).json(certificate);
    } catch (error) {
        res.status(400).json({ message: 'Error updating certificate', error: error.message });
    }
};

// Delete a certificate
exports.deleteCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findByIdAndDelete(req.params.id);
        
        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        
        res.status(200).json({ message: 'Certificate deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting certificate', error: error.message });
    }
};