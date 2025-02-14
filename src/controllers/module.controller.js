const Module = require('../models/module.model');
const logger = require('../controllers/log.controller');
const flashAndRedirect = require('../utils/flashAndRedirect');
const handleError = require('../utils/handleError');

const renderModules = async (req, res) => {
    try {
        const modules = await Module.find()
            .sort({ createdAt: -1 });

        res.render('modules/index', { title: 'پودمان‌ها', modules });
    } catch (error) {
        handleError(error, req, res, '/modules');
    }
}

const renderNewModule = async (req, res) => {
    res.render('modules/new', { title: 'ایجاد پودمان جدید' });
}

const newModule = async (req, res) => {
    try {
        const { name, description } = req.body;

        const existingModule = await Module.findOne({ name });
        if (existingModule) {
            return flashAndRedirect(req, res, 'error', req.__('module_exists'), '/modules/new');
        }

        const newModule = new Module(req.body);
        await newModule.save();

        logger('CREATE', 'Module', req.session.userId, req.ip);
        flashAndRedirect(req, res, 'success', req.__('module_created'), '/modules');

    } catch (error) {
        handleError(error, req, res, '/modules');
    }
}

const renderEditModule = async (req, res) => {
    try {
        const module = await Module.findById(req.params.id);

        res.render('modules/edit', { title: 'ویرایش پودمان', module });

    } catch (error) {
        handleError(error, req, res, '/modules');
    }
}

const editModule = async (req, res) => {
    try {
        const { name, description } = req.body;

        const existingModule = await Module.findOne({ name, _id: { $ne: req.params.id } });
        if (existingModule) {
            return flashAndRedirect(req, res, 'error', req.__('module_exists'), `/modules/${req.params.id}/edit`);
        }

        await Module.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        logger('UPDATE', 'Module', req.session.userId, req.ip);

        flashAndRedirect(req, res, 'success', req.__('module_updated'), '/modules');

    } catch (error) {
        handleError(error, req, res, '/modules');
    }
}

const deleteModule = async (req, res) => {
    try {
        await Module.findByIdAndDelete(req.params.id);

        logger('DELETE', 'Module', req.session.userId, req.ip);

        flashAndRedirect(req, res, 'success', req.__('module_deleted'), '/modules');

    } catch (error) {
        handleError(error, req, res, '/modules');
    }
}

module.exports = {
    renderModules,
    renderNewModule,
    renderEditModule,
    newModule,
    editModule,
    deleteModule
}