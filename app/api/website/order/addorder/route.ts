import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { Prisma } from "@prisma/client";
import nodemailer from "nodemailer";
import { orderConfirmationTemplate } from "@/helper/EmailTemplate";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const body = await req.json() as any;
    const data = await prismadb.order.create({
      data: body,
    });

    try {
      const user = await prismadb.user.findUnique({ where: { id: body.userId } });
      if (user) {
        await transporter.sendMail({
          from: `Student Note Books <${process.env.NODEMAILER_USER}>`,
          to: user.email,
          subject: "Order Confirmed - Student Note Books",
          html: orderConfirmationTemplate(user.name, data.id, body.products, body.total),
        });
      }
    } catch (emailError) {
      console.log("Email error:", emailError);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
