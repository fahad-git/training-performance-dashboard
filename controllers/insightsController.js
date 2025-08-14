const fs = require("fs");
const path = require("path");
const { sendProblem, processTrainingData, filterSessions } = require("../utils");

exports.getInsights = async (req, res) => {
  try {
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

    // Process the data using the helper function
    const insights = processTrainingData(sessions, trainingData);

    res.json(insights);
  } catch (err) {
    console.error("Error loading insights:", err);
    return sendProblem(
      res,
      500,
      "Internal Server Error",
      "Failed to load insights",
      req.originalUrl
    );
  }
};


