import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log("Current API Session:", session ? "Found" : "Null");

    if (!session || !session.user) {
      console.warn("Order failed: Unauthorized access attempt.");
      return NextResponse.json({ message: "인증이 필요합니다. 다시 로그인해주세요." }, { status: 401 });
    }


    const { 
      totalAmount, 
      address, 
      phone, 
      receiver, 
      items,
      paymentId,
      merchantUid
    } = await req.json();

    const userId = (session.user as any).id;
    console.log("Order Request Data:", { totalAmount, address, phone, receiver, userId, itemsCount: items.length });

    // 1. 사용자가 실제 DB에 존재하는지 확인 (외래키 제약조건 위반 방지)
    const userExists = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!userExists) {
      console.error(`Order failed: User ID ${userId} not found in database.`);
      return NextResponse.json({ message: "사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요." }, { status: 404 });
    }

    // 2. 상품 존재 여부 전수 검사
    for (const item of items) {
      const productExists = await prisma.product.findUnique({
        where: { id: item.productId }
      });
      if (!productExists) {
        console.error(`Order failed: Product ID ${item.productId} not found.`);
        return NextResponse.json({ message: `존재하지 않는 상품(ID: ${item.productId})이 포함되어 있습니다. 장바구니를 비우고 다시 시도해주세요.` }, { status: 400 });
      }
    }

    // 3. 트랜잭션으로 주문과 주문 항목을 동시에 생성
    const order = await prisma.$transaction(async (tx) => {


      // 1. 주문 생성
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          address,
          phone,
          receiver,
          paymentId: paymentId || "MOCK_PAYMENT",
          merchantUid: merchantUid || `MOCK_UID_${Date.now()}`,
          status: "PAID",
          orderItems: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });

      // 2. 재고 차감
      for (const item of items) {
        // 상품 존재 여부 확인
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        });

        if (product) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity
              }
            }
          });
          console.log(`Stock decremented for product: ${item.productId}`);
        } else {
          console.warn(`Product not found for ID: ${item.productId}. Skipping stock decrement.`);
        }
      }

      return newOrder;
    });

    return NextResponse.json({ 
      message: "주문이 성공적으로 생성되었습니다.", 
      orderId: order.id 
    });
  } catch (error: any) {
    console.error("Order creation detailed error:", error);
    return NextResponse.json({ 
      message: "서버 오류가 발생했습니다.", 
      error: error.message 
    }, { status: 500 });
  }
}

