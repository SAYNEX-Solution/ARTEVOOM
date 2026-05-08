import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get('date'); // YYYY-MM-DD

  if (!dateStr) return NextResponse.json({ error: "Date is required" }, { status: 400 });

  try {
    const startDate = new Date(dateStr);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);

    // 매출, 판매수량, 환불건수
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate
        }
      },
      include: {
        orderItems: true
      }
    });

    const totalRevenue = orders
      .filter(o => !['CANCELLED', 'REFUNDED'].includes(o.status))
      .reduce((acc, o) => acc + o.totalAmount, 0);

    const totalQuantity = orders
      .filter(o => !['CANCELLED', 'REFUNDED'].includes(o.status))
      .reduce((acc, o) => acc + o.orderItems.reduce((sum, item) => sum + item.quantity, 0), 0);

    const refundCount = orders
      .filter(o => ['REFUND_REQUESTED', 'REFUNDED', 'CANCELLED'].includes(o.status)).length;

    // 신규 고객
    const newUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate
        }
      }
    });

    return NextResponse.json({
      revenue: totalRevenue,
      quantity: totalQuantity,
      refunds: refundCount,
      newCustomers: newUsers
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
