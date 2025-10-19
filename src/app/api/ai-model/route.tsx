import { NextRequest, NextResponse } from "next/server";
import getServerUser from "@/lib/auth-server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PROMPT } from "@/app/prompt";
import db from "@/config/db";
import { frameTable } from "@/config/schema";
import { eq } from "drizzle-orm";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

export async function POST(req: NextRequest) {
    try {
        const { messages, frameId } = await req.json();
        const user = await getServerUser();

        if (!user) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 });
        }

        if (user.credits <= 0) {
            return NextResponse.json(
                { error: "Free limit exceeded", redirect: "/pricing" },
                { status: 403 }
            );
        }


        let designCode = "";
        if (frameId) {
            const frame = await db
                .select()
                .from(frameTable)
                .where(eq(frameTable.frameId, frameId))
                .limit(1);
            if (frame?.[0]?.designCode) designCode = frame[0].designCode;
        }


        const conversation = messages
            .map((m: any) => `${m.role.toUpperCase()}: ${m.content}`)
            .join("\n\n");


        const fullPrompt = `
${PROMPT}

Вот текущий HTML сайта, который ты должен модифицировать при необходимости:
\`\`\`html
${designCode || "<!-- Код сайта пока отсутствует -->"}
\`\`\`

История чата:
${conversation}

Теперь продолжи ответ, учитывая предыдущий код и все указания.
`;

        // 🧠 Отправляем в Gemini
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(fullPrompt);
        const text = result.response.text();

        return NextResponse.json({ content: text });
    } catch (err: any) {
        console.error("❌ Ошибка в /api/ai-model:", err);
        return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
    }
}
