/**
 * Data processing utility functions
 * Common data processing logic used across controllers
 */

/**
 * Processes training data and returns calculated insights
 * @param {Array} sessions - Array of training sessions
 * @param {Object} trainingData - Training data metadata
 * @returns {Object} - Processed insights data
 */
function processTrainingData(sessions, trainingData) {
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

  return {
    metadata: trainingData.metadata,
    totalSessions,
    passRate: +passRate.toFixed(2),
    averageCompletionTime,
    overallSkillAverage,
    averageScoresByDepartment: avgScoresByDeptArray,
    topSkills,
    performanceTrends,
  };
}

/**
 * Filters training sessions based on query parameters
 * @param {Array} sessions - Array of training sessions
 * @param {Object} query - Query parameters object
 * @returns {Array} - Filtered sessions array
 */
function filterSessions(sessions, query) {
  let filteredSessions = [...sessions];

  const { department, startDate, endDate } = query;

  // Filter by department if provided
  if (department) {
    filteredSessions = filteredSessions.filter(
      (s) => s.department.toLowerCase() === department.toLowerCase()
    );
  }

  // Filter by date range if provided
  if (startDate || endDate) {
    const validation = require('./validation').validateDateRange(startDate, endDate);
    
    if (!validation.isValid) {
      const error = new Error(validation.error.message);
      error.title = validation.error.title;
      throw error;
    }

    if (validation.filterStartDate) {
      filteredSessions = filteredSessions.filter((s) => new Date(s.date) >= validation.filterStartDate);
    }
    if (validation.filterEndDate) {
      filteredSessions = filteredSessions.filter((s) => new Date(s.date) <= validation.filterEndDate);
    }
  }

  return filteredSessions;
}

module.exports = {
  processTrainingData,
  filterSessions
};
