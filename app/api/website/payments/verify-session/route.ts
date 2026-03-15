import { NextResponse } from "next/server";
import crypto from "crypto";

interface VerifySessionBody {
  txnid: string;
  status: string;
  hash: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as VerifySessionBody;
    const { txnid, status, hash, amount, productinfo, firstname, email } = body;

    const salt = process.env.PAYU_SALT || "";
    const key = process.env.PAYU_KEY || "";

    const hashString = `${salt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
    const calculatedHash = crypto.createHash("sha512").update(hashString).digest("hex");

    const isValid = calculatedHash === hash;

    return NextResponse.json({
      paymentStatus: status === "success" ? "paid" : "failed",
      txnid,
      isValid,
    }, { status: 200 });
  } catch (error: any) {
    console.error("Error verifying PayU session:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify session" },
      { status: 500 }
    );
  }
}
