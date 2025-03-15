// server/models/Quiz.js
import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  // If you want a description or other metadata
  description: { type: String },
  // We can reference questions or embed them.
  questions: [
    {
      questionText: { type: String, required: true },
      questionType: { type: String, enum: ['single', 'multiple', 'truefalse'], default: 'single' },
      options: [String],  // for multiple-choice or single-choice
      correctAnswers: [Number], // indices of correct answer(s). For T/F, 0 or 1, etc.
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Quiz', quizSchema);