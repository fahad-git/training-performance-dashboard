# Training Performance Dashboard

## Overview
**Training Performance Dashboard** is a robust Node.js API that provides comprehensive insights into employee training sessions. Built with Express.js and featuring Swagger documentation, this application analyzes training data to deliver performance metrics, department statistics, and trend analysis.

The dashboard transforms raw training data into actionable business intelligence, helping organizations understand training effectiveness, identify skill gaps, and track performance trends across departments.

## Key Features
- **📊 Performance Analytics**: Comprehensive training session analysis with pass rates and score distributions
- **🏢 Department Insights**: Detailed breakdown of performance by department with skill-specific metrics
- **📈 Trend Analysis**: Performance trends over time to identify patterns and improvements
- **🔍 Flexible Filtering**: Filter data by department and date ranges for targeted analysis
- **🤖 Natural Language Insights**: AI-powered human-readable insights using OpenAI GPT model
- **📚 API Documentation**: Complete Swagger/OpenAPI documentation for easy integration
- **🧪 Testing**: Comprehensive test suite with Jest and Supertest
- **🚀 RESTful API**: Clean, versioned API endpoints following REST principles

## Project Structure

```
training-performance-dashboard/
├── bin/                    # Application entry point
│   └── www                # Server startup script
├── controllers/            # Business logic layer
│   └── insightsController.js
├── routes/                 # API route definitions
│   └── insightsRoutes.js
├── swagger/                # API documentation
│   └── apiDocs.js
├── tests/                  # Test files
│   └── app.test.js
├── app.js                  # Main Express application
├── package.json            # Project dependencies and scripts
├── training-data.json      # Sample training data
└── README.md               # This file
```

## Technology Stack

### Backend
- **Runtime**: Node.js (v22.9.0)
- **Framework**: Express.js
- **Documentation**: Swagger/OpenAPI 3.0
- **Testing**: Jest + Supertest
- **Development**: Nodemon for hot reloading 

### Dependencies
- **Core**: Express, CORS, Morgan, Cookie-parser
- **AI Integration**: OpenAI (for natural language insights)
- **Documentation**: Swagger-jsdoc, Swagger-ui-express
- **Error Handling**: HTTP-errors
- **Environment**: dotenv
- **Development**: Jest, Nodemon, Supertest

## Screenshots
<img width="1800" height="1037" alt="b-ss-01" src="https://github.com/user-attachments/assets/5447f0bb-313f-4bdf-9d92-69b2c7685e23" />


---

<img width="1800" height="1036" alt="b-ss-02" src="https://github.com/user-attachments/assets/22ae6f24-1abd-4ced-8958-06393cfb07eb" />

---

<img width="1799" height="1037" alt="b-ss-03" src="https://github.com/user-attachments/assets/7f26936a-33a8-4a4e-9711-a0057e5eacb5" />

---

## Installation and Setup

