const express = require('express');
const router = express.Router({ mergeParams: true });

const {
    renderUnitsByOrgId,
    renderNewUnit,
    renderEditUnit,
    renderAddUsersToRole,
    newUnit,
    editUnit,
    deleteUnit,
    addUsersToRole
} = require('../controllers/unit.controller');

router.get('/', renderUnitsByOrgId);

router.get('/new', renderNewUnit);
router.post('/new', newUnit);

router.get('/:unitId/edit', renderEditUnit); 
router.post('/:unitId/edit', editUnit);

router.get('/:unitId/roles/:roleId/add-users', renderAddUsersToRole);
router.post('/:unitId/roles/:roleId/add-users', addUsersToRole);

router.get('/:unitId/delete', deleteUnit);

module.exports = router;
