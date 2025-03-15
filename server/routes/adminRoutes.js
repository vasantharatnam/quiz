// server/routes/adminRoutes.js
import express from 'express';
import { verifyToken, verifyAdmin } from '../middlewares/authMiddleware.js';
import { 
  getLeaderboard, 
  getAllUserScores, 
  createQuiz,
  getQuizzes,
  deleteQuiz 
} from '../controllers/adminController.js';

const router = express.Router();

// Admin-only routes
router.get('/leaderboard', verifyToken, verifyAdmin, getLeaderboard);
router.get('/scores', verifyToken, verifyAdmin, getAllUserScores);
router.get('/quizzes', verifyToken, verifyAdmin, getQuizzes);
router.post('/quiz', verifyToken, verifyAdmin, createQuiz);
router.delete('/quiz/:quizId', verifyToken, verifyAdmin, deleteQuiz);

export default router;