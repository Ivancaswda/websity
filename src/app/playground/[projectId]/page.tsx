'use client'
import React, { useEffect, useState } from 'react'
import PlaygroundHeader from "@/app/_components/PlaygroundHeader"
import ChatSection from "@/app/_components/ChatSection"
import WebsiteDesign from "@/app/_components/WebsiteDesign"
import { useParams, useSearchParams } from "next/navigation"
import axios from "axios"
import { PROMPT } from "@/app/prompt"
import { toast } from "sonner"

// 🧱 Скелетон загрузки
const SkeletonLoader = () => (
    <div className="flex-1 h-[91vh] border-l flex items-center justify-center bg-gray-100">
        <div className="w-[90%] h-[85%] bg-gray-200 animate-pulse rounded-2xl flex flex-col gap-4 p-6">
            <div className="w-2/3 h-6 bg-gray-300 rounded-md" />
            <div className="w-full h-full bg-gray-300 rounded-md" />
            <div className="w-1/2 h-5 bg-gray-300 rounded-md self-end" />
        </div>
    </div>
)

export type Frame = {
    projectId: string
    frameId: string
    designCode: string
    chatMessages: { role: string; content: string }[]
}

export type Messages = {
    role: string
    content: string
}

const PlaygroundPage = () => {
    const { projectId } = useParams()
    const params = useSearchParams()
    const frameId = params.get("frameId")

    const [frameDetail, setFrameDetail] = useState<Frame>()
    const [loading, setLoading] = useState(false)
    const [messages, setMessages] = useState<Messages[]>([])
    const [generatedCode, setGeneratedCode] = useState("")

    useEffect(() => {
        if (frameId) getFrameDetails()
    }, [frameId])

    const getFrameDetails = async () => {
        const result = await axios.get(`/api/frames?frameId=${frameId}`);
        setFrameDetail(result.data);

        const designCode = result?.data?.designCode || "";

        if (designCode.includes("```html")) {
            const index = designCode.indexOf("```html") + 7;
            const formattedCode = designCode.slice(index).replace(/```$/, "");
            setGeneratedCode(formattedCode);
        } else {
            setGeneratedCode(designCode || "");
        }

        if (result?.data?.chatMessages?.length === 1) {
            const userMessage = result?.data?.chatMessages[0]?.content;
            if (userMessage) await sendMessage(userMessage);
        } else {
            setMessages(result.data?.chatMessages || []);
        }
    };

    const sendMessage = async (userInput: string) => {
        if (!userInput.trim()) return
        setLoading(true)
        setMessages((prev) => [...prev, { role: "user", content: userInput }])

        try {
            const creditRes = await axios.post('/api/use-credit');
            toast.success(`1 звезда использована! Осталось: ${creditRes.data.credits}`);

            const response = await fetch("/api/ai-model", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [
                        {
                            role: "user",
                            content: PROMPT.replace("{userInput}", userInput),
                        },
                    ],
                    frameId: frameId
                }),
            });

            const data = await response.json();
            const text = data.content || "";

            let isCode = false;
            let extractedCode = "";

            if (text.includes("```html")) {
                isCode = true;
                const start = text.indexOf("```html") + 7;
                const end = text.lastIndexOf("```");
                extractedCode = text.slice(start, end).trim();
                setGeneratedCode(extractedCode);
            }

            await saveGeneratedCode(text);

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: isCode ? "✅ Код успешно сгенерирован!" : text,
                },
            ]);

        } catch (err: any) {
            console.error(err);
            toast.error(err?.response?.data?.error || "Ошибка при генерации");
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "⚠️ Ошибка при генерации кода" },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const saveMessages = async () => {
        await axios.put('/api/chats', {
            messages,
            frameId
        })
    }

    const saveGeneratedCode = async (designCode: string) => {
        await axios.put('/api/frames', {
            designCode,
            frameId,
            projectId
        })
        toast.success('Вебсайт готов!')
    }

    useEffect(() => {
        if (messages?.length > 0) {
            saveMessages()
        }
    }, [messages])

    return (
        <div>
            <PlaygroundHeader />
            <div className="flex">
                <ChatSection
                    loading={loading}
                    onSend={(input) => sendMessage(input)}
                    chatMessages={messages}
                />


                {loading ? (
                    <SkeletonLoader />
                ) : (
                    <WebsiteDesign generatedCode={generatedCode?.replace('```', '')} />
                )}
            </div>
        </div>
    )
}

export default PlaygroundPage
