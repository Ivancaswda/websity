'use client'
import React from 'react'
import {SidebarTrigger} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Link from "next/link";
import {LogOutIcon, UserIcon} from "lucide-react";
import {useAuth} from "@/context/useAuth";

const WorkspaceHeader = () => {
    const {user, logout, loading} = useAuth()
    return (
        <div className='flex items-center  justify-between p-4 shadow-sm '>
            <SidebarTrigger />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">

                        <Avatar>
                            <AvatarImage src={user?.avatarUrl}/>
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
                        <Link href="/profile" className="flex items-center gap-2">
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
        </div>
    )
}
export default WorkspaceHeader
