'use client'
import React, { useState } from 'react'
import { Messages } from "@/app/playground/[projectId]/page"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle
} from "@/components/ui/empty"
import { FaMessage } from "react-icons/fa6"
import { Button } from "@/components/ui/button"
import { ArrowUp, RefreshCcwIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
    chatMessages: Messages[],
    onSend: (message: string) => void,
    loading: boolean
}

const ChatSection = ({ chatMessages, onSend, loading }: Props) => {
    const [input, setInput] = useState<string>("")

    const handleSend = () => {
        const trimmed = input.trim()
        if (!trimmed) return
        onSend(trimmed)
        setInput("")
    }

    return (
        <div className="w-96 shadow h-[92vh] flex flex-col border-r bg-background">

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {!chatMessages || chatMessages.length === 0 ? (
                    <Empty className="from-muted/50 to-background h-full bg-gradient-to-b from-30%">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <FaMessage />
                            </EmptyMedia>
                            <EmptyTitle>Нет сообщений</EmptyTitle>
                            <EmptyDescription>
                                Ваш чат пока пуст. Сгенерированные ответы появятся здесь.
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                                <RefreshCcwIcon className="mr-1 h-4 w-4" />
                                Обновить
                            </Button>
                        </EmptyContent>
                    </Empty>
                ) : (
                    chatMessages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={cn(
                                    "p-2 rounded-lg max-w-[80%] whitespace-pre-wrap break-words",
                                    msg.role === "user"
                                        ? "bg-primary text-white"
                                        : "bg-muted text-black"
                                )}
                            >
                                {typeof msg.content === "string"
                                    ? msg.content
                                    : JSON.stringify(msg.content)}
                            </div>
                        </div>
                    ))
                )}


                {loading && (
                    <div className="flex justify-start mt-3">
                        <div className="bg-muted text-black rounded-lg p-2 flex items-center justify-center w-[60px] h-[30px]">
                            <div className="flex space-x-1">
                                <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>


            <div className="p-3 border-t flex items-center gap-2">
        <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Опиши дизайн вашего вебсайта..."
            className="px-3 py-2 flex-1 resize-none border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            rows={1}
            disabled={loading}
        />
                <Button onClick={handleSend} disabled={loading}>
                    <ArrowUp />
                </Button>
            </div>
        </div>
    )
}

export default ChatSection
