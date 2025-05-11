const Question = require('../models/Question');
const Session = require('../models/Session');

// @desc    Add additional questions to an existing session
// @route   POST /api/questions/add
// @access  Private
exports.addQuestionsToSession = async (req, res) => {
  try {
    const { sessionId, questions } = req.body;

    if (!sessionId || !questions) {
      return res.status(400).json({ message: 'Session ID and questions are required' });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Create new questions
    const newQuestions = await Question.insertMany(questions.map(q => ({ session: sessionId, question: q.question, answer: q.answer })));

    // Update the session with the new questions IDs
    session.questions.push(...newQuestions.map(q => q._id));
    await session.save();
    res.status(201).json({
      success: true,
      message: 'Questions added successfully',
      questions: newQuestions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Pin or unpin a question
// @route   POST /api/questions/:id/pin
// @access  Private
exports.togglePinQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        question.isPinned = !question.isPinned;
        await question.save();
        res.status(200).json({
            success: true,
            message: question.isPinned ? 'Question pinned successfully' : 'Question unpinned successfully',
            question,
        });
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a note for a question
// @route   POST /api/questions/:id/note
// @access  Private
exports.updateQuestionNote = async (req, res) => {
    try {
        const { note } = req.body;
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        question.note = note || '';
        await question.save();
        res.status(200).json({
            success: true,
            message: 'Note updated successfully',
            question,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
