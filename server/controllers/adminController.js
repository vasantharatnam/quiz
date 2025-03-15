// server/controllers/adminController.js
import Score from '../models/Score.js';
import User from '../models/User.js';
import Quiz from '../models/Quiz.js';

export const getLeaderboard = async (req, res) => {
  try {
    // Highest-scoring users across all quizzes, for example
    const scores = await Score.find()
      .populate('userId', 'username')
      .sort({ score: -1 })
      .limit(20); // top 20

    // Format data
    const leaderboard = scores.map(s => ({
      username: s.userId.username,
      score: s.score,
      total: s.total,
      quizId: s.quizId,
      createdAt: s.createdAt
    }));

    return res.json(leaderboard);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getAllUserScores = async (req, res) => {
  try {
    const scores = await Score.find()
      .populate('userId', 'username')
      .populate('quizId', 'title')
      .sort({ createdAt: -1 });

    const result = scores.map(s => ({
      username: s.userId.username,
      quizTitle: s.quizId.title,
      score: s.score,
      total: s.total,
      date: s.createdAt
    }));

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const createQuiz = async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    const quiz = new Quiz({ title, description, questions });
    await quiz.save();
    return res.status(201).json({ message: 'Quiz created', quiz });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    return res.json(quizzes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    
    // Check if quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Delete associated scores
    await Score.deleteMany({ quizId });

    // Delete the quiz
    await Quiz.findByIdAndDelete(quizId);

    return res.json({ message: 'Quiz deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};  