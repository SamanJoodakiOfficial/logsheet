const Group = require('../models/group.model');
const Org = require('../models/org.model');
const Module = require('../models/module.model');

const logger = require('../controllers/log.controller');
const flashAndRedirect = require('../utils/flashAndRedirect');
const handleError = require('../utils/handleError');

const renderGroupsByOrgId = async (req, res) => {
    try {
        const { orgId } = req.params;
        const groups = await Group.find({ organization: orgId })
            .populate('organization')
            .populate('modules')
            .populate('childrenNodes')
            .populate('parentNode');

        res.render('groups/index', { title: 'گروه‌ها و زیرگروه‌ها', groups, orgId });
    } catch (error) {
        handleError(error, req, res, `/orgs/${req.params.orgId}/groups`);
    }
};


const renderNewGroup = async (req, res) => {
    try {
        const orgId = req.params.orgId;
        const groups = await Group.find({ organization: orgId });
        const modules = await Module.find();

        res.render('groups/new', {
            title: 'ایجاد گروه جدید',
            orgId,
            groups,
            modules,
            isSubgroup: false
        });
    } catch (error) {
        handleError(error, req, res, `/orgs/${req.params.orgId}/groups`);
    }
};


const newGroup = async (req, res) => {
    try {
        const { name, description, parentNode, modules } = req.body;

        const group = new Group({
            name,
            description,
            organization: req.params.orgId,
            modules,
        });

        if (parentNode && parentNode.trim() !== "") {
            const parentGroup = await Group.findById(parentNode);
            if (parentGroup) {
                group.parentNode = parentNode;
                group.hierarchyPath = [...parentGroup.hierarchyPath, parentGroup._id];
                parentGroup.childrenNodes.push(group._id);
                await parentGroup.save();
            }
        }

        await group.save();
        logger("CREATE", "Group", req.session.userId, req.ip);

        flashAndRedirect(req, res, 'success', req.__('group_created'), `/orgs/${req.params.orgId}/groups`);

    } catch (error) {
        handleError(error, req, res, `/orgs/${req.params.orgId}/groups`);
    }
}

const renderEditGroup = async (req, res) => {
    try {
        const { orgId, groupId } = req.params;
        const group = await Group.findById(groupId).populate('modules');
        const groups = await Group.find({ organization: group.organization, _id: { $ne: groupId } });
        const modules = await Module.find();

        res.render('groups/edit', {
            title: 'ویرایش گروه',
            orgId,
            group,
            groups,
            modules,
            isSubgroup: group.parentNode ? true : false
        });
    } catch (error) {
        handleError(error, req, res, `/orgs/${req.params.orgId}/groups`);
    }
};

const editGroup = async (req, res) => {
    try {
        const { orgId } = req.params;
        const { name, description, parentNode, modules } = req.body;
        const group = await Group.findById(req.params.groupId);

        group.name = name;
        group.description = description;
        group.organization = orgId;
        group.modules = modules;

        if (parentNode && parentNode.trim() !== "" && String(parentNode) !== String(group.parentNode)) {
            if (group.parentNode) {
                const oldParent = await Group.findById(group.parentNode);
                if (oldParent) {
                    oldParent.childrenNodes = oldParent.childrenNodes.filter(id => String(id) !== String(group._id));
                    await oldParent.save();
                }
            }

            const newParent = await Group.findById(parentNode);
            if (newParent) {
                group.parentNode = parentNode;
                group.hierarchyPath = [...newParent.hierarchyPath, newParent._id];
                newParent.childrenNodes.push(group._id);
                await newParent.save();
            }
        } else if (!parentNode || parentNode.trim() === "") {
            group.parentNode = null;
            group.hierarchyPath = [];
        }

        await group.save();
        logger('UPDATE', 'Group', req.session.userId, req.ip);

        flashAndRedirect(req, res, 'success', req.__('group_updated'), `/orgs/${req.params.orgId}/groups`);

    } catch (error) {
        handleError(error, req, res, `/orgs/${req.params.orgId}/groups`);
    }
}

const deleteGroup = async (req, res) => {
    try {
        await Group.findByIdAndDelete(req.params.groupId);

        logger('DELETE', 'Group', req.session.userId, req.ip);

        flashAndRedirect(req, res, 'success', req.__('group_deleted'), `/orgs/${req.params.orgId}/groups`);

    } catch (error) {
        handleError(error, req, res, `/orgs/${req.params.orgId}/groups`);
    }
}

module.exports = {
    renderGroupsByOrgId,
    renderNewGroup,
    renderEditGroup,
    newGroup,
    editGroup,
    deleteGroup
}