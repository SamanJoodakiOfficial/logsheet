const express = require('express');
const router = express.Router();

const {
    renderAuditCourses,
    renderNewAuditCourse,
    renderEditAuditCourse,
    newAuditCourse,
    editAuditCourse,
    deleteAuditCourse
} = require('../../controllers/audit/auditCourse.controller');

const {
    renderChecklistsForUser,
} = require('../../controllers/audit/checklist.controller');

const {
    renderNewResponse,
    newResponse
} = require('../../controllers/audit/response.controller');

router.get('/', renderAuditCourses);

router.get('/new', renderNewAuditCourse);
router.post('/new', newAuditCourse);

router.get('/:id/edit', renderEditAuditCourse);
router.post('/:id/edit', editAuditCourse);

router.get('/:id/delete', deleteAuditCourse);

router.get('/:id/checklists', renderChecklistsForUser);

router.get('/:courseId/checklists/:checklistId/questions/:questionId/answer', renderNewResponse);

router.post('/:courseId/checklists/:checklistId/questions/:questionId/answer', newResponse);

module.exports = router;