### Prerequisites
- **Node.js**: Version 22.9.0 (use [nvm](https://github.com/nvm-sh/nvm) for version management)
- **Git**: For cloning the repository
- **Package Manager**: npm or yarn
- **OpenAI API Key**: Required for natural language insights functionality

### Quick Start

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd training-performance-dashboard
   ```

2. **Set Node Version**
   ```bash
   nvm use
   # or manually install Node.js v22.9.0
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Configure Environment Variables**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env and add your OpenAI API key
   # Get your API key from: https://platform.openai.com/api-keys
   OPENAI_API_KEY=your_actual_api_key_here
   ```

5. **Start the Application**
   ```bash
   # Production mode
   npm start
   
   # Development mode with auto-reload
   npm run dev
   ```

6. **Access the Application**
   - **API**: http://localhost:8000/api/v1/insights
   - **Natural Language Insights**: http://localhost:8000/api/v1/natural-language-insights
   - **Documentation**: http://localhost:8000/api-docs
   - **Health Check**: http://localhost:8000/ (redirects to insights)

## API Endpoints

### GET `/api/v1/insights`
Retrieves comprehensive training insights with optional filtering.

### GET `/api/v1/natural-language-insights`
Generates AI-powered natural language insights from training data using OpenAI GPT model.

#### Query Parameters
- `department` (optional): Filter by department name (case-insensitive)
- `startDate` (optional): Start date in YYYY-MM-DD format
- `endDate` (optional): End date in YYYY-MM-DD format

#### Example Requests
```bash
# Get all insights
curl http://localhost:8000/api/v1/insights

# Filter by department
curl "http://localhost:8000/api/v1/insights?department=engineering"

# Filter by date range
curl "http://localhost:8000/api/v1/insights?startDate=2024-01-01&endDate=2024-12-31"

# Combined filters
curl "http://localhost:8000/api/v1/insights?department=marketing&startDate=2024-06-01&endDate=2024-06-30"

# Natural Language Insights (all data)
curl http://localhost:8000/api/v1/natural-language-insights

# Natural Language Insights with department filter
curl "http://localhost:8000/api/v1/natural-language-insights?department=engineering"

# Natural Language Insights with date range
curl "http://localhost:8000/api/v1/natural-language-insights?startDate=2024-01-01&endDate=2024-12-31"

#### Response Structure
```json
{
  "metadata": {
    "generatedAt": "2024-01-01T00:00:00Z",
    "version": "1.0"
  },
  "totalSessions": 150,
  "passRate": 78.5,
  "averageCompletionTime": 45.2,
  "overallSkillAverage": 82.3,
  "averageScoresByDepartment": [
    {
      "department": "engineering",
      "average": 85.2,
      "passRate": 82.1,
      "communicationAvg": 88.5,
      "problemSolvingAvg": 87.2
    }
  ],
  "topSkills": [
    {
      "skill": "communication",
      "average": 86.7
    }
  ],
  "performanceTrends": [
    {
      "date": "2024-01-01",
      "averageScore": 84.5
    }
  ]
}
```

#### Natural Language Insights Response Structure
```json
{
  "metadata": {
    "generatedAt": "2024-01-01T00:00:00Z",
    "version": "1.0",
    "filters": {
      "department": "engineering",
      "startDate": "2024-01-01",
      "endDate": "2024-12-31"
    }
  },
  "summary": {
    "totalSessions": 45,
    "passRate": 82.1,
    "averageCompletionTime": 38.5,
    "overallSkillAverage": 85.2
  },
  "naturalLanguageInsights": "The Engineering department shows strong performance with an 82.1% pass rate across 45 training sessions. Communication skills are particularly strong at 88.5%, while problem-solving skills average 87.2%. The department completes training sessions efficiently with an average time of 38.5 minutes, suggesting good engagement and understanding of the material.",
}
```

## Data Model

### Training Session Structure
```typescript
interface Session {
  sessionId: string;        // Unique session identifier
  userId: string;           // User identifier
  userName: string;         // User's full name
  department: string;       // User's department
  date: string;             // Session date (YYYY-MM-DD)
  overallScore: number;     // Overall session score
  skills: {                 // Individual skill scores
    communication: number;
    problemSolving: number;
    productKnowledge: number;
    customerService: number;
  };
  completionTime: number;   // Time to complete (minutes)
  passed: boolean;          // Whether session was passed
}
```

## Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Test Structure
- **Integration Tests**: API endpoint testing with Supertest
- **Test Coverage**: Comprehensive coverage of all endpoints
- **Test Data**: Uses sample training data for consistent results

### Example Test
```javascript
describe('Training Data - Integration Tests', () => {
  it('should return 200 OK for the insights route', async () => {
    const response = await request(app).get('/api/v1/insights');
    expect(response.status).toBe(200);
  });
});
```

## Development

### Code Style
- **ESLint**: JavaScript linting for code quality
- **Prettier**: Automatic code formatting
- **Consistent Naming**: Clear, descriptive variable and function names

### Project Scripts
```json
{
  "start": "node ./bin/www",           // Production server
  "dev": "nodemon ./bin/www",          // Development with auto-reload
  "test": "jest --runInBand"           // Run tests sequentially
}
```

### Development Workflow
1. **Feature Development**: Create feature branches from main
2. **Code Review**: Ensure all tests pass before merging
3. **Documentation**: Update API docs for new endpoints
4. **Testing**: Add tests for new functionality

## Error Handling

### Error Response Format
```json
{
  "type": "about:blank",
  "title": "Invalid Query Parameter",
  "status": 400,
  "detail": "startDate must be in YYYY-MM-DD format.",
  "instance": "/api/v1/insights?startDate=invalid"
}
```

### Common Error Codes
- **400 Bad Request**: Invalid query parameters or date formats
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side processing errors

## Contributing

We welcome contributions to improve the Training Performance Dashboard!

### Contribution Guidelines
1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** with clear commit messages
4. **Add tests** for new functionality
5. **Update documentation** as needed
6. **Submit a pull request**

### Commit Message Format
```
Added department filtering to insights API

- Implemented department parameter filtering
- Added case-insensitive department matching
- Updated API documentation
- Added integration tests for department filtering
```

### Code Review Checklist
- [ ] All tests pass
- [ ] Code follows project style guidelines
- [ ] Documentation is updated
- [ ] Error handling is implemented
- [ ] Performance considerations addressed

## Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Check what's using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>
```

**Node Version Mismatch**
```bash
# Use correct Node version
nvm use

# Or install specific version
nvm install 22.9.0
```

**Dependencies Issues**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Deployment

### Environment Variables
```bash
PORT=8000                    # Server port (default: 8000)
NODE_ENV=production          # Environment mode
OPENAI_API_KEY=sk-...        # OpenAI API key for natural language insights
```

## License

This project is open-source and available under the [MIT License](LICENSE).

## Support

For questions, issues, or contributions:
- **Issues**: Create an issue in the repository
- **Discussions**: Use GitHub Discussions for questions
- **Contributions**: Submit pull requests for improvements

---

**Built with ❤️ for better training insights and performance tracking.**

