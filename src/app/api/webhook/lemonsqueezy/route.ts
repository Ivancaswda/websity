import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db";
import { usersTable } from "@/config/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(req: NextRequest) {


    let event;
    try {
        event = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    try {
        const email = event?.data?.attributes?.user_email;
        const status = event?.data?.attributes?.status;
        const eventName = event?.meta?.event_name;
        const productId =
            String(
                event?.data?.attributes?.first_order_item?.product_id ||
                event?.data?.attributes?.order_items?.[0]?.product_id
            );

        if (!email || !eventName || !productId) {
            return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
        }
        console.log('productId===')
        console.log(productId)
        console.log('EventName===')
        console.log(eventName)
        console.log('status===')
        console.log(status)

        if ((eventName === "order_created" || eventName === "order_paid") && status === "paid") {
            const productCreditMap: Record<string, number> = {
                "666670": 5,
                "666661": 10,
                "666673": 15,
                "666675": 20,
            };
            console.log('productCreditMap===')
            console.log(productCreditMap)

            const creditsToAdd = productCreditMap[productId];
            console.log('creditsToaDD==')
            console.log(creditsToAdd)
            if (creditsToAdd) {
                const user = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
                if (!user[0]) {
                    console.warn(`Пользователь с email ${email} не найден`);
                } else {
                    const newCredits = (user[0].credits || 0) + creditsToAdd;
                    await db.update(usersTable)
                        .set({ credits: newCredits })
                        .where(eq(usersTable.email, email))
                        .execute();
                    console.log(`✅ Добавлено ${creditsToAdd} кредитов пользователю ${email}, теперь у него ${newCredits}`);
                }
            } else {
                console.warn(`⚠️ Неизвестный product_id: ${productId}`);
            }
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Webhook error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
