const express = require('express');
const router = express.Router();

const {
    renderChecklists,
    renderNewChecklist,
    renderEditChecklist,
    newChecklist,
    editChecklist,
    deleteChecklist
} = require('../../controllers/audit/checklist.controller');
const {renderResponsesByChecklist} = require("../../controllers/audit/response.controller");

router.get('/', renderChecklists);

router.get('/new', renderNewChecklist);
router.post('/new', newChecklist);

router.get('/:id/edit', renderEditChecklist);
router.post('/:id/edit', editChecklist);

router.get('/:id/delete', deleteChecklist);

router.get('/:id/responses', renderResponsesByChecklist);

module.exports = router;