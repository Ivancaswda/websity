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
import Image from "next/image";
import GoogleButton from "@/app/(auth)/GoogleButton";
function SignIn() {
    const { user, setUser } = useAuth()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [form, setForm] = useState({ email: '', password: '' })

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const res = await axios.post('/api/auth/sign-in', form)
            const data = res.data
            localStorage.setItem('token', data.token)

            const userRes = await fetch('/api/auth/user', {
                headers: { Authorization: `Bearer ${data.token}` },
            })
            if (!userRes.ok) throw new Error('Failed to fetch user')

            const userData = await userRes.json()
            setUser(userData.user)
            toast.success('Добро пожаловать обратно 👋')
            router.replace('/workspace')
        } catch (err: any) {
            toast.error('Ошибка входа. Проверьте данные.')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (user) router.replace('/workspace')
    }, [user, router])
    const handleGoogleSignIn = async () => {

    }
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary via-primary/80 to-primary/50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white/90 shadow-xl p-8 backdrop-blur-md dark:bg-zinc-900">


                <div className="flex justify-center mb-6 ">
                    <Image src="/logo.png" alt="Lingvify Logo" className='rounded-xl' width={64} height={64}/>
                </div>

                <h2 className="text-2xl font-bold text-center text-primary/80 dark:text-primary">
                    Добро пожаловать в <span className="text-primary">Websity</span>
                </h2>
                <p className="mt-2 text-center text-sm text-gray-500">
                    Войдите в аккаунт, чтобы продолжить
                </p>

                <form className="mt-6 space-y-4" onSubmit={handleLogin}>
                    <LabelInputContainer>
                        <Label htmlFor="email">Email</Label>
                        <Input value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} type="email" id="email" placeholder="you@example.com"/>
                    </LabelInputContainer>

                    <LabelInputContainer>
                        <Label htmlFor="password">Пароль</Label>
                        <Input value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} type="password" id="password" placeholder="••••••••"/>
                    </LabelInputContainer>

                    <button
                        className="relative flex h-10 w-full items-center justify-center rounded-lg bg-primary  text-white font-medium shadow-md transition hover:opacity-90"
                        type="submit"
                    >
                        {isLoading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin"/>}
                        Войти →
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-500">
                    Нет аккаунта? <Link href="/sign-up" className="text-primary hover:underline">Зарегистрироваться</Link>
                </p>

                <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent"/>


                <div className="flex flex-col space-y-3">
                    <GoogleButton/>
                </div>
            </div>
        </div>
    );
}


const SocialButton = ({icon, text, handleProvider}: {icon: React.ReactNode, text: string, handleProvider:any}) => (
    <button onClick={handleProvider}
            className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 dark:bg-zinc-800 dark:text-gray-200"
            type="button"
    >
        {icon} {text}
    </button>
)

const LabelInputContainer = ({children, className}: {children: React.ReactNode, className?: string}) => (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
        {children}
    </div>
)
export default SignIn