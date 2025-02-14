const Document = require('../../models/documentReview/document.model');
const Category = require('../../models/documentReview/category.model');

const logger = require('../../controllers/log.controller');
const flashAndRedirect = require('../../utils/flashAndRedirect');
const handleError = require('../../utils/handleError');

const renderDocuments = async (req, res) => {
    try {
        const documents = await Document.find()
            .sort({ createdAt: -1 })
            .populate('category');

        const categories = await Category.find();

        res.render('./documentReview/documents/index', { title: 'مستندات', documents, categories });
    } catch (error) {
        handleError(req, res, error, '/document-reviews/documents');
    }
}

const renderNewDocument = async (req, res) => {
    try {
        const categories = await Category.find();

        res.render('./documentReview/documents/new', { title: 'ایجاد مستند جدید', categories });

    } catch (error) {
        handleError(req, res, error, '/document-reviews/documents');
    }
}


const renderEditDocument = async (req, res) => {
    try {
        const categories = await Category.find();
        const document = await Document.findById(req.params.id);

        res.render('./documentReview/documents/edit', {
            title: 'ویرایش سند',
            categories,
            document,
            analysisResult1: document.analysisResult1,
            analysisResult2: document.analysisResult2,
            analysisResult3: document.analysisResult3
        });

    } catch (error) {
        handleError(req, res, error, '/document-reviews/documents');
    }
}

const newDocument = async (req, res) => {
    try {
        const {
            category,
            name,
            fileId,
            analysisResult1,
            analysisResult2,
            analysisResult3
        } = req.body;

        // تبدیل رشته‌ها به آرایه از اشیاء اگر نیاز است
        const parseResults = (result) => {
            try {
                return JSON.parse(result); // اگر داده‌ها به صورت رشته JSON ارسال شده‌اند
            } catch (error) {
                return []; // در صورت عدم موفقیت، آرایه خالی برمی‌گرداند
            }
        };

        const newDocument = new Document({
            category,
            name,
            fileId,
            analysisResult1: parseResults(analysisResult1), // تبدیل به آرایه از اشیاء
            analysisResult2: parseResults(analysisResult2), // تبدیل به آرایه از اشیاء
            analysisResult3: parseResults(analysisResult3), // تبدیل به آرایه از اشیاء
        });

        await newDocument.save();
        logger('CREATE', 'Document', req.session.userId, req.ip);

        flashAndRedirect(req, res, 'success', req.__('document_created'), '/document-reviews/documents');

    } catch (error) {
        handleError(req, res, error, '/document-reviews/documents');
    }
}

const editDocument = async (req, res) => {
    try {
        const {
            category,
            name,
            fileId,
            analysisResult1,
            analysisResult2,
            analysisResult3
        } = req.body;

        // تبدیل رشته‌ها به آرایه از اشیاء
        const parseResults = (result) => {
            try {
                return JSON.parse(result); // اگر داده‌ها به صورت رشته JSON ارسال شده‌اند
            } catch (error) {
                return []; // در صورت عدم موفقیت، آرایه خالی برمی‌گرداند
            }
        };

        // دریافت سند موجود
        const document = await Document.findById(req.params.id);

        // پاک کردن مقادیر قبلی و استفاده از مقادیر جدید برای هر نتیجه
        const updatedAnalysisResult1 = parseResults(analysisResult1);
        const updatedAnalysisResult2 = parseResults(analysisResult2);
        const updatedAnalysisResult3 = parseResults(analysisResult3);

        // به‌روزرسانی سند با مقادیر جدید
        await Document.findByIdAndUpdate(req.params.id, {
            category,
            name,
            fileId,
            analysisResult1: updatedAnalysisResult1,  // استفاده از مقادیر جدید
            analysisResult2: updatedAnalysisResult2,  // استفاده از مقادیر جدید
            analysisResult3: updatedAnalysisResult3,  // استفاده از مقادیر جدید
        }, { new: true });

        logger('UPDATE', 'Document', req.session.userId, req.ip);

        flashAndRedirect(req, res, 'success', req.__('document_updated'), '/document-reviews/documents');

    } catch (error) {
        handleError(req, res, error, '/document-reviews/documents');
    }
}

const deleteDocument = async (req, res) => {
    try {
        await Document.findByIdAndDelete(req.params.id);
        logger('DELETE', 'Document', req.session.userId, req.ip);

        flashAndRedirect(req, res, 'success', req.__('document_deleted'), '/document-reviews/documents');

    } catch (error) {
        handleError(req, res, error, '/document-reviews/documents');
    }
}

const renderDocumentAnalyze1 = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id)
            .populate('category');

        // بررسی و جداکردن داده‌ها بر اساس "|"
        if (Array.isArray(document.analysisResult1)) {
            document.analysisResult1 = document.analysisResult1.map(item => {
                const key = Object.keys(item)[0];
                const values = item[key].split('|').map(val => val.trim());
                return values;
            });
        }

        res.render('./documentReview/documents/result1', { title: 'تجزیه و تحلیل بررسی ساختاری', document });

    } catch (error) {
        console.log(error.message);
    }
};

const renderDocumentAnalyze2 = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id)
            .populate('category');


        // بررسی و جداکردن داده‌ها بر اساس "|"
        if (Array.isArray(document.analysisResult2)) {
            document.analysisResult2 = document.analysisResult2.map(item => {
                const key = Object.keys(item)[0];
                const values = item[key].split('|').map(val => val.trim());
                return values;
            });
        }

        res.render('./documentReview/documents/result2', { title: 'تجزیه و تحلیل بررسی محتوایی', document });

    } catch (error) {
        console.log(error.message);
    }
}

const renderDocumentAnalyze3 = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id)
            .populate('category');


        // بررسی و جداکردن داده‌ها بر اساس "|"
        if (Array.isArray(document.analysisResult3)) {
            document.analysisResult3 = document.analysisResult3.map(item => {
                const key = Object.keys(item)[0];
                const values = item[key].split('|').map(val => val.trim());
                return values;
            });
        }

        res.render('./documentReview/documents/result3', { title: 'خلاصه', document });

    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    renderDocuments,
    renderNewDocument,
    renderEditDocument,
    newDocument,
    editDocument,
    deleteDocument,
    renderDocumentAnalyze1,
    renderDocumentAnalyze2,
    renderDocumentAnalyze3,
}
