
import { GoogleGenAI } from "@google/genai";
import { CurriculumFile } from "../types";

const SYSTEM_INSTRUCTION = `
أنت "المحاسب الذكي"، مساعد أكاديمي متخصص لطلاب المحاسبة.
مهمتك الأساسية هي الإجابة على أسئلة الطلاب بناءً على ملف المادة المرفق.

قواعد العمل الصارمة:
1. التركيز الموضوعي: إذا حدد الطالب "فصلاً" معيناً، ابحث أولاً في ذلك الفصل داخل الملف المرفق لتقديم الإجابة الأكثر دقة وسرعة.
2. المصدر الوحيد: اعتمد كلياً على النصوص الموجودة في الملف المرفق.
3. هيكلية الإجابة: يجب أن ينقسم ردك دائماً إلى قسمين:
   - [نص المنهج]: اقتبس هنا النص كما ورد في الكتاب حرفياً (يفضل الجزء المتعلق بالفصل المحدد).
   - [شرح المحاسب الذكي]: قدم شرحاً مبسطاً بأسلوبك، مع أمثلة عملية وجداول محاسبية (مدين/دائن).
4. الحقوق: تذكر دائماً أن هذا التطبيق هو مبادرة من "سياف الحاتمي مندوب الدفعة التاسعة محاسبة".
5. تنبيه الحجم: إذا كان الملف كبيراً جداً، حاول استخلاص المعلومات الأساسية بذكاء.
`;

export class GeminiService {
  private model = 'gemini-3-flash-preview';

  async askQuestion(question: string, files: CurriculumFile[], history: {role: string, content: string}[], chapter?: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const contents = history.map(h => ({
      role: h.role,
      parts: [{ text: h.content }]
    }));

    const chapterContext = chapter ? `(يرجى التركيز على: ${chapter}) ` : "";
    const fullQuestion = `${chapterContext}${question}`;

    const currentParts: any[] = [{ text: fullQuestion }];
    
    files.forEach(file => {
      currentParts.push({
        inlineData: {
          mimeType: file.type,
          data: file.base64
        }
      });
    });

    contents.push({ role: 'user', parts: currentParts });

    try {
      const response = await ai.models.generateContent({
        model: this.model,
        contents: contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.1,
        },
      });

      return response.text || "حدث خطأ في استرداد الإجابة.";
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      if (error.message?.includes("exceeds supported limit") || error.message?.includes("413")) {
        throw new Error("⚠️ حجم الملف كبير جداً لعملية التحليل اللحظية (تجاوز 200MB). يرجى محاولة رفع نسخة من الكتاب تحتوي على نصوص أكثر وصور أقل، أو تقسيم الملف.");
      }
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
