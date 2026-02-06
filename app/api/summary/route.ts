import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { Summary } from "@/models/summary.model";
import { connectDB } from "@/lib/db";
import "@/models/pdf.model";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();

    const summaries = await Summary.find({ userId: session.user?.id })
      .select("pdfId -_id")
      .populate("pdfId", "title")
      .limit(10);

    const formatted = summaries.map((item: any) => ({
      id: item.pdfId._id.toString(),
      title: item.pdfId.title
    }));

    return NextResponse.json(formatted);

  } catch (err: unknown) {
    console.error("Summary Error", err);
    return NextResponse.json(
      { message: "Internal Server error", error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const pdfId = searchParams.get("pdfId");

    if (!pdfId) {
      return NextResponse.json({ message: "PDF ID is required." }, { status: 400 });
    }

    await connectDB();

    await Summary.findOneAndDelete({ pdfId });

    return NextResponse.json({ success: true });

  } catch (err: unknown) {
    console.error("Summary Error", err);
    return NextResponse.json(
      { message: "Internal Server error", error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}