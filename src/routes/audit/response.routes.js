const express = require('express');
const router = express.Router();

const {
    renderResponses,
    deleteResponse,
    renderReport
} = require('../../controllers/audit/response.controller');

router.get('/', renderResponses);

router.get('/report', renderReport);

router.get('/:id/delete', deleteResponse);

module.exports = router;