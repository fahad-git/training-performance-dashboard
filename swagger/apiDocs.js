const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Training Insights API',
    version: '1.0.0',
    description: 'API documentation for Training Insights application',
  },
  components: {
    schemas: {
      ProblemDetails: {
        type: 'object',
        properties: {
          type: { type: 'string', example: 'about:blank' },
          title: { type: 'string', example: 'Invalid Query Parameter' },
          status: { type: 'integer', example: 400 },
          detail: { type: 'string', example: 'startDate must be in YYYY-MM-DD format.' },
          instance: { type: 'string', example: '/api/v1/insights?startDate=bad' }
        }
      },
      InsightsResponse: {
        type: 'object',
        properties: {
          metadata: {
            type: 'object',
            properties: {
              generatedAt: { type: 'string', format: 'date-time' },
              version: { type: 'string' }
            }
          },
          totalSessions: { type: 'integer' },
          passRate: { type: 'number', format: 'float' },
          averageScoresByDepartment: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                department: { type: 'string' },
                average: { type: 'number', format: 'float' }
              }
            }
          },
          topSkills: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                skill: { type: 'string' },
                average: { type: 'number', format: 'float' }
              }
            }
          },
          performanceTrends: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                date: { type: 'string', format: 'date' },
                averageScore: { type: 'number', format: 'float' }
              }
            }
          }
        }
      }
    }
  }
};

const options = {
  definition: swaggerDefinition,
  apis: ['./routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi,
};
