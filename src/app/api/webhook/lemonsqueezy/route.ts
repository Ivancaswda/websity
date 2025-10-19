import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db";
import { usersTable } from "@/config/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
    const token = req.headers.get("x-webhook-token");
    if (token !== process.env.LEMONSQUEEZY_WEBHOOK_TOKEN) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
            event?.data?.attributes?.first_order_item?.product_id ||
            event?.data?.attributes?.order_items?.[0]?.product_id;

        if (!email || !eventName || !productId) {
            return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
        }

        if ((eventName === "order_created" || eventName === "order_paid") && status === "paid") {
            const productCreditMap: Record<string, number> = {
                "12345": 5,
                "12346": 10,
                "12347": 15,
                "12348": 20,
            };

            const creditsToAdd = productCreditMap[productId];

            if (creditsToAdd) {
                await db.update(usersTable)
                    .set({ credits: sql`${usersTable.credits} + ${creditsToAdd}` })
                    .where(eq(usersTable.email, email))
                    .execute();
                console.log(`✅ Добавлено ${creditsToAdd} кредитов пользователю ${email}`);
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
