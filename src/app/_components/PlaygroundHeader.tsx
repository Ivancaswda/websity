import React, {useEffect} from 'react'
import Image from 'next/image'
import {Button} from "@/components/ui/button";
import {FaSave} from "react-icons/fa";
import {useOnSaveData} from "@/context/OnSaveProvider";
import Link from 'next/link'
const PlaygroundHeader = () => {
    const {onSaveData, setOnSaveData} = useOnSaveData();





    return (
        <div className='px-4 py-2 flex items-center justify-between'>
            <Link href='/workspace'>
                <Image src='/logo.png' alt='logo' width={40} height={30}/>
            </Link>

            <Button onClick={() => setOnSaveData(Date.now())}>
                <FaSave/>
                Сохранить
            </Button>
        </div>
    )
}
export default PlaygroundHeader
