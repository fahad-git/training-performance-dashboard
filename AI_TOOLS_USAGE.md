## AI Tools Usage


### Code Generation
─────────────────────────────────────────────────────────
- **Tool**: Bolt Model
- **Task**: Generated the initial React dashboard application with TypeScript configuration and theme.
- **Time Saved**: ~3 hours
- **Notes**: Provided a good starting structure, required manual adjustments for styling and layout.

---

- **Tool**: Cursor IDE
- **Task**: Redesigned dashboard with line chart, bar chart, radar chart, data summary cards, and redesigned filter panel with collapse, custom range, and action buttons.
- **Time Saved**: ~6 hours
- **Notes**: Required fine-tuning of font sizes, field heights, and removal of unnecessary text.

---

- **Tool**: Cursor IDE
- **Task**: Generated backend Express routes, controllers, Swagger documentation, and helper/controller split for insight extraction logic.
- **Time Saved**: ~2.5 hours
- **Notes**: Manual review was needed to simplify and clean up the code.

---

- **Tool**: Cursor IDE
- **Task**: Generated backend API function for extracting insights and also performing a call to the OpenAI API to get the data.
- **Time Saved**: ~3 hours
- **Notes**: Manual review was needed to simplify and clean up the code.

---

### Problem Solving
─────────────────────────────────────────────────────────
- **Tool**: ChatGPT
- **Task**: When I change filter options, my React UI doesn’t update, even though the API call happens. Identified the cause of UI not updating after filter changes. Suggested replacing `useEffect` with a memoized approach.
- **Time Saved**: ~2.5 hours
- **Notes**: This solved a persistent rendering issue. Cursor helped me fix this issue.

---

- **Tool**: Cursor IDE
- **Task**: Fixed chart tooltip issues.
- **Prompt**: In my React dashboard using rechart, the tooltip values in a performance line chart don’t match the server data values. Here’s my chart config and tooltip: [code]. Please debug the cause, fix the issue, and provide an explanation for the fix. 
- **Time Saved**: ~15 minutes
  
---

### Prompt Engineering
─────────────────────────────────────────────────────────

- **Tool**: ChatGPT
- **Task**: Generated optimized prompts for OpenAI API based on best practices.
- **Prompt**: As a prompt engineering expert, design an effective prompt for GPT-4 based on the provided training performance data — including department, date range, sessions, pass rate, completion time, skill averages, department performance, top skills, and performance trends — generate a short, conversational paragraph of insights for business stakeholders. Highlight trends, improvements, concerns, and actionable recommendations using specific numbers and percentages where relevant. Keep it easy to understand for non-technical audiences and under 200 words.
- **Time Saved**: ~15 minutes
- **Notes**: Integrated into backend for automated insight generation.

---

### Documentation
─────────────────────────────────────────────────────────

- **Tool**: ChatGPT
- **Task**: Regenerated README files, improved documentation clarity and structure.
- **Time Saved**: ~3 hour
- **Notes**: Resulted in more professional and concise project documentation.
