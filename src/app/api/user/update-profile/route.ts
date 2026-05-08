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

    const { name, email, phone, address } = await req.json();
    const userId = (session.user as any).id;

    // Check if email is already taken by another user
    if (email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
      if (existingUser) {
        return NextResponse.json({ message: "이미 사용 중인 이메일입니다." }, { status: 400 });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        phone,
        address
      }
    });

    return NextResponse.json({ message: "수정 성공", user: updatedUser });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
