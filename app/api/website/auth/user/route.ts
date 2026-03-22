import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";

export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization");
  const headerToken = authHeader?.replace("Bearer ", "");
  const cookieStore = cookies();
  const cookieToken = cookieStore.get("token");
  const token = headerToken || cookieToken?.value;

  if (!token) {
    return new NextResponse("Unauthorized User", { status: 200 });
  }
  try {
    const data = verify(token, process.env.SECRET_KEY || "");
    return new NextResponse(JSON.stringify({ message: "Verified User", user: data }));
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
