import { GoogleGenAI } from "@google/genai";
import { InventoryItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateInventoryInsight = async (inventory: InventoryItem[]): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Pulse Hospital AI Insights: API Key missing. Please configure for stock optimization and procurement advice.";
  }

  try {
    const lowStock = inventory.filter(i => i.quantity <= i.minStock);
    const summary = `
      Total Items: ${inventory.length}
      Low Stock Items: ${lowStock.map(i => `${i.name} (${i.quantity} left)`).join(', ')}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are the Inventory Manager AI for Pulse Hospital in Jammu. Analyze this inventory data and provide a short, professional executive summary (max 3 sentences) advising on procurement priorities: ${summary}`,
    });

    return response.text || "No insights generated.";
  } catch (error) {
    console.error("Gemini Error", error);
    return "Pulse Hospital AI System: Unable to generate insights at this moment.";
  }
};