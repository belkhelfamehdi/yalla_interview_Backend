const { GoogleGenAI } = require('@google/genai');
const { conceptExplainPrompt, questionAnswerPrompt } = require('../utils/prompts');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// @desc    Generate interview questions and answers using Gemini
// @route   POST /api/ai/generate-questions
// @access  Private
const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicToFocus, numberOfQuestions } = req.body;

    const prompt = questionAnswerPrompt(role, experience, topicToFocus, numberOfQuestions);

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    if (!response?.text) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate response from AI service"
      });
    }

    let rawText = response.text;

    // Clean and parse JSON response
    const cleanedText = rawText
      .replace(/^```json\s*/, "") // remove starting ```json
      .replace(/```$/, "")        // remove ending ```
      .trim();                    // remove extra spaces

    let data;
    try {
      data = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return res.status(500).json({
        success: false,
        message: "Invalid response format from AI service"
      });
    }

    // Validate response structure
    if (!Array.isArray(data)) {
      return res.status(500).json({
        success: false,
        message: "Invalid data structure from AI service"
      });
    }

    res.status(200).json({
      success: true,
      message: "Questions generated successfully",
      data
    });

  } catch (error) {
    console.error('AI generation error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to generate questions"
    });
  }
};

// @desc    Generate explanation for an interview question
// @route   POST /api/ai/generate-explanation
// @access  Private
const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;

    const prompt = conceptExplainPrompt(question);

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });

    if (!response?.text) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate response from AI service"
      });
    }

    let rawText = response.text;

    // Clean and parse JSON response
    const cleanedText = rawText
      .replace(/^```json\s*/, "") // remove starting ```json
      .replace(/```$/, "")        // remove ending ```
      .trim();                    // remove extra spaces

    let data;
    try {
      data = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return res.status(500).json({
        success: false,
        message: "Invalid response format from AI service"
      });
    }

    // Validate response structure
    if (!data.title || !data.explanation) {
      return res.status(500).json({
        success: false,
        message: "Invalid data structure from AI service"
      });
    }

    res.status(200).json({
      success: true,
      message: "Explanation generated successfully",
      data
    });

  } catch (error) {
    console.error('AI explanation error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to generate explanation"
    });
  }
}

module.exports = {
  generateInterviewQuestions,
  generateConceptExplanation,
};
