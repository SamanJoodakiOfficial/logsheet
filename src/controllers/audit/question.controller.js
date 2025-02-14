const mongoose = require('mongoose');
const Checklist = require('../../models/audit/checklist.model');
const Question = require('../../models/audit/question.model');

const logger = require('../../controllers/log.controller');
const flashAndRedirect = require('../../utils/flashAndRedirect');
const handleError = require('../../utils/handleError');

const renderQuestions = async (req, res) => {
    try {
        const questions = await Question.find()
            .populate('checklist')
            .sort({ createdAt: -1 });
        res.render('audit/questions/index', { title: 'بانک سوالات', questions });
    } catch (error) {
        handleError(error, req, res, '/questions');
    }
};

const renderNewQuestion = async (req, res) => {
    try {
        const checklists = await Checklist.find();

        res.render('audit/questions/new', { title: 'ایجاد سوال جدید', checklists });

    } catch (error) {
        handleError(error, req, res, '/questions');
    }
};
const newQuestion = async (req, res) => {
    try {
        const { text, type, checklist } = req.body;

        const newQuestion = new Question({
            text: text.trim(),
            type,
            checklist: mongoose.Types.ObjectId.isValid(checklist) ? checklist : null
        });

        await newQuestion.save();

        logger('CREATE', 'Question', req.session.userId, req.ip);

        flashAndRedirect(req, res, 'success', req.__('question_created'), '/questions');
    } catch (error) {
        handleError(error, req, res, '/questions');
    }
};

const renderEditQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        const checklist = await Checklist.findById(question.checklist);
        const checklists = await Checklist.find();
        res.render('audit/questions/edit', { title: 'ویرایش سوال', question, checklist, checklists });
    } catch (error) {
        handleError(error, req, res, '/questions');
    }
};

const editQuestion = async (req, res) => {
    try {
        const { text, type, checklist } = req.body;

        await Question.findByIdAndUpdate(
            req.params.id,
            {
                text: text.trim(), type, checklist: mongoose.Types.ObjectId.isValid(checklist) ? checklist : null
            },
            { new: true }
        );

        logger('UPDATE', 'Question', req.session.userId, req.ip);

        flashAndRedirect(req, res, 'success', req.__('question_updated'), '/questions');
    } catch (error) {
        handleError(error, req, res, '/questions');
    }
};

const deleteQuestion = async (req, res) => {
    try {
        await Question.findByIdAndDelete(req.params.id);

        logger('DELETE', 'Question', req.session.userId, req.ip);

        flashAndRedirect(req, res, 'success', req.__('question_deleted'), '/questions');
    } catch (error) {
        handleError(error, req, res, '/questions');
    }
};

module.exports = {
    renderQuestions,
    renderNewQuestion,
    renderEditQuestion,
    newQuestion,
    editQuestion,
    deleteQuestion,
};
