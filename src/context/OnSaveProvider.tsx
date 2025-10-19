// context/AuthContext.tsx
'use client'
import { createContext, useContext, useEffect, useState } from "react"



export const OnSaveContext = createContext<any>({})

export const OnSaveProvider = ({ children }: { children: React.ReactNode }) => {
    const [onSaveData, setOnSaveData] = useState<any>()


    return (
        <OnSaveContext.Provider value={{onSaveData, setOnSaveData}}>
            {children}
        </OnSaveContext.Provider>
    )
}

export const useOnSaveData = () => useContext(OnSaveContext)
