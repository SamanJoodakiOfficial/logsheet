const express = require('express');
const router = express.Router({ mergeParams: true });

const {
    renderGroupsByOrgId,
    renderNewGroup,
    renderEditGroup,
    newGroup,
    editGroup,
    deleteGroup,
} = require('../controllers/group.controller');

router.get('/', renderGroupsByOrgId);

router.get('/new', renderNewGroup);
router.post('/new', newGroup);

router.get('/:groupId/edit', renderEditGroup); 
router.post('/:groupId/edit', editGroup);

router.get('/:groupId/delete', deleteGroup);

module.exports = router;
