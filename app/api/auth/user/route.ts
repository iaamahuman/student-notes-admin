import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

interface UserBody {
  data: {
    token: string;
  };
}

export async function POST(req: Request) {
  const body = await req.json() as UserBody;
  const { token } = body.data;
  console.log(token);
  if (!token) {
    return new NextResponse("Unauthorized User", { status: 401 });
  }
  try {
    const secret = new TextEncoder().encode(process.env.SECRET_KEY || "");
    const { payload } = await jwtVerify(token, secret);
    const response = new NextResponse(
      JSON.stringify({
        message: "Verified User",
        user: payload,
      })
    );
    return response;
  } catch (error) {
    if (error instanceof Error && error.message.includes("expired")) {
      return new NextResponse("Session Expired", { status: 401 });
    } else {
      console.log(error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }
}
