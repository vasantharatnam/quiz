// server/controllers/quizController.js
import Quiz from '../models/Quiz.js';
import Score from '../models/Score.js';
import jwt from 'jsonwebtoken';

export const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().select('_id title description questions');
    const formattedQuizzes = quizzes.map(quiz => ({
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      questionCount: quiz.questions.length
    }));
    return res.json(formattedQuizzes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    return res.json(quiz);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body; // array of user-selected answers

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Evaluate score
    let score = 0;
    quiz.questions.forEach((question, index) => {
      // question.correctAnswers is an array
      // answers[index] is an array of chosen indices for 'multiple' type
      // or a single index for 'single' or 'truefalse' type.
      if (question.questionType === 'single' || question.questionType === 'truefalse') {
        if (answers[index] !== undefined && question.correctAnswers[0] === answers[index]) {
          score++;
        }
      } else if (question.questionType === 'multiple') {
        // For multiple correct answers, we compare sets
        const correctSet = new Set(question.correctAnswers);
        const answerSet = new Set(answers[index] || []);
        if (correctSet.size === answerSet.size && [...correctSet].every(a => answerSet.has(a))) {
          score++;
        }
      }
    });

    // total number of questions
    const total = quiz.questions.length;

    // Save the result in Score collection
    // We assume we have the user's id from the token (req.user.userId).
    const userId = req.user.userId;
    const newScore = new Score({
      userId,
      quizId,
      score,
      total
    });
    await newScore.save();

    return res.json({ score, total });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};