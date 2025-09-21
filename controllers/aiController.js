const { GoogleGenAI } = require('@google/genai');
const { conceptExplainPrompt, questionAnswerPrompt } = require('../utils/prompts');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// @desc    Generate interview questions and answers using Gemini
// @route   POST /api/ai/generate-questions
// @access  Private
const generateInterviewQuestions = async (req, res) => {
  try {
    console.log('AI Controller: Generate questions request received');
    console.log('Request body:', req.body);
    
    const { role, experience, topicToFocus, numberOfQuestions } = req.body;

    const prompt = questionAnswerPrompt(role, experience, topicToFocus, numberOfQuestions);
    
    console.log('Generated prompt:', prompt);

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    console.log('AI Response received:', !!response?.text);

    if (!response?.text) {
      console.log('No response text from AI service');
      return res.status(500).json({
        success: false,
        message: "Failed to generate response from AI service"
      });
    }

    let rawText = response.text;
    console.log('Raw AI response:', rawText.substring(0, 200) + '...');

    // Clean and parse JSON response
    const cleanedText = rawText
      .replace(/^```json\s*/, "") // remove starting ```json
      .replace(/```$/, "")        // remove ending ```
      .trim();                    // remove extra spaces

    let data;
    try {
      data = JSON.parse(cleanedText);
      console.log('Parsed AI data:', data.length, 'questions');
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Cleaned text that failed to parse:', cleanedText);
      return res.status(500).json({
        success: false,
        message: "Invalid response format from AI service"
      });
    }

    // Validate response structure
    if (!Array.isArray(data)) {
      console.log('AI response is not an array:', typeof data);
      return res.status(500).json({
        success: false,
        message: "Invalid data structure from AI service"
      });
    }

    console.log('AI Controller: Sending successful response');
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
