const Category = require('../../models/documentReview/category.model');
const Indicator = require('../../models/documentReview/indicator.model');

const logger = require('../../controllers/log.controller');
const flashAndRedirect = require('../../utils/flashAndRedirect');
const handleError = require('../../utils/handleError');

const renderCategories = async (req, res) => {
    try {
        const categories = await Category.find()
            .populate('indicators')
            .sort({ createdAt: -1 });
        res.render('./documentReview/categories/index', { title: 'دسته‌بندی‌ها', categories });

    } catch (error) {
        handleError(req, res, error, '/document-reviews/categories');
    }
}

const renderNewCategory = async (req, res) => {
    res.render('./documentReview/categories/new', { title: 'ایجاد دسته‌بندی جدید' });
}

const newCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return flashAndRedirect(req, res, 'error', req.__('category_exists'), '/document-reviews/categories/new');
        }

        const newCategory = new Category(req.body);

        await newCategory.save();
        logger('CREATE', 'Category', req.session.userId, req.ip);

        flashAndRedirect(req, res, 'success', req.__('category_created'), '/document-reviews/categories');
    } catch (error) {
        handleError(req, res, error, '/document-reviews/categories');
    }
}

const renderEditCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        res.render('./documentReview/categories/edit', { title: 'ویرایش دسته‌بندی', category });

    } catch (error) {
        handleError(req, res, error, '/document-reviews/categories');
    }
}

const editCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const existingCategory = await Category.findOne({ _id: { $ne: req.params.id }, name });
        if (existingCategory) {
            return flashAndRedirect(req, res, 'error', req.__('category_exists'), `/document-reviews/categories/${req.params.id}/edit`);
        }

        await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });

        logger('UPDATE', 'Category', req.session.userId, req.ip);

        flashAndRedirect(req, res, 'success', req.__('category_updated'), '/document-reviews/categories');

    } catch (error) {
        handleError(req, res, error, '/document-reviews/categories');
    }
}

const deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);

        logger('DELETE', 'Category', req.session.userId, req.ip);

        flashAndRedirect(req, res, 'success', req.__('category_deleted'), '/document-reviews/categories');

    } catch (error) {
        handleError(req, res, error, '/document-reviews/categories');
    }
}

module.exports = {
    renderCategories,
    renderNewCategory,
    renderEditCategory,
    newCategory,
    editCategory,
    deleteCategory
}