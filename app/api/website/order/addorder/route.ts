import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { sendOrderConfirmationEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const body = await req.json() as any;
    const data = await prismadb.order.create({
      data: body,
    });

    try {
      const user = await prismadb.user.findUnique({ where: { id: body.userId } });
      if (user) {
        await sendOrderConfirmationEmail({
          to: user.email,
          name: user.name,
          orderId: data.id,
          products: body.products,
          total: body.total,
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
