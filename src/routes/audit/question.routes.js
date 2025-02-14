const express = require('express');
const router = express.Router();

const {
    renderQuestions,
    renderNewQuestion,
    renderEditQuestion,
    newQuestion,
    editQuestion,
    deleteQuestion
} = require('../../controllers/audit/question.controller');

router.get('/', renderQuestions);

router.get('/new', renderNewQuestion);
router.post('/new', newQuestion);

router.get('/:id/edit', renderEditQuestion);
router.post('/:id/edit', editQuestion);

router.get('/:id/delete', deleteQuestion);

module.exports = router;