const express = require('express');
const router = express.Router();

const {
    renderModules,
    renderNewModule,
    renderEditModule,
    newModule,
    editModule,
    deleteModule
} = require('../controllers/module.controller');

router.get('/', renderModules);

router.get('/new', renderNewModule);
router.post('/new', newModule);

router.get('/:id/edit', renderEditModule);
router.post('/:id/edit', editModule);

router.get('/:id/delete', deleteModule);

module.exports = router;