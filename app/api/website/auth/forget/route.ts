import crypto from "crypto";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { sendPasswordResetEmail } from "@/lib/mail";

interface ForgetPasswordBody {
  email: string;
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json() as ForgetPasswordBody;
    const user = await prismadb.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      return new NextResponse("User Not Found!", { status: 404 });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    const tokenExpiry = new Date(Date.now() + 2 * 60 * 60 * 1000);

    const findToken = await prismadb.resetToken.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!findToken) {
      await prismadb.resetToken.create({
        data: {
          userId: user.id,
          token: resetToken,
          expiresAt: tokenExpiry,
        },
      });
    } else {
      await prismadb.resetToken.delete({
        where: {
          id: findToken.id,
        },
      });
      await prismadb.resetToken.create({
        data: {
          userId: user.id,
          token: resetToken,
          expiresAt: tokenExpiry,
        },
      });
    }

    await sendPasswordResetEmail({
      app: "website",
      to: email,
      name: user.name,
      resetToken,
    });
    return new NextResponse("Password Reset Email Sent", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Email Sending Failed", { status: 500 });
  }
}
