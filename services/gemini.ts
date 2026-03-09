
import { GoogleGenAI } from "@google/genai";

export async function editProductImage(base64Image: string, userPrompt: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Clean base64 string
  const base64Data = base64Image.split(',')[1] || base64Image;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: 'image/png',
            },
          },
          {
            text: `You are a world-class professional product photographer and digital artist. 
            Edit the provided product image according to this instruction: "${userPrompt}". 
            Make sure the product remains clearly recognizable and high-quality. 
            The lighting should be realistic and the composition should look like a professional advertisement.
            Return ONLY the generated image.`,
          },
        ],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("لم يتم العثور على صورة في رد الذكاء الاصطناعي.");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
