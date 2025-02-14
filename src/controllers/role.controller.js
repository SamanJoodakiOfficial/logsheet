const Role = require('../models/role.model');
const Module = require('../models/module.model');
const logger = require('./log.controller');
const flashAndRedirect = require('../utils/flashAndRedirect');
const handleError = require('../utils/handleError');

const renderRoles = async (req, res) => {
    try {
        const roles = await Role.find()
            .populate('permissions.module')
            .sort({ createdAt: -1 });

        res.render('roles/index', { title: 'نقش‌ها', roles });
    } catch (error) {
        handleError(error, req, res, '/roles');
    }
}

const renderNewRole = async (req, res) => {
    try {
        const modules = await Module.find();

        res.render('roles/new', { title: 'ایجاد نقش جدید', modules });
    } catch (error) {
        handleError(error, req, res, '/roles');
    }
}

const newRole = async (req, res) => {
    try {
        const { name, description, permissions } = req.body;

        const existingRole = await Role.findOne({ name });
        if (existingRole) {
            return flashAndRedirect(req, res, 'error', req.__('role_exists'), '/roles/new');
        }

        const parsedPermissions = Array.isArray(permissions)
            ? permissions.map(permission => ({
                module: permission.module,
                access: permission.access,
            }))
            : [];

        const newRole = new Role({
            name,
            description,
            permissions: parsedPermissions
        });

        await newRole.save();
        logger('CREATE', 'Role', req.session.userId, req.ip);

        return flashAndRedirect(req, res, 'success', req.__('role_created'), '/roles');

    } catch (error) {
        handleError(error, req, res, '/roles');
    }
}

const renderEditRole = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id)
            .populate('permissions.module');

        const modules = await Module.find();
        res.render('roles/edit', { title: 'ویرایش نقش', role, modules })
    } catch (error) {
        handleError(error, req, res, '/roles');
    }
}

const editRole = async (req, res) => {
    try {
        const { name, description, permissions } = req.body;

        const existingRole = await Role.findOne({ name, _id: { $ne: req.params.id } });
        if (existingRole) {
            return flashAndRedirect(req, res, 'error', req.__('role_exists'), `/roles/${req.params.id}/edit`);
        }

        const parsedPermissions = Array.isArray(permissions)
            ? permissions.map(permission => ({
                module: permission.module,
                access: permission.access,
            }))
            : [];

        await Role.findByIdAndUpdate(
            req.params.id,
            { name, description, permissions: parsedPermissions },
            { new: true }
        );

        logger('UPDATE', 'Role', req.session.userId, req.ip);

        flashAndRedirect(req, res, 'success', req.__('role_updated'), '/roles');

    } catch (error) {
        handleError(error, req, res, '/roles');
    }
}

const deleteRole = async (req, res) => {
    try {
        await Role.findByIdAndDelete(req.params.id);

        logger('DELETE', 'Role', req.session.userId, req.ip);

        flashAndRedirect(req, res, 'success', req.__('role_deleted'), '/roles');

    } catch (error) {
        handleError(error, req, res, '/roles');
    }
}

module.exports = {
    renderRoles,
    renderNewRole,
    renderEditRole,
    newRole,
    editRole,
    deleteRole
}