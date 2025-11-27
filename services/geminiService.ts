import { GoogleGenAI, Type } from "@google/genai";
import { RescueMember, AIRiskAssessment } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeTeamRisk = async (members: RescueMember[]): Promise<AIRiskAssessment> => {
  try {
    // Simplify data for token efficiency
    const teamSnapshot = members.map(m => ({
      name: m.name,
      role: m.role,
      hr: m.vitals.heartRate,
      spo2: m.vitals.spo2,
      fatigue: m.vitals.fatigueLevel,
      co_gas: m.environment.carbonMonoxide,
      env_temp: m.environment.temperature,
      status: m.status
    }));

    const prompt = `
      You are an AI advisor for an NDRF (National Disaster Response Force) operation.
      Analyze the following telemetry data from a rescue team inside a hazardous building.
      
      Data: ${JSON.stringify(teamSnapshot)}
      
      Provide a tactical assessment. 
      - Identify specific members at risk.
      - Suggest immediate commands for the supervisor (e.g., "Order Retreat", "Ventilate Area", "Rest").
      - Determine overall mission risk.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            immediateActions: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            riskLevel: { 
              type: Type.STRING, 
              enum: ["LOW", "MODERATE", "HIGH", "EXTREME"] 
            }
          },
          required: ["summary", "immediateActions", "riskLevel"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIRiskAssessment;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return {
      summary: "AI Connection failed. Proceed with manual protocol.",
      immediateActions: ["Check communication lines", "Monitor vitals manually"],
      riskLevel: "MODERATE"
    };
  }
};
