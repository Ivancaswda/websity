
import React from 'react'

import {Button} from "@/components/ui/button";

import Navbar from "@/app/_components/Navbar";
import Link from "next/link";
import Hero from "@/app/_components/Hero";
import Servet from "@/app/_components/Servet";

const HomePage = () => {


    return (
        <div >
            <Servet/>
            <Navbar/>
            <Hero/>
            <div className='flex items-center justify-center w-full'>
                <Button >
                    <Link href='/workspace'>
                        Начать сейчас
                    </Link>

                </Button>
            </div>


        </div>
    )
}
export default HomePage
