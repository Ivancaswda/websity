import {NextRequest, NextResponse} from "next/server";
import db from "@/config/db";
import {chatTable, frameTable, projectTable} from "@/config/schema";
import getServerUser from "@/lib/auth-server";
export async function POST(req: NextRequest) {
    const {projectId, frameId, messages} = await req.json()

    const user = await getServerUser()

    const projectResult = await db.insert(projectTable).values({
        projectId: projectId,
        createdBy: user?.email
    })

    const frameResult = await db.insert(frameTable).values({
        frameId: frameId,
        projectId:projectId
    })

    const chatResult = await db.insert(chatTable).values({
        createdBy: user?.email,
        chatMessages: messages,
        frameId: frameId
    })

    return NextResponse.json({
        projectId, frameId, messages
    })
}