import { GoogleGenAI, Type, Content } from "@google/genai";
import { DreamAnalysis, ChatMessage } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is missing in environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

// 1. Analyze the dream text to get structure JSON data
export const analyzeDreamText = async (dreamText: string): Promise<DreamAnalysis> => {
  const ai = getAiClient();
  
  const systemPrompt = `
    You are an expert Jungian dream interpreter and psychologist. 
    Analyze the user's dream description. 
    Provide a title, a short summary, a deeper psychological interpretation, 
    the dominant mood, and a list of 5 key emotions with intensity scores (1-100) present in the dream.
    Also extract 3-5 keywords.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: dreamText,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            interpretation: { type: Type.STRING },
            mood: { type: Type.STRING },
            emotions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  value: { type: Type.INTEGER, description: "Intensity from 1 to 100" }
                }
              }
            },
            keywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as DreamAnalysis;
    }
    throw new Error("No text returned from analysis model.");
  } catch (error) {
    console.error("Dream Analysis Error:", error);
    throw error;
  }
};

// 2. Generate an image based on the dream
export const generateDreamImage = async (dreamText: string, mood: string): Promise<string | null> => {
  const ai = getAiClient();

  // Create a visually descriptive prompt based on the dream
  const imagePrompt = `
    A surreal, artistic, and dreamlike digital painting representing this dream: "${dreamText}". 
    The mood is ${mood}. High quality, ethereal lighting, abstract but recognizable forms, 
    mystical atmosphere, 4k resolution, cinematic composition.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image", // Using flash-image for speed/cost balance
      contents: {
        parts: [{ text: imagePrompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1", // Square for card layout
        }
      }
    });

    // Iterate through parts to find the image data
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    // We return null instead of throwing so the user still gets the text analysis even if image fails
    return null;
  }
};

// 3. Chat with the Dream Guide (Context-Aware)
export const sendDreamChat = async (
  currentHistory: ChatMessage[], 
  newMessage: string, 
  dreamContext: DreamAnalysis
): Promise<string> => {
  const ai = getAiClient();

  // Construct the history in the format the SDK expects
  const historyContents: Content[] = currentHistory.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  const systemInstruction = `
    You are a wise and empathetic Dream Guide. 
    You are currently discussing a specific dream with the user.
    
    Here is the analysis of the dream you are discussing:
    Title: ${dreamContext.title}
    Summary: ${dreamContext.summary}
    Interpretation: ${dreamContext.interpretation}
    Mood: ${dreamContext.mood}
    
    Answer the user's questions about this dream, explore deeper meanings, 
    and provide psychological insights based on Jungian archetypes if relevant.
    Keep responses concise (under 100 words) but insightful.
  `;

  try {
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      history: historyContents,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "I'm having trouble connecting to the dream realm right now.";
  } catch (error) {
    console.error("Chat Error:", error);
    throw error;
  }
};
