const express = require('express');
const router = express.Router();
const flashAndRedirect = require('../../utils/flashAndRedirect');
const Document = require('../../models/documentReview/document.model');

const {
    renderDocuments,
    renderNewDocument,
    renderEditDocument,
    newDocument,
    editDocument,
    deleteDocument,
    renderDocumentAnalyze1,
    renderDocumentAnalyze2,
    renderDocumentAnalyze3,
} = require('../../controllers/documentReview/document.controller');

router.get('/', renderDocuments);
router.get('/new', renderNewDocument);
router.post('/new', newDocument);
router.get('/:id/edit', renderEditDocument);
router.post('/:id/edit', editDocument);
router.get('/:id/delete', deleteDocument);
router.get('/:id/analyze1', renderDocumentAnalyze1);
router.get('/:id/analyze2', renderDocumentAnalyze2);
router.get('/:id/analyze3', renderDocumentAnalyze3);

router.post('/upload', async (req, res) => {
    try {
        const { name, category } = req.body; // دریافت نام مستند و دسته‌بندی
        const file = req.file;

        if (file) {
            const newDocument = new Document({
                name: name,
                category: category,
            });

            await newDocument.save(); // ذخیره داکیومنت جدید در دیتابیس
            flashAndRedirect(req, res, 'success', req.__('file_upload_success'), '/document-reviews/documents');
        } else {
            flashAndRedirect(req, res, 'error', req.__('file_upload_error'), '/document-reviews/documents');
        }
    } catch (error) {
        handleError(req, res, error, '/document-reviews/documents');
    }
});

module.exports = router;