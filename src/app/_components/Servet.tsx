'use server'
import React from 'react'
import getServerUser from "@/lib/auth-server";

const Servet = async () => {
    const user = await getServerUser()
    console.log('user===')
    console.log(user)
    return (
        <div>Servet</div>
    )
}
export default Servet
