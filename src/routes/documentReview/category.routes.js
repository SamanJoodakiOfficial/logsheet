const express = require('express');
const router = express.Router();

const {
    renderCategories,
    renderNewCategory,
    renderEditCategory,
    newCategory,
    editCategory,
    deleteCategory,
} = require('../../controllers/documentReview/category.controller');

const {
    getAddIndicators,
    postAddIndicators,
    deleteIndicator
} = require('../../controllers/documentReview/indicator.controller');

router.get('/', renderCategories);

router.get('/new', renderNewCategory);
router.post('/new', newCategory);

router.get('/:id/edit', renderEditCategory);
router.post('/:id/edit', editCategory);

router.get('/:id/delete', deleteCategory);

router.get('/:id/indicators', getAddIndicators);
router.post('/:id/indicators', postAddIndicators);

router.get('/:id/indicators/:indicatorId/delete', deleteIndicator);

module.exports = router;