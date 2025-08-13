const express = require('express');
const { getInsights } = require('../controllers/insightsController');

const router = express.Router();

/**
 * @swagger
 * /api/v1/insights:
 *   get:
 *     summary: Get data insights with optional filtering by department and date range
 *     tags: [Insights]
 *     description: |
 *       Filter insights by `department` and explicit `startDate`/`endDate` (YYYY-MM-DD).
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
 *         description: Returns insights data with statistics and trends
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InsightsResponse'
 *       400:
 *         description: Bad Request - invalid query combination or parameter
 *         content:
 *           application/problem+json:
 *             schema:
 *               $ref: '#/components/schemas/ProblemDetails'
 *       404:
 *         description: Not Found
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
router.get('/', getInsights);

module.exports = router;
