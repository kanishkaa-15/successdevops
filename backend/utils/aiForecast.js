const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'dummy_to_prevent_crash' });

async function generateResourceForecast(historicalData) {
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
        return generateBasicForecast(historicalData);
    }

    try {
        const prompt = `You are a school resource forecasting AI. Based on the following historical data:
Total Admissions: ${historicalData.admissions}
Staff Retention: ${historicalData.staffRetention}%
Current Queries Volume: ${historicalData.queries}

Predict the following for the next semester. Return ONLY a valid JSON object with exact keys, nothing else:
{
  "projectedAdmissions": number,
  "staffHiringNeeded": number,
  "expectedBudgetIncreasePercent": number,
  "strategicRecommendation": "string"
}`;

        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an expert school administrator AI. Always return strict, parseable JSON."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama3-8b-8192",
            temperature: 0.2,
            max_tokens: 150,
        });

        const content = response.choices[0]?.message?.content?.trim();
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return generateBasicForecast(historicalData);
    } catch (error) {
        console.warn("Groq resource forecasting failed, falling back to basic:", error.message);
        return generateBasicForecast(historicalData);
    }
}

function generateBasicForecast(data) {
    // Basic heuristic math fallback
    const projectedAdmissions = Math.round(data.admissions * 1.05);
    const staffHiringNeeded = data.staffRetention < 80 ? 5 : 2;
    const expectedBudgetIncreasePercent = 4.5;
    
    return {
        projectedAdmissions,
        staffHiringNeeded,
        expectedBudgetIncreasePercent,
        strategicRecommendation: "Increase capacity to accommodate steady admission growth. Focus on staff retention programs."
    };
}

module.exports = { generateResourceForecast };
