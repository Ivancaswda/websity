import { NextRequest, NextResponse } from "next/server";
import getServerUser from "@/lib/auth-server";

export async function POST(req: NextRequest) {
    try {
        const { productId } = await req.json();
        const user = await getServerUser();
        const email = user?.email;

        if (!productId || !email) {
            return NextResponse.json({ error: "productId and email are required" }, { status: 400 });
        }
        console.log('productid!===')
        console.log(productId)
        console.log(email)

        const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                data: {
                    type: "checkouts",
                    attributes: {
                        checkout_data: { email },
                        custom: { user_email: email },
                    },
                    relationships: {
                        store: { data: { type: "stores", id: process.env.LEMONSQUEEZY_STORE_ID } },
                        variant: { data: { type: "variants", id: productId } },
                    },
                },
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("LemonSqueezy error:", errorData);
            return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
        }

        const data = await response.json();
        return NextResponse.json({ checkoutUrl: data?.data?.attributes?.url });
    } catch (error) {
        console.error("Checkout creation error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
