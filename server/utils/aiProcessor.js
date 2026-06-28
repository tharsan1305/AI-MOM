const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

if (!ai.interactions) {
  ai.interactions = {
    create: async (params) => {
      const res = await ai.models.generateContent({ model: params.model, contents: params.input });
      return { output_text: res.text };
    }
  };
}

const SYSTEM_PROMPT = `You are an expert meeting analyst and data extractor. 
Your job is to analyze meeting notes, MOMs (Minutes of Meeting), and project discussions, 
then extract structured information and return ONLY valid JSON.`;

const extractMeetingData = async (text, inputType = 'meeting_minutes') => {
  const typeContext = {
    meeting_minutes: 'Meeting Minutes / MOM',
    project_review: 'Project Review Discussion',
    weekly_report: 'Weekly Status Report',
    sprint_review: 'Sprint Review Meeting',
    workshop_notes: 'Workshop Session Notes',
    event_summary: 'Event Summary',
  };

  const prompt = `Analyze the following ${typeContext[inputType] || 'meeting notes'} and extract all relevant information. 
Return ONLY a valid JSON object with these exact fields (use empty arrays/strings if information is not present):

{
  "meetingTitle": "string - the title or topic of the meeting",
  "date": "string - meeting date if mentioned",
  "attendees": ["array of attendee names"],
  "discussionPoints": ["array of key discussion topics/points"],
  "keyOutcomes": ["array of decisions made or outcomes reached"],
  "actionItems": [
    {
      "task": "task description",
      "assignee": "person responsible",
      "deadline": "due date if mentioned",
      "status": "pending/in-progress/completed"
    }
  ],
  "risks": ["array of identified risks or blockers"],
  "nextSteps": ["array of next steps or future plans"],
  "statusUpdates": ["array of project/task status updates"],
  "summary": "2-3 sentence executive summary of the meeting"
}

Meeting Notes:
${text}`;

  try {
    const response = await ai.interactions.create({
      model: 'gemini-3.5-flash',
      input: `${SYSTEM_PROMPT}\n\n${prompt}`
    });

    const content = response.output_text.replace(/```json/g, '').replace(/```/g, '');
    const data = JSON.parse(content);
    return { success: true, data };
  } catch (error) {
    console.error('AI Processing Error:', error.message);
    // Return fallback structured data if AI fails
    return {
      success: false,
      data: {
        meetingTitle: 'Meeting Notes',
        date: new Date().toLocaleDateString(),
        attendees: [],
        discussionPoints: [text.substring(0, 200)],
        keyOutcomes: [],
        actionItems: [],
        risks: [],
        nextSteps: [],
        statusUpdates: [],
        summary: text.substring(0, 300),
      }
    };
  }
};

module.exports = { extractMeetingData };
