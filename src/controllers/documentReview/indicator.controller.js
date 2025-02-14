const Category = require('../../models/documentReview/category.model');
const Indicator = require('../../models/documentReview/indicator.model');

const logger = require('../../controllers/log.controller');
const flashAndRedirect = require('../../utils/flashAndRedirect');
const handleError = require('../../utils/handleError');

const getAddIndicators = async (req, res) => {
    try {
        const { id } = req.params;

        const selectedCategory = await Category.findById(id).populate('indicators');

        res.render('./documentReview/categories/addIndicators', {
            title: 'اضافه کردن شاخص به دسته‌بندی',
            selectedCategory,
            selectedIndicators: selectedCategory.indicators
        });
    } catch (error) {
        handleError(error, req, res, '/document-reviews/categories');
    }
};

const postAddIndicators = async (req, res) => {
    try {
        const { id } = req.params;
        const { indicators } = req.body;

        const selectedCategory = await Category.findById(id);

        let newIndicatorIds = [];

        for (let indicator of indicators) {
            if (!indicator.name || indicator.name.trim() === "") continue;

            const existingIndicator = await Indicator.create({
                name: indicator.name,
                description: indicator.description || '',
                value: indicator.value || 0,
                type: indicator.type
            });

            if (!selectedCategory.indicators.includes(existingIndicator._id)) {
                newIndicatorIds.push(existingIndicator._id);
            }
        }

        selectedCategory.indicators.push(...newIndicatorIds);
        await selectedCategory.save();

        logger('CREATE', 'Indicator', req.session.userId, req.ip);

        flashAndRedirect(req, res, 'success', req.__('indicator_created'), `/document-reviews/categories`)
    } catch (error) {
        handleError(error, req, res, '/document-reviews/categories');
    }
};

const deleteIndicator = async (req, res) => {
    try {
        const { id, indicatorId } = req.params;

        const selectedCategory = await Category.findById(id);
        const indicator = await Indicator.findById(indicatorId);

        selectedCategory.indicators = selectedCategory.indicators.filter(ind => ind.toString() !== indicatorId);
        await selectedCategory.save();

        await Indicator.findByIdAndDelete(indicatorId);

        logger('DELETE', 'Indicator', req.session.userId, req.ip);

        flashAndRedirect(req, res, 'success', req.__('indicator_deleted'), `/document-reviews/categories/${id}/indicators`)

    } catch (error) {
        handleError(error, req, res, '/document-reviews/categories');
    }
};

module.exports = {
    getAddIndicators,
    postAddIndicators,
    deleteIndicator
}