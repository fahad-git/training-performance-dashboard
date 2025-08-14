const express = require('express');
const { getNaturalLanguageInsights } = require('../controllers/naturalLanguageInsightsController');

const router = express.Router();

/**
 * @swagger
 * /api/v1/natural-language-insights:
 *   get:
 *     summary: Get natural language insights using AI (OpenAI)
 *     tags: [Natural Language Insights]
 *     description: |
 *       Generate human-readable insights from training data using OpenAI's GPT model.
 *       Filter insights by `department` and explicit `startDate`/`endDate` (YYYY-MM-DD).
 *       Requires OPENAI_API_KEY environment variable to be configured.
 *     parameters:
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter insights by department name (case-insensitive)
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD) for filtering sessions (inclusive)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD) for filtering sessions (inclusive)
 *     responses:
 *       200:
 *         description: Returns AI-generated natural language insights
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     generatedAt:
 *                       type: string
 *                       format: date-time
 *                     version:
 *                       type: string
 *                     filters:
 *                       type: object
 *                       properties:
 *                         department:
 *                           type: string
 *                         startDate:
 *                           type: string
 *                         endDate:
 *                           type: string
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalSessions:
 *                       type: integer
 *                     passRate:
 *                       type: number
 *                     averageCompletionTime:
 *                       type: number
 *                     overallSkillAverage:
 *                       type: number
 *                 naturalLanguageInsights:
 *                   type: string
 *                   description: AI-generated human-readable insights
 *                 rawData:
 *                   $ref: '#/components/schemas/InsightsResponse'
 *       400:
 *         description: Bad Request - invalid query parameters or date format
 *         content:
 *           application/problem+json:
 *             schema:
 *               $ref: '#/components/schemas/ProblemDetails'
 *       401:
 *         description: Authentication Error - OpenAI API key not configured
 *         content:
 *           application/problem+json:
 *             schema:
 *               $ref: '#/components/schemas/ProblemDetails'
 *       429:
 *         description: Rate Limit Exceeded - OpenAI API rate limit exceeded
 *         content:
 *           application/problem+json:
 *             schema:
 *               $ref: '#/components/schemas/ProblemDetails'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/problem+json:
 *             schema:
 *               $ref: '#/components/schemas/ProblemDetails'
 */
router.get('/', getNaturalLanguageInsights);

module.exports = router;
