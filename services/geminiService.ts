import { GoogleGenAI, Type } from "@google/genai";
import { CatStats, GameEvent } from "../types";

const SYSTEM_INSTRUCTION = `
你是一个文字冒险游戏的GM。玩家扮演一只在现代战争废墟中求生的流浪猫。
游戏主题：反战、人性、生存、温情与残酷并存。
请根据玩家当前的属性、天数和行动，生成一个具体的随机事件。

写作风格要求：
1. 像一部沉重的小说，注重环境描写（气味、声音、光线）和心理描写。
2. 即使是寻找食物，也要体现出战争背景下的艰难或危险。
3. 增加人性的复杂度，不要非黑即白。
4. 有时可以是温馨的（如与其他动物互助），有时是残酷的（目睹死亡）。

属性说明：
health: 健康, stamina: 体力, mood: 心情, hunger: 饱腹, trust: 信任值, wildness: 野性(反之为人性), dignity: 尊严。

输出必须严格符合以下JSON Schema：
{
  "title": "事件标题（简短有力）",
  "description": "事件描述（60-120字），这是故事的核心，请写得引人入胜。",
  "choices": [
    {
      "text": "选项A的动作（如：悄悄靠近）",
      "effectDescription": "选项A的结果反馈（30-50字），告诉玩家发生了什么，以及情感上的触动。",
      "statChanges": { "health": -10, "hunger": 10 } 
    },
    {
      "text": "选项B的动作（如：转身逃跑）",
      "effectDescription": "选项B的结果反馈。",
      "statChanges": { "dignity": 5, "stamina": -5 }
    }
  ]
}
`;

export const generateStoryEvent = async (
  apiKey: string,
  day: number,
  action: string,
  stats: CatStats,
  catName: string
): Promise<GameEvent> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
    当前情况：
    名字：${catName}
    第 ${day} 天 (共30天)
    玩家行动：${action}
    当前属性：${JSON.stringify(stats)}
    
    请生成一个符合战争背景的事件。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                choices: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            text: { type: Type.STRING },
                            effectDescription: { type: Type.STRING },
                            statChanges: {
                                type: Type.OBJECT,
                                properties: {
                                    health: { type: Type.INTEGER },
                                    stamina: { type: Type.INTEGER },
                                    mood: { type: Type.INTEGER },
                                    hunger: { type: Type.INTEGER },
                                    trust: { type: Type.INTEGER },
                                    wildness: { type: Type.INTEGER },
                                    dignity: { type: Type.INTEGER },
                                }
                            }
                        },
                        required: ["text", "effectDescription", "statChanges"]
                    }
                }
            },
            required: ["title", "description", "choices"]
        }
      },
    });

    const text = response.text;
    if (!text) throw new Error("AI returned empty response");

    const eventData = JSON.parse(text);
    return {
      id: `ai_${Date.now()}`,
      ...eventData
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback error event is handled in App.tsx
    throw error;
  }
};
