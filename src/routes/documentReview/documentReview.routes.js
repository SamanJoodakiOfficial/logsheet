const express = require('express');
const router = express.Router();

// Category routes
router.use('/categories', require('./category.routes'));

// Category routes
router.use('/documents', require('./document.routes'));

module.exports = router;
