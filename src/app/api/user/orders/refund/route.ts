import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
    }

    const { orderId, reason } = await req.json();
    const userId = (session.user as any).id;

    // 해당 주문이 본인의 주문인지 확인
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order || order.userId !== userId) {
      return NextResponse.json({ message: "주문을 찾을 수 없거나 권한이 없습니다." }, { status: 404 });
    }

    // 환불 요청 상태로 업데이트
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "REFUND_REQUESTED",
        refundReason: reason
      }
    });

    return NextResponse.json({ message: "환불 요청이 접수되었습니다.", order: updatedOrder });
  } catch (error) {
    console.error("Refund request error:", error);
    return NextResponse.json({ message: "환불 요청 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
