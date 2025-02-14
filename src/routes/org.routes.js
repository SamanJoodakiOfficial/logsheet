const express = require('express');
const router = express.Router();

const {
    renderOrgs,
    renderNewOrg,
    renderEditOrg,
    newOrg,
    editOrg,
    deleteOrg
} = require('../controllers/org.controller');

router.get('/', renderOrgs);

router.get('/new', renderNewOrg);
router.post('/new', newOrg);

router.get('/:id/edit', renderEditOrg);
router.post('/:id/edit', editOrg);

router.get('/:id/delete', deleteOrg);

// Organizations chart - Units
router.use('/:orgId/units', require('./unit.routes'));

// Group & SubGroup
router.use('/:orgId/groups', require('./group.routes'));

module.exports = router;