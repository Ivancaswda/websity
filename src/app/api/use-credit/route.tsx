import { NextRequest, NextResponse } from "next/server";
import getServerUser from "@/lib/auth-server";
import prisma from "@/lib/prisma";
import db from "@/config/db";
import {usersTable} from "@/config/schema";
import {eq} from "drizzle-orm";

export async function POST(req: NextRequest) {
    try {
        const currentUser= await getServerUser()
        if (!currentUser) {
            console.warn(`Пользователь не авторизован`);
            return null;
        }
        const email = currentUser?.email;

        const user = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);


        if (!user[0]) {
            console.warn(`Пользователь с email ${email} не найден`);
            return null;
        }

        if ((user[0].credits || 0) <= 0) {
            console.warn(`У пользователя ${email} нет кредитов`);
            return null;
        }

        const updatedCredits = (user[0].credits || 0) - 1;

        await db.update(usersTable)
            .set({ credits: updatedCredits })
            .where(eq(usersTable.email, email))
            .execute();

        return NextResponse.json({ success: true, credits: updatedCredits });
    } catch (err) {
        console.error("❌ Error in /api/use-credit:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
