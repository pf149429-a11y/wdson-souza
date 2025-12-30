
import { GoogleGenAI, Type } from "@google/genai";
import { GFXSettings, HardwareProfile, OptimizationResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAIOptimization = async (profile: HardwareProfile): Promise<OptimizationResponse> => {
  const prompt = `
    Como um Engenheiro Especialista em Gráficos de Jogos, analise este perfil de hardware e recomende as melhores configurações GFX para jogos competitivos (ex: PUBG, Warzone, Free Fire).
    
    Perfil de Hardware:
    - CPU: ${profile.cpu}
    - GPU: ${profile.gpu}
    - RAM: ${profile.ram}
    - OS: ${profile.os}
    - Taxa de Atualização da Tela: ${profile.refreshRate}Hz
    
    Objetivo: Priorizar a estabilidade do FPS (tentando atingir a taxa máxima da tela se possível) mantendo a visibilidade dos inimigos.
    IMPORTANTE: Escreva a explicação e todos os campos de texto em Português do Brasil.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recommendedSettings: {
            type: Type.OBJECT,
            properties: {
              resolution: { type: Type.STRING },
              graphics: { type: Type.STRING },
              fps: { type: Type.STRING },
              style: { type: Type.STRING },
              msaa: { type: Type.STRING },
              shadows: { type: Type.BOOLEAN },
              zeroLagMode: { type: Type.BOOLEAN },
              gpuOptimization: { type: Type.BOOLEAN },
              memoryBoost: { type: Type.BOOLEAN },
            },
            required: ["resolution", "graphics", "fps", "style", "msaa", "shadows", "zeroLagMode", "gpuOptimization", "memoryBoost"]
          },
          explanation: { type: Type.STRING },
          expectedPerformance: {
            type: Type.OBJECT,
            properties: {
              avgFps: { type: Type.NUMBER },
              thermalImpact: { type: Type.STRING },
              batteryImpact: { type: Type.STRING },
            },
            required: ["avgFps", "thermalImpact", "batteryImpact"]
          }
        },
        required: ["recommendedSettings", "explanation", "expectedPerformance"]
      },
    },
  });

  return JSON.parse(response.text || '{}');
};
