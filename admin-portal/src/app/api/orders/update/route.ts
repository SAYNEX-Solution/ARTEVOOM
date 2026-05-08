import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { orderId, status, carrier, trackingNumber } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json({ message: "필수 정보가 누락되었습니다." }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        carrier: carrier || null,
        trackingNumber: trackingNumber || null,
      },
    });

    return NextResponse.json({ 
      message: "주문 상태가 성공적으로 업데이트되었습니다.", 
      order: updatedOrder 
    });
  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
