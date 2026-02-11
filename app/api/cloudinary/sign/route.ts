import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from "@/utils/constants";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const timestamp = Math.round((new Date).getTime() / 1000);

    const paramsToSign = {
      timestamp,
      folder: "avatars",
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      CLOUDINARY_API_SECRET
    );

    return NextResponse.json({
      signature,
      timestamp,
      apiKey: CLOUDINARY_API_KEY,
      folder: "avatars",
      cloudName: CLOUDINARY_CLOUD_NAME
    });

  } catch (err: unknown) {
    console.error("Signing Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}