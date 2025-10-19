import {NextRequest, NextResponse} from "next/server";
import getServerUser from "@/lib/auth-server";
import {chatTable, frameTable, projectTable} from "@/config/schema";
import db from "@/config/db";
import {desc, eq, inArray} from "drizzle-orm";

export async function GET(req: NextRequest) {
    const user = await getServerUser();

    const projects = await db.select().from(projectTable)
        .where(eq(projectTable.createdBy, user?.email))
        .orderBy(desc(projectTable.id))

    let results: {
        projectId: string;
        frameId: string;
        chats: { id: number, chatMessage:any; createdBy: string; createdOn: any}
    }[] = [];


    for (const project of projects) {
        const frames = await db.select({frameId: frameTable.frameId})
            .from(frameTable).where(eq(frameTable.projectId, project.projectId));


        const frameIds = frames.map((f:any) => f.frameId);
        let chats: any[] = [];
        if (frameIds.length > 0) {
            chats = await db.select().from(chatTable).where(inArray(chatTable.frameId, frameIds))
        }

        for (const frame of frames) {
            results.push({
                projectId: project.projectId ?? '',
                frameId: frame?.frameId ?? '',
                chats: chats.filter((c) => c.frameId === frame.frameId)
            });
        }
    }
    return NextResponse.json(results)
}