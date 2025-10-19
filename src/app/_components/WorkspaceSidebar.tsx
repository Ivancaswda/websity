'use client'
import React, {useEffect, useState} from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from "@/components/ui/sidebar"
import Image from 'next/image'
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import {ArrowUpRightIcon, LogOutIcon, UserIcon} from "lucide-react";
import {FaCrow, FaCrown, FaFolder} from "react-icons/fa";
import {useAuth} from "@/context/useAuth";
import {Progress} from "@/components/ui/progress";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {useRouter} from "next/navigation";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import axios from "axios";
import {toast} from "sonner";
import {Skeleton} from "@/components/ui/skeleton";

const WorkspaceSidebar = () => {
    const [projectList, setProjectList] = useState<any>([])
    const {user, logout, loading} = useAuth()
    const router = useRouter()
    const [skeletonLoading, setSkeletonLoading] = useState<boolean>(false)
    console.log(user)
    useEffect(() => {
        if (!user && !loading) {
            router.push('/sign-up')
        }
    }, [user, loading]);

    useEffect(() => {
        user && getProjectList()
    }, [user]);

    const getProjectList = async () => {
        try {
            setSkeletonLoading(true)
            const result = await axios.get('/api/get-all-projects')
            console.log(result.data)
            setProjectList(result.data)
        }catch (error) {
            setSkeletonLoading(false)
                toast.error('Не удалось найти проекты')
        }
        setSkeletonLoading(false)

    }

    return (
        <Sidebar >
            <SidebarHeader className='p-5' >

                <div className='flex items-center gap-2'>
                    <Image src='/logo.png' alt='websity' width={42} height={35}/>

                </div>
                <Link href='/workspace'>
                    <Button className='w-full'>
                        + Добавить проект
                    </Button>
                </Link>

            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    {skeletonLoading ? (

                        [1, 2, 3, 4, 5].map((_, index) => (
                            <Skeleton key={index} className='h-10 w-full rounded-lg mt-2' />
                        ))
                    ) : projectList?.length === 0 ? (

                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <FaFolder />
                                </EmptyMedia>
                                <EmptyTitle>Нет проектов</EmptyTitle>
                            </EmptyHeader>
                            <EmptyContent>
                                <div className="flex gap-2 flex-col">
                                    <Button>Создать проект</Button>
                                </div>
                            </EmptyContent>
                        </Empty>
                    ) : (

                        projectList.map((item: any, index: number) => (
                            <Link
                                key={item.projectId || index}
                                href={`/playground/${item.projectId}?frameId=${item.frameId}`}
                                className='my-2 hover:bg-gray-100  transition-all p-2 rounded-lg cursor-pointer block'
                            >
                                <h2 className='line-clamp-1  '>
                                    {item?.chats?.[0]?.chatMessages?.[0]?.content || 'Без названия'}
                                </h2>
                            </Link>
                        ))
                    )}
                </SidebarGroup>


            </SidebarContent>
            <SidebarFooter >
                    <div className='p-3 border rounded-xl flex-col flex gap-4  space-y-3 bg-secondary'>
                        <h2 className='flex justify-between items-center'>Оставшийся попытки: <span>{user?.credits}</span></h2>
                        <Progress value={33}/>
                        <div className='flex items-center gap-3'>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full">

                                        <Avatar>
                                            <AvatarImage src={user?.avatar}/>
                                            <AvatarFallback className='bg-primary text-white cursor-pointer '>
                                                {user?.userName[0].toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{user?.userName}</span>
                                            <span className="text-xs text-muted-foreground">{user?.email}</span>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/account" className="flex items-center gap-2">
                                            <UserIcon size={16} /> Профиль
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => logout()}
                                        className="text-red-600 flex items-center gap-2"
                                    >
                                        <LogOutIcon size={16} /> Выйти
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Link href='/pricing' >
                                <Button className='w-full' >

                                    <FaCrown/>
                                    Обновить план
                                </Button>
                            </Link>
                        </div>

                    </div>
            </SidebarFooter>
        </Sidebar>
    )
}
export default WorkspaceSidebar
