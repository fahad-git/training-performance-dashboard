const fs = require("fs");
const path = require("path");

function isValidISODateString(value) {
  if (typeof value !== "string") return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}/.test(value);
}

function sendProblem(res, status, title, detail, instance) {
  return res
    .status(status)
    .type("application/problem+json")
    .json({ type: "about:blank", title, status, detail, instance });
}

exports.getInsights = async (req, res) => {
  try {
    const filePath = path.join(__dirname, "../training-data.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const trainingData = JSON.parse(raw);
    let sessions = trainingData.sessions || [];

    const { department, startDate, endDate } = req.query;

    // Validate query parameters
    const hasStart = typeof startDate !== "undefined" && startDate !== "";
    const hasEnd = typeof endDate !== "undefined" && endDate !== "";

    // Filter by department if provided
    if (department) {
      sessions = sessions.filter(
        (s) => s.department.toLowerCase() === department.toLowerCase()
      );
    }

    // Determine startDate/endDate filter
    let filterStartDate = null;
    let filterEndDate = null;

    if (hasStart && !isValidISODateString(startDate)) {
      return sendProblem(
        res,
        400,
        "Invalid Query Parameter",
        "startDate must be in YYYY-MM-DD format.",
        req.originalUrl
      );
    }

    if (hasEnd && !isValidISODateString(endDate)) {
      return sendProblem(
        res,
        400,
        "Invalid Query Parameter",
        "endDate must be in YYYY-MM-DD format.",
        req.originalUrl
      );
    }

    if (hasStart) filterStartDate = new Date(startDate);
    if (hasEnd) filterEndDate = new Date(endDate);

    if (filterStartDate && filterEndDate && filterEndDate < filterStartDate) {
      return sendProblem(
        res,
        400,
        "Invalid Date Range",
        "endDate must be on or after startDate.",
        req.originalUrl
      );
    }

    // Filter by date range
    if (filterStartDate) {
      sessions = sessions.filter((s) => new Date(s.date) >= filterStartDate);
    }
    if (filterEndDate) {
      sessions = sessions.filter((s) => new Date(s.date) <= filterEndDate);
    }

    // --- existing statistics calculations below ---

    const totalSessions = sessions.length;
    const passRate =
      totalSessions > 0
        ? (sessions.filter((s) => s.passed).length / totalSessions) * 100
        : 0;

    const deptTotals = {};
    sessions.forEach((s) => {
      if (!deptTotals[s.department]) {
        deptTotals[s.department] = { 
          scoreSum: 0, 
          count: 0,
          passedCount: 0,
          skillSums: {}
        };
      }
      deptTotals[s.department].scoreSum += s.overallScore;
      deptTotals[s.department].count++;
      if (s.passed) {
        deptTotals[s.department].passedCount++;
      }
      
      // Sum up skill scores for this department
      Object.entries(s.skills).forEach(([skill, score]) => {
        if (!deptTotals[s.department].skillSums[skill]) {
          deptTotals[s.department].skillSums[skill] = 0;
        }
        deptTotals[s.department].skillSums[skill] += score;
      });
    });
    
    const avgScoresByDeptArray = Object.entries(deptTotals)
      .map(([dep, { scoreSum, count, passedCount, skillSums }]) => {
        const deptResult = {
          department: dep,
          average: +(scoreSum / count).toFixed(2),
          passRate: +(passedCount / count * 100).toFixed(2),
        };
        
        // Add average for each skill in this department
        Object.entries(skillSums).forEach(([skill, totalScore]) => {
          const skillKey = `${skill}Avg`;
          deptResult[skillKey] = +(totalScore / count).toFixed(2);
        });
        
        return deptResult;
      })
      .sort((a, b) => a.department.localeCompare(b.department));

    const skillSums = {};
    sessions.forEach((s) => {
      Object.entries(s.skills).forEach(([skill, score]) => {
        skillSums[skill] = (skillSums[skill] || 0) + score;
      });
    });
    const skillAverages = {};
    Object.entries(skillSums).forEach(([skill, total]) => {
      skillAverages[skill] = +(total / sessions.length).toFixed(2);
    });

    // Calculate overall average score across all skills and departments
    const totalSkillScores = Object.values(skillSums).reduce((sum, score) => sum + score, 0);
    const totalSkillCount = Object.keys(skillSums).length * sessions.length;
    const overallSkillAverage = totalSkillCount > 0 ? +(totalSkillScores / totalSkillCount).toFixed(2) : 0;

    const topSkills = Object.entries(skillAverages)
      .sort((a, b) => b[1] - a[1])
      .map(([skill, avg]) => ({ skill, average: avg }));

    // Calculate average completion time
    const totalCompletionTime = sessions.reduce((sum, s) => sum + (s.completionTime || 0), 0);
    const averageCompletionTime = totalSessions > 0 ? +(totalCompletionTime / totalSessions).toFixed(2) : 0;

    const trendMap = {};
    sessions.forEach((s) => {
      if (!trendMap[s.date]) {
        trendMap[s.date] = { scoreSum: 0, count: 0 };
      }
      trendMap[s.date].scoreSum += s.overallScore;
      trendMap[s.date].count++;
    });
    const performanceTrends = Object.entries(trendMap)
      .map(([date, { scoreSum, count }]) => ({
        date,
        averageScore: +(scoreSum / count).toFixed(2),
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const insights = {
      metadata: trainingData.metadata,
      totalSessions,
      passRate: +passRate.toFixed(2),
      averageCompletionTime,
      overallSkillAverage,
      averageScoresByDepartment: avgScoresByDeptArray,
      topSkills,
      performanceTrends,
    };

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
