'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/context/useAuth'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { LogOutIcon, UserIcon } from 'lucide-react'

const Navbar = () => {
    const { user, logout } = useAuth()

    return (
        <nav className="border-b bg-sidebar/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">


                <Link href="/" className="flex items-center gap-2">
                    <Image src="/logo.png" alt="Buildify" className='rounded-lg' width={48} height={48} />
                    <span className="font-bold text-lg text-primary ">Websity</span>
                </Link>

                {/* --- NAVIGATION --- */}
                <div className="hidden md:flex items-center gap-6">
                    <Link href="/workspace" className="text-sm text-muted-foreground hover:text-foreground transition">
                        Рабочая панель
                    </Link>
                    <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground transition">
                        Профиль
                    </Link>
                    <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition">
                        Цены
                    </Link>
                </div>


                <div className="flex items-center gap-2">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <Image
                                        src={user.avatarUrl || '/default-avatar.png'}
                                        alt={user?.userName}
                                        width={32}
                                        height={32}
                                        className="rounded-full"
                                    />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{user.userName}</span>
                                        <span className="text-xs text-muted-foreground">{user.email}</span>
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
                    ) : (
                        <Link href="/sign-in">
                            <Button variant="outline">Войти</Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
