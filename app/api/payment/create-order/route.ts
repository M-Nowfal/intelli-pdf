import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PRO_ACCESS_AMOUNT, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from "@/utils/constants";

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const amount = PRO_ACCESS_AMOUNT * 100; 

    const order = await razorpay.orders.create({
      amount: amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({ orderId: order.id, amount: order.amount });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create order kindly contact the developer.", message: "Internal Server Errro." }, 
      { status: 500 }
    );
  }
}