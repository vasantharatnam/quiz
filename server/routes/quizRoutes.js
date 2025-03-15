// server/routes/quizRoutes.js
import express from 'express';
import { getQuizzes, getQuizById, submitQuiz } from '../controllers/quizController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public: get all quizzes
router.get('/', getQuizzes);

// Public: get quiz by ID
router.get('/:quizId', getQuizById);

// Protected: submit quiz
router.post('/:quizId/submit', verifyToken, submitQuiz);

export default router;