import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, name, price, stock } = await request.json();
    const product = await prisma.product.update({
      where: { id },
      data: { 
        name, 
        price: parseInt(price),
        stock: parseInt(stock)
      }
    });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}
