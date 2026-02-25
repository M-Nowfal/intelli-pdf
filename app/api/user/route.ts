import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { User } from "@/models/user.model";
import { connectDB } from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";
import { getPublicIdFromUrl } from "@/helpers/cloudinary.helper";
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from "@/utils/constants";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await User.findById(session.user.id, "provider avatar -_id");

    return NextResponse.json(user);

  } catch (err: unknown) {
    console.error("User fetch Error", err);
    return NextResponse.json(
      { message: "Internal Server error", error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, avatar } = await req.json();

    if (!name || name.trim().length < 3) {
      return NextResponse.json({ message: "Name is Required" }, { status: 400 });
    }

    await connectDB();

    const currentUser = await User.findById(session.user.id);
    if (!currentUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const shouldDeleteOldImage = 
      (avatar === null && currentUser.avatar) || 
      (avatar && currentUser.avatar && currentUser.avatar !== avatar);

    if (shouldDeleteOldImage) {
      if (currentUser.avatar.includes("cloudinary.com")) {
        const publicId = getPublicIdFromUrl(currentUser.avatar);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
            console.log("Deleted old Cloudinary image:", publicId);
          } catch (error) {
            console.error("Failed to delete old image:", error);
          }
        }
      }
    }

    const updateData: any = { name };
    if (avatar === null) {
      updateData.$unset = { avatar: 1 };
    } else if (avatar) {
      updateData.avatar = avatar;
    }

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (err: unknown) {
    console.error("User Updation Error", err);
    return NextResponse.json(
      { message: "Internal Server error", error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}