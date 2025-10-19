
import React from 'react'

import {Button} from "@/components/ui/button";

import Navbar from "@/app/_components/Navbar";
import Link from "next/link";
import Hero from "@/app/_components/Hero";
import {ArrowUp} from "lucide-react";
import Footer from "@/app/_components/Footer";


const HomePage = () => {


    return (
        <div >

            <Navbar/>
            <Hero/>
            <div className='flex items-center justify-center w-full mb-4'>
                <Button >
                    <Link className='flex items-center gap-3' href='/workspace'>
                        <ArrowUp/>
                        Начать сейчас
                    </Link>

                </Button>
            </div>
            <Footer/>

        </div>
    )
}
export default HomePage
