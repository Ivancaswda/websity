'use client'

import React from 'react'
import { SidebarProvider } from "@/components/ui/sidebar"
import WorkspaceSidebar from "@/app/_components/WorkspaceSidebar"
import WorkspaceHeader from "@/app/_components/WorkspaceHeader"
import Footer from "@/app/_components/Footer";

const WorkspaceLayout = ({ children }: any) => {
    return (
        <SidebarProvider>
            <div className="flex w-screen h-screen overflow-hidden">

                <WorkspaceSidebar />


                <main
                    className="
            flex flex-col flex-1 transition-all duration-300
            data-[state=open]:ml-[var(--sidebar-width)]
          "
                >
                    <WorkspaceHeader />
                    <div className="flex-1 overflow-y-auto">{children}</div>

                </main>
            </div>
        </SidebarProvider>
    )
}

export default WorkspaceLayout
