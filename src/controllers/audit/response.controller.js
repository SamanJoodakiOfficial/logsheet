const mongoose = require('mongoose');

const Response = require('../../models/audit/response.model');
const Question = require('../../models/audit/question.model');
const Checklist = require('../../models/audit/checklist.model');
const AuditCourse = require('../../models/audit/auditCourse.model');

const flashAndRedirect = require('../../utils/flashAndRedirect');
const handleError = require('../../utils/handleError');
const logger = require('../../controllers/log.controller');

const renderResponses = async (req, res) => {
    try {
        const responses = await Response.find()
            .populate('user audit checklist question')
            .populate('question.options')
            .sort({ createdAt: -1 });

        res.render('audit/responses/index', { title: 'لیست تمامی پاسخ ها', responses });

    } catch (error) {
        handleError(error, req, res, '/responses');
    }
}

const renderReport = async (req, res) => {
    try {
        const responses = await Response.find()
            .populate('user', 'email')
            .populate('audit', 'name')
            .populate('checklist', 'name')
            .populate({
                path: 'question',
                select: 'text type options',
            })
            .lean();

        const groupedData = {};
        responses.forEach((response) => {
            const { audit, checklist, question, user, answer } = response;

            let formattedAnswer = answer;
            if (question.type === 'multiple-choice' && Array.isArray(question.options)) {
                const selectedOption = question.options.find(
                    (option) => option._id.toString() === answer.toString()
                );
                formattedAnswer = selectedOption ? selectedOption.text : 'نامشخص';
            }

            if (!groupedData[audit.name]) {
                groupedData[audit.name] = {};
            }
            if (!groupedData[audit.name][checklist.name]) {
                groupedData[audit.name][checklist.name] = {};
            }
            if (!groupedData[audit.name][checklist.name][question.text]) {
                groupedData[audit.name][checklist.name][question.text] = [];
            }

            groupedData[audit.name][checklist.name][question.text].push({
                user: user.email,
                answer: formattedAnswer,
            });
        });

        res.render('audit/auditCourses/report', {
            title: 'گزارش دوره‌ها',
            groupedData,
        });
    } catch (error) {
        handleError(error, req, res, '/responses');
    }
};


const deleteResponse = async (req, res) => {
    try {
        await Response.findByIdAndDelete(req.params.id);

        logger('DELETE', 'Response', req.session.userId, req.ip);

        flashAndRedirect(req, res, 'success', req.__('response_deleted'), '/responses');

    } catch (error) {
        handleError(error, req, res, '/responses');
    }
}

const renderNewResponse = async (req, res) => {
    try {
        const { courseId, checklistId, questionId } = req.params;
        const userId = req.session.userId;

        const question = await Question.findById(questionId)
            .populate({
                path: 'checklist',
                match: { _id: checklistId },
            });

        if (!question || !question.checklist) {
            return flashAndRedirect(req, res, 'error', 'سوال یا چک‌لیست یافت نشد.', '/audit-courses');
        }

        const course = await AuditCourse.findById(courseId)
            .populate('access', null, { user: userId });

        if (!course || !course.access.length) {
            return flashAndRedirect(req, res, 'error', 'دوره یافت نشد یا دسترسی ندارید.', '/audit-courses');
        }

        const checklist = question.checklist;

        const existingResponse = await Response.findOne({
            user: userId,
            audit: courseId,
            checklist: checklistId,
            question: questionId
        });

        // Extract hours from logTimes (assuming you want just the hour part)
        const hoursArray = course.logTimes.map(logTime => {
            const date = new Date(logTime);
            return `${date.getHours()}:00`; // Extract just the hour and display it in 24-hour format
        });

        res.render('audit/auditCourses/response', {
            title: 'پاسخ به سوال',
            course,
            checklist,
            question,
            courseName: course.name,
            checklistName: checklist.name,
            questionText: question.text,
            existingResponse,
            hoursArray // Pass the hoursArray to the EJS template
        });

    } catch (error) {
        handleError(error, req, res, '/audit-courses');
    }
};

const newResponse = async (req, res) => {
    try {
        const { courseId, checklistId, questionId } = req.params;
        const userId = req.session.userId;
        let { hours, delayTimes } = req.body;

        // Ensure 'hours' and 'delayTimes' are arrays and are valid
        if (!Array.isArray(hours) || !Array.isArray(delayTimes) || hours.length !== delayTimes.length) {
            return flashAndRedirect(req, res, 'error', 'تعداد ساعات و زمان تأخیر باید برابر باشند.', `/audit-courses/${courseId}/checklists/${checklistId}/questions/${questionId}/answer`);
        }

        // Convert hours to numbers
        let answers = hours.map((hour, index) => ({
            answer: Number(hour),
            delayTime: Number(delayTimes[index]) // Ensure delayTime is valid
        }));

        // Validate answers
        if (answers.some(a => isNaN(a.answer) || a.answer < 0 || a.answer > 100 || isNaN(a.delayTime))) {
            return flashAndRedirect(req, res, 'error', 'پاسخ یا زمان تأخیر معتبر نیست.', `/audit-courses/${courseId}/checklists/${checklistId}/questions/${questionId}/answer`);
        }

        const question = await Question.findById(questionId);
        if (!question) {
            return flashAndRedirect(req, res, 'error', 'سوال یافت نشد.', `/audit-courses/${courseId}/checklists/${checklistId}/questions/${questionId}/answer`);
        }

        const course = await AuditCourse.findById(courseId);
        if (!course) {
            return flashAndRedirect(req, res, 'error', 'دوره یافت نشد.', `/audit-courses`);
        }

        let existingResponse = await Response.findOne({
            user: userId,
            audit: courseId,
            checklist: checklistId,
            question: questionId
        });

        if (existingResponse) {
            // Update existing response
            existingResponse.answers = answers;
            await existingResponse.save();
            logger('UPDATE', 'Response', req.session.userId, req.ip);
            flashAndRedirect(req, res, 'success', 'پاسخ با موفقیت ویرایش شد.', `/audit-courses/${courseId}/checklists`);
        } else {
            // Create new response
            const newResponse = new Response({
                user: userId,
                audit: courseId,
                checklist: checklistId,
                question: questionId,
                answers: answers,
            });

            await newResponse.save();
            logger('CREATE', 'Response', req.session.userId, req.ip);
            flashAndRedirect(req, res, 'success', 'پاسخ با موفقیت ثبت شد.', `/audit-courses/${courseId}/checklists`);
        }
    } catch (error) {
        handleError(error, req, res, '/audit-courses');
    }
};



module.exports = {
    renderResponses,
    deleteResponse,
    renderNewResponse,
    newResponse,
    renderReport
}