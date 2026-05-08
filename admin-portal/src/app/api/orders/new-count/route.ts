import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const since = searchParams.get('since');

  try {
    const whereClause: any = {
      status: 'PAID'
    };

    if (since) {
      whereClause.createdAt = {
        gt: new Date(since)
      };
    }

    const count = await prisma.order.count({
      where: whereClause
    });

    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json({ count: 0 });
  }
}
