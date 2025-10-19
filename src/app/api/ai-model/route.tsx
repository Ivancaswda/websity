import { NextRequest, NextResponse } from "next/server";
import getServerUser from "@/lib/auth-server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PROMPT } from "@/app/prompt"; // импорт твоего промпта

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

// Утилиты для очистки JSON (на случай, если модель вернёт с ```json)
export function cleanJSON(content: string) {
    return content
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .replace(/\r?\n|\r/g, "")
        .trim();
}

export function safeParseJSON(jsonString: string) {
    const cleaned = cleanJSON(jsonString);
    try {
        return { ok: true, data: JSON.parse(cleaned) };
    } catch (error: any) {
        return { ok: false, raw: jsonString, error: error.message };
    }
}

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();
        const user = await getServerUser();

        if (!user) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 });
        }

        if (user.credits <= 0) {
            return NextResponse.json(
                { error: "Free limit exceeded", redirect: "/premium" },
                { status: 403 }
            );
        }

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // Промпт + сообщения
        const fullPrompt = [
            { role: "system", content: PROMPT },
            ...messages.map((m: any) => ({ role: m.role, content: m.content })),
        ];

        console.log("🧠 Full prompt:", fullPrompt);

        // Объединяем весь текст промпта в один запрос
        const result = await model.generateContent(
            fullPrompt.map((m) => m.content).join("\n")
        );

        const text = result.response.text();

        // Gemini возвращает текст, а не JSON, поэтому просто отдаём строку
        return NextResponse.json({ content: text });
    } catch (err: any) {
        console.error("❌ Ошибка в /api/ai-model:", err);

        if (err?.response?.status === 429) {
            return NextResponse.json(
                {
                    error: "🚦 Лимит токенов на API-ключ достигнут. Попробуйте позже.",
                    code: "QUOTA_EXCEEDED",
                },
                { status: 429 }
            );
        }

        return NextResponse.json({ error: err?.message || err }, { status: 500 });
    }
}
