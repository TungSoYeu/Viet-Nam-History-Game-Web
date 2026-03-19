const express = require('express');
const router = express.Router();
const {
    createQuestion,
    getQuestions,
    getRandomQuestions,
    updateQuestion,
    deleteQuestion,
    getQuestionsByRegion
} = require('../controllers/questionController');

// Đặt /random trước /:id để tránh bị lầm tưởng "random" là một ":id"
router.get('/random', getRandomQuestions);

router.get('/territory/:region', getQuestionsByRegion);

router.route('/')
    .get(getQuestions)
    .post(createQuestion);

router.route('/:id')
    .put(updateQuestion)
    .delete(deleteQuestion);

module.exports = router;
