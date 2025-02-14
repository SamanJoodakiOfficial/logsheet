const mongoose = require('mongoose');

const Unit = require('../models/unit.model');
const Role = require('../models/role.model.js');
const User = require('../models/user.model.js');

const logger = require('./log.controller');
const flashAndRedirect = require('../utils/flashAndRedirect');
const handleError = require('../utils/handleError');

const renderUnitsByOrgId = async (req, res) => {
    try {
        const { orgId } = req.params;
        const units = await Unit.find({ organization: orgId })
            .populate('roles.role roles.users')
            .sort({ createdAt: -1 });

        res.render('units/index', { title: 'چارت سازمانی', orgId, units });

    } catch (error) {
        handleError(error, req, res, `/orgs/${req.params.orgId}/units`);
    }
}

const renderNewUnit = async (req, res) => {
    try {
        const { orgId } = req.params;
        const roles = await Role.find();
        const units = await Unit.find({ organization: orgId })
            .populate('roles.role roles.users');
        res.render('units/new', { title: 'ایجاد واحد جدید برای چارت سازمانی', orgId, roles, units });

    } catch (error) {
        handleError(error, req, res, `/orgs/${req.params.orgId}/units`);
    }
}

const newUnit = async (req, res) => {
    try {
        const { name, description, parentUnit, roles } = req.body;

        const rolesArray = Array.isArray(roles) ? roles : [roles];

        const rolesWithUsers = rolesArray.map(roleId => ({
            role: roleId,
            users: []
        }));

        const newUnit = new Unit({
            name,
            description,
            organization: req.params.orgId,
            parentUnit: parentUnit || null,
            roles: rolesWithUsers
        });

        await newUnit.save();

        logger('CREATE', 'Unit', req.session.userId, req.ip);
        flashAndRedirect(req, res, 'success', req.__('unit_created'), `/orgs/${req.params.orgId}/units`);

    } catch (error) {
        handleError(error, req, res, `/orgs/${req.params.orgId}/units`);
    }
}

const renderEditUnit = async (req, res) => {
    try {
        const { orgId, unitId } = req.params;
        const unit = await Unit.findById(unitId).populate('roles.role roles.users');
        const roles = await Role.find();
        const units = await Unit.find({ organization: orgId });

        res.render('units/edit', { title: 'ویرایش واحد', unit, roles, units, orgId });
    } catch (error) {
        handleError(error, req, res, `/orgs/${req.params.orgId}/units`);
    }
}


const editUnit = async (req, res) => {
    try {
        const { name, description, parentUnit, roles } = req.body;

        const updatedParentUnit = parentUnit === "" ? null : parentUnit;

        const rolesArray = Array.isArray(roles) ? roles : roles ? [roles] : [];

        const unit = await Unit.findById(req.params.unitId);

        if (!unit) {
            flashAndRedirect(req, res, 'error', req.__('unit_not_found'), `/orgs/${req.params.orgId}/units`);
            return;
        }

        const rolesWithUsers = rolesArray.map(roleId => {
            const existingRole = unit.roles.find(r => r.role.toString() === roleId);
            return {
                role: roleId,
                users: existingRole ? existingRole.users : [] 
            };
        });

        await Unit.findByIdAndUpdate(
            req.params.unitId,
            { name, description, parentUnit: updatedParentUnit, roles: rolesWithUsers }
        );

        logger('UPDATE', 'Unit', req.session.userId, req.ip);

        flashAndRedirect(req, res, 'success', req.__('unit_updated'), `/orgs/${req.params.orgId}/units`);

    } catch (error) {
        handleError(error, req, res, `/orgs/${req.params.orgId}/units`);
    }
};


const deleteUnit = async (req, res) => {
    try {
        await Unit.findByIdAndDelete(req.params.unitId);

        logger('DELETE', 'Unit', req.session.userId, req.ip);

        flashAndRedirect(req, res, 'success', req.__('unit_deleted'), `/orgs/${req.params.orgId}/units`);
    } catch (error) {
        handleError(error, req, res, `/orgs/${req.params.orgId}/units`);
    }
}

const renderAddUsersToRole = async (req, res) => {
    try {
        const { orgId, unitId, roleId } = req.params;

        const unit = await Unit.findById(unitId).populate('roles.role roles.users');
        const role = unit.roles.find(r => r.role._id.toString() === roleId.toString());

        const users = await User.find();

        res.render('roles/addUsers', { title: 'افزودن کاربران به نقش خاص', unit, role, users, orgId, unitId });

    } catch (error) {
        handleError(error, req, res, `/orgs/${req.params.orgId}/units`);
    }
}

const addUsersToRole = async (req, res) => {
    try {
        const { unitId, roleId } = req.params;
        let { userIds } = req.body;

        if (!userIds) {
            userIds = [];
        } else if (typeof userIds === 'string') {
            userIds = [userIds];
        }

        const userObjectIds = userIds.map(id => new mongoose.Types.ObjectId(id));

        const unit = await Unit.findById(unitId);
        const roleIndex = unit.roles.findIndex(r => r.role.toString() === roleId);

        if (roleIndex === -1) {
            throw new Error('Role not found in unit');
        }

        unit.roles[roleIndex].users = userObjectIds;

        await unit.save();

        logger('UPDATE', 'Unit', req.session.userId, req.ip);

        flashAndRedirect(req, res, 'success', req.__('unit_add_users_to_role'), `/orgs/${req.params.orgId}/units`);
    } catch (error) {
        handleError(error, req, res, `/orgs/${req.params.orgId}/units`);
    }
};


module.exports = {
    renderUnitsByOrgId,
    renderNewUnit,
    renderEditUnit,
    renderAddUsersToRole,
    newUnit,
    editUnit,
    deleteUnit,
    addUsersToRole
}
