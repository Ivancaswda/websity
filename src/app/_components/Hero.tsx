'use client'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Form, FormField } from "@/components/ui/form"
import TextareaAutosize from "react-textarea-autosize"
import { cn, generateRandomFrameNumber } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowUpIcon, Loader2Icon } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"
import { useRouter } from "next/navigation"

import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover"
import {useAuth} from "@/context/useAuth";

const formSchema = z.object({
    value: z.string().min(1, { message: 'value is required' }).max(10000, { message: 'Value is too long' }),
})

const Hero = () => {
    const [isFocused, setIsFocused] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const [userInput, setUserInput] = useState('')
    const [showNoCredits, setShowNoCredits] = useState(false)
    const {user} = useAuth()
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { value: "" },
    })


    const onSelect = (value: string) => {
        setUserInput(value)
        form.setValue('value', value)
    }

    const createNewProject = async () => {
        if (!userInput.trim()) {
            toast.error("Введите или выберите запрос")
            return
        }

        setIsPending(true)

        try {



            if (user?.credits <= 0) {
                setShowNoCredits(true)
                setIsPending(false)
                return
            }

            const projectId = uuidv4()
            const frameId = generateRandomFrameNumber()
            const messages = [{ role: 'user', content: userInput }]

            await axios.post('/api/projects', { projectId, frameId, messages })
            toast.success('Проект создан!')
            router.push(`/playground/${projectId}?frameId=${frameId}`)
        } catch (error: any) {
            if (error.response?.status === 403) {
                setShowNoCredits(true)
            } else {
                toast.error(error?.response?.data?.error || 'Не удалось создать проект')
            }
            console.error(error)
        } finally {
            setIsPending(false)
        }
    }

    return (
        <section className="space-y-6 py-[16vh] 2xl:py-48 mx-auto">
            <h1 className="text-2xl md:text-5xl font-bold text-center">
                Сайты стало создавать проще с помощью <span className="text-primary">Websity</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-center">
                Проектируйте сайты за секунды, используя новейшие технологии ИИ
            </p>

            <div className="max-w-3xl mx-auto w-full">
                <Form {...form}>
                    <section className="space-y-6">
                        <form
                            onSubmit={(e) => { e.preventDefault(); createNewProject() }}
                            className={cn(
                                'relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all',
                                isFocused && "shadow-xs"
                            )}
                        >
                            <FormField
                                name="value"
                                render={() => (
                                    <TextareaAutosize
                                        disabled={isPending}
                                        value={userInput}
                                        onChange={(e) => {
                                            setUserInput(e.target.value)
                                            form.setValue('value', e.target.value)
                                        }}
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => setIsFocused(false)}
                                        minRows={2}
                                        maxRows={8}
                                        className="pt-4 resize-none border-none w-full outline-none bg-transparent"
                                        placeholder="Какой сайт вы бы хотели увидеть"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault()
                                                if (user?.credits <= 0) {
                                                    setShowNoCredits(true)
                                                } else {
                                                    createNewProject()
                                                }
                                            }
                                        }}
                                    />
                                )}
                            />

                            <div className="flex gap-x-2 items-end justify-between pt-2">
                                <div className="text-[10px] text-muted-foreground font-mono">
                                    <kbd className="ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                                        Enter
                                    </kbd>{' '}
                                    для отправки
                                </div>

                                <Popover open={showNoCredits} onOpenChange={setShowNoCredits}>

                                    <Button
                                        type="submit"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (user?.credits <= 0) {
                                                // Только если нет кредитов — показать поповер
                                                setShowNoCredits(true);
                                            } else {
                                                createNewProject();
                                            }
                                        }}
                                        disabled={isPending}
                                        className={cn('size-8 rounded-full', isPending && 'bg-muted-foreground border')}
                                    >
                                        {isPending ? <Loader2Icon className="size-4 animate-spin" /> : <ArrowUpIcon />}
                                    </Button>

                                    <PopoverContent className="w-64">
                                        <p className="text-sm text-center text-red-600 mb-2">
                                            Недостаточно звезд для создания проекта!
                                        </p>
                                        <Button className="w-full" onClick={() => router.push('/pricing')}>
                                            Купить звезды
                                        </Button>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </form>

                        <div className="flex-wrap justify-center gap-2 hidden md:flex max-w-3xl">
                            {[
                                'Создай Лэндинговую страницу для любого стартапа',
                                'Сгенерируй калькулятор приложение',
                                'Сделай крутое портфолио для начинающего разработчика'
                            ].map((template, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    className="bg-white flex items-center dark:bg-sidebar"
                                    onClick={() => onSelect(template)}
                                >
                                    {template}
                                </Button>
                            ))}
                        </div>
                    </section>
                </Form>
            </div>
        </section>
    )
}

export default Hero
