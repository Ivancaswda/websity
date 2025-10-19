'use client'

import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/useAuth'
import axios from 'axios'
import { toast } from 'sonner'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Loader2Icon } from 'lucide-react'
import { FaGithub, FaGoogle } from 'react-icons/fa'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {Button} from "@/components/ui/button";
import GoogleButton from "@/app/(auth)/GoogleButton";
function SignUp() {
    const { user, setUser, loading } = useAuth()
    const router = useRouter()
    const [form, setForm] = useState({ userName: '', email: '', password: '' })
    const [isLoading, setIsLoading] = useState(false)

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const res = await axios.post('/api/auth/sign-up', form)
            const data = res.data
            localStorage.setItem('token', data.token)

            const userRes = await fetch('/api/auth/user', {
                headers: { Authorization: `Bearer ${data.token}` },
            })
            if (!userRes.ok) throw new Error('Failed to fetch user')

            const userData = await userRes.json()
            setUser(userData.user)
            toast.success('Добро пожаловать в Websity!')
            router.replace('/workspace')
        } catch (err: any) {
            toast.error('Ошибка регистрации. Проверьте данные.')
        } finally {
            setIsLoading(false)
        }
    }
    const handleGoogleSignIn = async () => {

    }

    useEffect(() => {
        if (!loading && user) router.replace('/workspace')
    }, [user, loading, router])

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary via-primary/80 to-primary/50 px-4">
            <div className="w-full bg-white py-4 rounded-2xl text-white max-w-md   px-6  shadow-xl p-8 backdrop-blur-md dark:bg-zinc-900">

                {/* Лого */}
                <div className="flex justify-center mb-6">
                    <Image src="/logo.png" alt="Lingvify Logo" className='rounded-xl' width={64} height={64}/>
                </div>

                <h2 className="text-2xl font-bold text-center text-primary/80 dark:text-primary">
                    Создать аккаунт в <span className="text-primary">Websity</span>
                </h2>
                <p className="mt-2 text-center text-sm text-gray-500">
                    Добро пожаловать! Заполните форму, чтобы присоединиться.
                </p>

                <form className="mt-6 space-y-4 text-white" onSubmit={handleRegister}>
                    <LabelInputContainer>
                        <Label htmlFor="userName">Имя пользователя</Label>
                        <Input
                            value={form.userName}
                            onChange={(e) => setForm({...form, userName: e.target.value})}
                            id="userName"
                            placeholder="Tyler"
                            type="text"
                        />
                    </LabelInputContainer>

                    <LabelInputContainer>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            value={form.email}
                            onChange={(e) => setForm({...form, email: e.target.value})}
                            id="email"
                            placeholder="you@example.com"
                            type="email"
                        />
                    </LabelInputContainer>

                    <LabelInputContainer>
                        <Label htmlFor="password">Пароль</Label>
                        <Input
                            value={form.password}
                            onChange={(e) => setForm({...form, password: e.target.value})}
                            id="password"
                            placeholder="••••••••"
                            type="password"
                        />
                    </LabelInputContainer>

                    <Button variant='outline'
                        className="relative flex h-10 w-full items-center justify-center rounded-lg bg-primary text-white font-medium shadow-md transition hover:opacity-90"
                        type="submit"
                    >
                        {isLoading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin"/>}
                        Создать аккаунт →
                    </Button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-500">
                    Уже есть аккаунт? <Link href="/sign-in" className="text-primary hover:underline">Войти</Link>
                </p>

                <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent"/>

                {/* Социальные кнопки */}
                <div className="flex flex-col space-y-3">
                    <GoogleButton/>
                </div>
            </div>
        </div>
    )
}


const LabelInputContainer = ({children, className}: {children: React.ReactNode, className?: string}) => (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
        {children}
    </div>
)

export default SignUp
