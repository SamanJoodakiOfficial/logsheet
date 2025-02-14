const AuditCourse = require('../../models/audit/auditCourse.model');
const Checklist = require('../../models/audit/checklist.model');
const User = require('../../models/user.model');

const logger = require('../../controllers/log.controller');
const flashAndRedirect = require('../../utils/flashAndRedirect');
const handleError = require('../../utils/handleError');

const renderAuditCourses = async (req, res) => {
    try {
        const auditCourses = await AuditCourse.find()
            .sort({ createdAt: -1 });

        res.render('audit/auditCourses/index', {
            title: 'دوره‌های حسابرسی',
            auditCourses
        });
    } catch (error) {
        handleError(error, req, res, '/audit-courses');
    }
};

const renderNewAuditCourse = async (req, res) => {
    try {
        const checklists = await Checklist.find();
        const users = await User.find();

        res.render('audit/auditCourses/new', { title: 'ایجاد دوره حسابرسی جدید', checklists, users });

    } catch (error) {
        handleError(error, req, res, '/audit-courses');
    }
}

const newAuditCourse = async (req, res) => {
    try {
        const { name, description, startDate, endDate, access = [], logTimes = [] } = req.body;

        // بررسی وجود دوره مشابه
        const existingAuditCourse = await AuditCourse.findOne({ name });
        if (existingAuditCourse) {
            return flashAndRedirect(req, res, 'error', req.__('audit_course_exists'), '/audit-courses/new');
        }

        // آماده‌سازی دسترسی‌ها
        const formattedAccess = access.map(a => ({
            user: a.user,
            checklists: a.checklists
        }));

        // ایجاد دوره جدید با logTimes
        const newAuditCourse = new AuditCourse({
            name,
            description,
            startDate,
            endDate,
            access: formattedAccess,
            logTimes: logTimes.map(time => {
                const date = new Date(startDate); // تاریخ شروع یا تاریخ خاص دیگر
                const [hours, minutes] = time.split(':'); // تقسیم زمان به ساعت و دقیقه
                date.setHours(hours, minutes, 0, 0); // تنظیم ساعت و دقیقه
                return date;
            })
        });


        // ذخیره دوره جدید
        await newAuditCourse.save();

        logger('CREATE', 'AuditCourse', req.session.userId, req.ip);

        flashAndRedirect(req, res, 'success', req.__('audit_course_created'), '/audit-courses');

    } catch (error) {
        handleError(error, req, res, '/audit-courses');
    }
};

const renderEditAuditCourse = async (req, res) => {
    try {
        const auditCourse = await AuditCourse.findById(req.params.id).populate('access.user access.checklists');
        const checklists = await Checklist.find();
        const users = await User.find();

        res.render('audit/auditCourses/edit', {
            title: 'ویرایش دوره حسابرسی',
            auditCourse,
            checklists,
            users
        });

    } catch (error) {
        handleError(error, req, res, '/audit-courses');
    }
}

const editAuditCourse = async (req, res) => {
    try {
        const { name, description, startDate, endDate, access = [], logTimes = [] } = req.body;

        // بررسی اینکه آیا دوره مشابه با نامی دیگر وجود دارد یا نه
        const existingAuditCourse = await AuditCourse.findOne({ name, _id: { $ne: req.params.id } });
        if (existingAuditCourse) {
            return flashAndRedirect(req, res, 'error', req.__('audit_course_exists'), `/audit-courses/${req.params.id}/edit`);
        }

        // به روز رسانی دوره حسابرسی
        await AuditCourse.findByIdAndUpdate(req.params.id, {
            name,
            description,
            startDate,
            endDate,
            access: access.map(a => ({
                user: a.user,
                checklists: a.checklists
            })),
            logTimes: logTimes.map(time => {
                const date = new Date(startDate); // تاریخ شروع برای ترکیب با زمان‌ها
                const [hours, minutes] = time.split(':'); // تقسیم زمان به ساعت و دقیقه
                date.setHours(hours, minutes, 0, 0); // تنظیم ساعت و دقیقه
                return date;
            })  // تبدیل مقادیر به تاریخ و زمان برای logTimes
        }, { new: true });

        logger('UPDATE', 'AuditCourse', req.session.userId, req.ip);

        flashAndRedirect(req, res, 'success', req.__('audit_course_updated'), '/audit-courses');

    } catch (error) {
        handleError(error, req, res, '/audit-courses');
    }
};

const deleteAuditCourse = async (req, res) => {
    try {
        await AuditCourse.findByIdAndDelete(req.params.id);

        logger('DELETE', 'AuditCourse', req.session.userId, req.ip);

        flashAndRedirect(req, res, 'success', req.__('audit_course_deleted'), '/audit-courses');

    } catch (error) {
        handleError(error, req, res, '/audit-courses');
    }
}

module.exports = {
    renderAuditCourses,
    renderNewAuditCourse,
    renderEditAuditCourse,
    newAuditCourse,
    editAuditCourse,
    deleteAuditCourse
}