const Checklist = require('../../models/audit/checklist.model');
const Question = require('../../models/audit/question.model');
const AuditCourse = require('../../models/audit/auditCourse.model');

const logger = require('../../controllers/log.controller');
const flashAndRedirect = require('../../utils/flashAndRedirect');
const handleError = require('../../utils/handleError');

const renderChecklists = async (req, res) => {
    try {
        const checklists = await Checklist.find()
            .sort({ createdAt: -1 });

        res.render('audit/checklists/index', { title: 'چک لیست‌ها', checklists });
    } catch (error) {
        handleError(error, req, res, '/checklists');
    }
}

const renderNewChecklist = async (req, res) => {
    try {
        res.render('audit/checklists/new', { title: 'ایجاد چک لیست جدید' });

    } catch (error) {
        handleError(error, req, res, '/checklists');
    }
}

const newChecklist = async (req, res) => {
    try {
        const { name, description } = req.body;

        const existingChecklist = await Checklist.findOne({ name });
        if (existingChecklist) {
            return flashAndRedirect(req, res, 'error', req.__('checklist_exists'), '/checklists/new');
        }

        const newChecklist = new Checklist({
            name,
            description
        });

        await newChecklist.save();

        logger("CREATE", "Checklist", req.session.userId, req.ip);

        flashAndRedirect(req, res, 'success', req.__('checklist_created'), '/checklists');

    } catch (error) {
        handleError(error, req, res, '/checklists');
    }
}

const renderEditChecklist = async (req, res) => {
    try {
        const checklist = await Checklist.findById(req.params.id);

        res.render('audit/checklists/edit', { title: 'ویرایش چک لیست', checklist });

    } catch (error) {
        handleError(error, req, res, '/checklists');
    }
}

const editChecklist = async (req, res) => {
    try {
        const { name, description } = req.body;

        const existingChecklist = await Checklist.findOne({ name, _id: { $ne: req.params.id } });
        if (existingChecklist) {
            return flashAndRedirect(req, res, 'error', req.__('checklist_exists'), `/checklists/${req.params.id}/edit`);
        }

        await Checklist.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true }
        );

        logger("UPDATE", "Checklist", req.session.userId, req.ip);

        flashAndRedirect(req, res, 'success', req.__('checklist_updated'), '/checklists');

    } catch (error) {
        handleError(error, req, res, '/checklists');
    }
}

const deleteChecklist = async (req, res) => {
    try {

        await Checklist.findByIdAndDelete(req.params.id);

        logger("DELETE", "Checklist", req.session.userId, req.ip);

        flashAndRedirect(req, res, 'success', req.__('checklist_deleted'), '/checklists');

    } catch (error) {
        handleError(error, req, res, '/checklists');
    }
}

const renderChecklistsForUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.session.userId;

        const course = await AuditCourse.findById(id).populate({
            path: 'access',
            match: { user: userId },
            populate: {
                path: 'checklists',
                model: 'Checklist',
                populate: {
                    path: 'questions',
                    model: 'Question'
                }
            }
        });

        if (!course) {
            return flashAndRedirect(req, res, 'error', req.__('audit_course_not_found'), '/audit-courses');
        }

        const userAccess = course.access.find(access => access.user.toString() === userId);
        if (!userAccess) {
            return flashAndRedirect(req, res, 'error', req.__('audit_course_limit'), '/audit-courses');
        }

        const accessibleChecklists = [];
        for (const access of course.access) {
            if (access.user.toString() === userId) {
                for (const checklist of access.checklists) {
                    if (checklist) {
                        checklist.questions = await Question.find({ checklist: checklist._id });
                        accessibleChecklists.push(checklist);
                    }
                }
            }
        }

        res.render('audit/auditCourses/checklists', { title: 'پرسشنامه‌ها', course, accessibleChecklists });
    } catch (error) {
        handleError(error, req, res, '/audit-courses');
    }
};


module.exports = {
    renderChecklists,
    renderNewChecklist,
    renderEditChecklist,
    renderChecklistsForUser,
    newChecklist,
    editChecklist,
    deleteChecklist
}