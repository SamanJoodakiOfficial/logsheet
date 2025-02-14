const Org = require('../models/org.model');
const Module = require('../models/module.model');
const logger = require('./log.controller');
const flashAndRedirect = require('../utils/flashAndRedirect');
const handleError = require('../utils/handleError');

const renderOrgs = async (req, res) => {
    try {
        const orgs = await Org.find()
            .populate('modules')
            .sort({ createdAt: -1 });

        res.render('orgs/index', { title: 'سازمان‌ها', orgs });

    } catch (error) {
        handleError(error, req, res, '/orgs');
    }
}

const renderNewOrg = async (req, res) => {
    try {
        const modules = await Module.find();

        res.render('orgs/new', { title: 'ایجاد سازمان جدید', modules });
    } catch (error) {
        handleError(error, req, res, '/orgs');
    }
}

const newOrg = async (req, res) => {
    try {
        const {
            name,
            description,
            economicCode,
            address,
            telephone,
            type,
            modules
        } = req.body;

        const existingOrg = await Org.findOne({ name });
        if (existingOrg) {
            return flashAndRedirect(req, res, 'error', req.__('organization_exists'), '/orgs/new');
        }

        const newOrg = new Org(req.body);

        await newOrg.save();
        logger('CREATE', 'Org', req.session.userId, req.ip);
        flashAndRedirect(req, res, 'success', req.__('organization_created'), '/orgs');

    } catch (error) {
        handleError(error, req, res, '/orgs');
    }
}

const renderEditOrg = async (req, res) => {
    try {
        const org = await Org.findById(req.params.id);

        const modules = await Module.find();

        res.render('orgs/edit', { title: 'ویرایش سازمان', org, modules });
    } catch (error) {
        handleError(error, req, res, '/orgs');
    }
}

const editOrg = async (req, res) => {
    try {
        const {
            name, description, economicCode, address, telephone, type, modules
        } = req.body;

        const existingOrg = await Org.findOne({ name, _id: { $ne: req.params.id } });
        if (existingOrg) {
            return flashAndRedirect(req, res, 'error', req.__('organization_exists'), `/orgs/${req.params.id}/edit`);
        }

        await Org.findByIdAndUpdate(
            req.params.id,
            {
                name,
                description,
                economicCode,
                address,
                telephone,
                type,
                modules: modules || []
            },
            { new: true }
        );

        logger('UPDATE', 'Org', req.session.userId, req.ip);
        flashAndRedirect(req, res, 'success', req.__('organization_updated'), '/orgs');

    } catch (error) {
        handleError(error, req, res, '/orgs');
    }
}

const deleteOrg = async (req, res) => {
    try {
        await Org.findByIdAndDelete(req.params.id);

        logger('DELETE', 'Org', req.session.userId, req.ip);
        flashAndRedirect(req, res, 'success', req.__('organization_deleted'), '/orgs');

    } catch (error) {
        handleError(error, req, res, '/orgs');
    }
}

module.exports = {
    renderOrgs,
    renderNewOrg,
    renderEditOrg,
    newOrg,
    editOrg,
    deleteOrg
}