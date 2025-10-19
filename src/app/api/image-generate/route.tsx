// app/api/image/generate/route.ts
import { NextResponse } from "next/server";


const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY!;

export async function POST(req: Request) {
    const { prompt } = await req.json();

    if (!prompt) {
        return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
    }

    try {

        const res = await fetch(
            `https://api.unsplash.com/photos/random?query=${encodeURIComponent(prompt)}&client_id=${UNSPLASH_ACCESS_KEY}`
        );

        if (!res.ok) {
            return NextResponse.json({ error: "Failed to fetch image from Unsplash" }, { status: res.status });
        }

        const data = await res.json();


        const imageUrl = data.urls.regular;

        return NextResponse.json({ url: imageUrl });
    } catch (err) {
        console.error("Unsplash image generation error:", err);
        return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
    }
}
