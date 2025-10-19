'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/useAuth'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import {ArrowLeft, Loader2Icon} from 'lucide-react'
import { toast } from 'sonner'
import {useRouter} from "next/navigation";
import Footer from "@/app/_components/Footer";

type ProjectStat = {
    projectId: string
    frameId: string
    chats: {
        id: number
        chatMessage: any
        createdBy: string
        createdOn: string
    }[]
}

const ProfilePage = () => {
    const { user, loading } = useAuth()
    const [dataLoading, setDataLoading] = useState(true)
    const [data, setData] = useState<ProjectStat[]>([])
    const [totalProjects, setTotalProjects] = useState(0)
    const [totalChats, setTotalChats] = useState(0)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('/api/get-all-projects')
                setData(res.data)

                const projectsCount = new Set(res.data.map((p: any) => p.projectId)).size
                const chatCount = res.data.reduce((acc: number, cur: any) => acc + cur.chats.length, 0)

                setTotalProjects(projectsCount)
                setTotalChats(chatCount)
            } catch (err: any) {
                toast.error('Ошибка при загрузке профиля')
                console.error(err)
            } finally {
                setDataLoading(false)
            }
        }
        fetchStats()
    }, [])
    const router = useRouter()
    const chartData = [
        { name: 'Проекты', value: totalProjects },
        { name: 'Сообщения', value: totalChats },
        { name: 'Звёзды', value: user?.credits || 0 },
    ]
    useEffect(() => {
        if (!user && !loading) {
            router.push('/sign-up')
        }
    }, [user, loading]);

    if (dataLoading)
        return (
            <div className="flex  justify-center items-center h-screen w-screen">
                <Loader2Icon className="animate-spin w-8 h-8 text-primary" />
            </div>
        )

    return (
        <>
            <div className="max-w-5xl mx-auto py-16 px-6 space-y-8">

                <Card className="shadow-lg border border-border/40">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <ArrowLeft className='hover:bg-gray-100 rounded-full ' onClick={() => router.replace('/workspace')}/>
                        <Avatar className="w-[40px] h-[40px]">
                            <AvatarImage src={user?.avatarUrl } />
                            <AvatarFallback className="bg-primary text-white text-xl">
                                {user?.userName?.[0]?.toUpperCase() }
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-2xl">{user?.userName}</CardTitle>
                            <p className="text-muted-foreground text-sm">{user?.email}</p>
                        </div>
                        <div className="ml-auto text-center">
                            <p className="text-sm text-muted-foreground">Ваши звёзды</p>
                            <p className="text-2xl font-bold text-primary">{user?.credits}</p>
                        </div>
                    </CardHeader>
                </Card>


                <Card className="shadow-md border mt-4 border-border/40">
                    <CardHeader>
                        <CardTitle>Статистика</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="brown" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>


                <Card className="shadow-md border mt-4 border-border/40">
                    <CardHeader>
                        <CardTitle>Ваши проекты ({totalProjects})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {data.length === 0 ? (
                            <p className="text-center text-muted-foreground py-4">У вас пока нет проектов</p>
                        ) : (
                            data.map((project, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">Проект ID: {project.projectId}</p>
                                            <p className="text-sm text-muted-foreground">Фреймов: {project.chats.length}</p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => (window.location.href = `/playground/${project.projectId}?frameId=${project.frameId}`)}
                                        >
                                            Открыть
                                        </Button>
                                    </div>
                                    {index < data.length - 1 && <Separator className="my-2" />}
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

            </div>
            <Footer/>
        </>

    )
}

export default ProfilePage
