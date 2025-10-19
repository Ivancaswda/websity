import { NextRequest, NextResponse } from "next/server"
import db from "@/config/db"
import { chatTable, frameTable } from "@/config/schema"
import {and, eq} from "drizzle-orm"

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const frameId = searchParams.get("frameId")
    const projectId = searchParams.get("projectId")

    if (!frameId) {
        return NextResponse.json({ error: "frameId is required" }, { status: 400 })
    }

    try {

        const frameResult = await db
            .select()
            .from(frameTable)
            .where(eq(frameTable.frameId, frameId))


        const chatResult = await db
            .select()
            .from(chatTable)
            .where(eq(chatTable.frameId, frameId))
        console.log('chatResult===')
        console.log(chatResult)

        const finalResult = {
            ...frameResult[0],
            chatMessages: chatResult[0]?.chatMessages ?? [],
        }

        return NextResponse.json(finalResult)
    } catch (error) {
        console.error("DB query failed:", error)
        return NextResponse.json({ error: "Failed to fetch frame" }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    const {designCode, frameId, projectId} = await req.json();

    const result = await db.update(frameTable).set({
        designCode: designCode
    }).where(and(eq(frameTable.frameId, frameId), eq(frameTable.projectId, projectId)))

    return NextResponse.json({result: 'updated!'})
}
