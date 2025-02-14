const express = require('express');
const router = express.Router();

const {
    renderRoles,
    renderNewRole,
    renderEditRole,
    newRole,
    editRole,
    deleteRole
} = require('../controllers/role.controller');

router.get('/', renderRoles);

router.get('/new', renderNewRole);
router.post('/new', newRole);

router.get('/:id/edit', renderEditRole);
router.post('/:id/edit', editRole);

router.get('/:id/delete', deleteRole);

module.exports = router;