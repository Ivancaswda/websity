// app/api/image-upload/route.ts
import { NextResponse } from "next/server";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLICKEY!,
    privateKey: process.env.IMAGEKIT_PRIVATEKEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URLENDPOINT!,
});

export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get("file") as Blob;

    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    try {
        const result = await imagekit.upload({
            file,
            fileName: `uploaded-${Date.now()}.png`,
        });

        return NextResponse.json({ url: result.url });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
