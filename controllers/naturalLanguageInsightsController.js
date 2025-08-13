const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");
const { sendProblem, processTrainingData, filterSessions } = require("../utils");

// Initialize OpenAI client (will be validated before use)
let openai = null;

// Create a prompt for OpenAI based on the insights data
function createPrompt(insightsData, filters) {
  const { department, startDate, endDate } = filters;
  
  let context = "Based on the following training performance data";
  
  if (department) {
    context += ` for the ${department} department`;
  }
  
  if (startDate && endDate) {
    context += ` from ${startDate} to ${endDate}`;
  } else if (startDate) {
    context += ` from ${startDate} onwards`;
  } else if (endDate) {
    context += ` up to ${endDate}`;
  }
  
  context += ", provide natural language insights in a short paragraph that would be valuable for business stakeholders. ";
  context += "Focus on trends, improvements, areas of concern, and actionable recommendations. ";
  context += "Use natural business language and include specific numbers and percentages where relevant. ";
  context += "Make the insights conversational and easy to understand for non-technical audiences.";

  const prompt = `${context}

Training Data Summary:
- Total Sessions: ${insightsData.totalSessions}
- Overall Pass Rate: ${insightsData.passRate}%
- Average Completion Time: ${insightsData.averageCompletionTime} minutes
- Overall Skill Average: ${insightsData.overallSkillAverage}%

Department Performance:
${insightsData.averageScoresByDepartment.map(dept => 
  `- ${dept.department}: ${dept.average}% average score, ${dept.passRate}% pass rate`
).join('\n')}

Top Skills:
${insightsData.topSkills.map(skill => 
  `- ${skill.skill}: ${skill.average}% average`
).join('\n')}

Performance Trends:
${insightsData.performanceTrends.map(trend => 
  `- ${trend.date}: ${trend.averageScore}% average score`
).join('\n')}

Please provide natural language insights based on this data:`;

  return prompt;
}

exports.getNaturalLanguageInsights = async (req, res) => {

  try {

    // Load and filter training data using utility functions
    const filePath = path.join(__dirname, "../training-data.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const trainingData = JSON.parse(raw);
    let sessions = trainingData.sessions || [];

    try {
      // Use the utility function to filter sessions
      sessions = filterSessions(sessions, req.query);
    } catch (validationError) {
      return sendProblem(
        res,
        400,
        validationError.title || "Invalid Query Parameter",
        validationError.message,
        req.originalUrl
      );
    }

    // Extract insights data using the shared function
    const insightsData = processTrainingData(sessions, trainingData);

    // Get filter values for prompt creation
    const { department, startDate, endDate } = req.query;

    // Create prompt for OpenAI
    const prompt = createPrompt(insightsData, { department, startDate, endDate });

    if(process.env.NODE_ENV === "development") {
      console.log("Prompt:\n", prompt);
    }

    // Check if OpenAI API key is configured and initialize client
    if (!process.env.OPENAI_API_KEY) {
      return sendProblem(
        res,
        500,
        "Configuration Error",
        "OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.",
        req.originalUrl
      );
    }

    // Initialize OpenAI client
    if (!openai) {
      openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Use the correct model name
      messages: [
        {
          role: "system",
          content: "You are a business analyst specializing in training performance insights. Provide clear, actionable insights based on training data."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000, // Increase token limit to get complete responses
      temperature: 0.7
    });
    
    if(process.env.NODE_ENV === "development") {
      console.log("Completion:\n", completion);
    }
    
    const aiInsights = completion.choices[0]?.message?.content || "Unable to generate insights at this time.";
    
    // Check if response was truncated
    if (completion.choices[0]?.finish_reason === 'length') {
      console.warn("Warning: AI response was truncated due to token limit. Consider increasing max_tokens.");
    }

    // Prepare response
    const response = {
      metadata: {
        generatedAt: new Date().toISOString(),
        version: "1.0",
        filters: {
          department: department || "all",
          startDate: startDate || "all",
          endDate: endDate || "all"
        }
      },
      summary: {
        totalSessions: insightsData.totalSessions,
        passRate: insightsData.passRate,
        averageCompletionTime: insightsData.averageCompletionTime,
        overallSkillAverage: insightsData.overallSkillAverage
      },
      naturalLanguageInsights: aiInsights
    };

    res.json(response);

  } catch (err) {
    console.error("Error generating natural language insights:", err);
    
    // Handle OpenAI-specific errors
    if (err.status === 401) {
      return sendProblem(
        res,
        401,
        "Authentication Error",
        "Invalid OpenAI API key. Please check your configuration.",
        req.originalUrl
      );
    }
    
    if (err.status === 429) {
      return sendProblem(
        res,
        429,
        "Rate Limit Exceeded",
        "OpenAI API rate limit exceeded. Please try again later.",
        req.originalUrl
      );
    }

    return sendProblem(
      res,
      500,
      "Internal Server Error",
      "Failed to generate natural language insights",
      req.originalUrl
    );
  }
};
