import { NextResponse } from "next/server";

export async function POST(req: Request) {
  return NextResponse.json({ message: "Use create-checkout-session instead" }, { status: 200 });
}
