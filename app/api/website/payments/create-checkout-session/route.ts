import { NextResponse } from "next/server";
import crypto from "crypto";

interface CreateCheckoutSessionBody {
  amount: number;
  orderData: any;
  customerEmail?: string;
  customerName?: string;
}

export async function POST(req: Request) {
  try {
    const { amount, orderData, customerEmail, customerName } =
      (await req.json()) as CreateCheckoutSessionBody;

    const key = process.env.PAYU_KEY || "";
    const salt = process.env.PAYU_SALT || "";
    const txnid = `TXN${Date.now()}`;
    const productinfo = "Student Note Books Order";
    const firstname = customerName || "Customer";
    const email = customerEmail || "";
    const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3000";
    const successUrl = `${baseUrl}/api/payment/success`;
	const failureUrl = `${baseUrl}/api/payment/cancel`;

    const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");

    const payuUrl = "https://test.payu.in/_payment";

    const formData = {
      key,
      txnid,
      amount: amount.toString(),
      productinfo,
      firstname,
      email,
      phone: "9999999999",
      surl: successUrl,
      furl: failureUrl,
      hash,
      orderData: JSON.stringify(orderData),
    };

    return NextResponse.json({ formData, url: payuUrl }, { status: 200 });
  } catch (error: any) {
    console.error("Error creating PayU checkout session:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
