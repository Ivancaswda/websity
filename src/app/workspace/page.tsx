'use client'
import React, {useEffect} from 'react'
import HomePage from "@/app/page";
import Hero from "@/app/_components/Hero";
import {useAuth} from "@/context/useAuth";
import {useRouter} from "next/navigation";

const Workspace = () => {
    const {user, loading} = useAuth()
    const router = useRouter()
    useEffect(() => {
        if (!user && !loading) {
            router.push('/sign-up')
        }
    }, [user, loading]);
    return (
        <div>
            <Hero/>
        </div>
    )
}
export default Workspace
