import nodemailer from "nodemailer";
import { welcomeEmailTemplate } from "@/helper/EmailTemplate";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { getCookieString } from "@/lib/cookie-helper";
import { Prisma } from "@prisma/client";
var bcrypt = require("bcryptjs");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

interface RegisterBody {
  email: string;
  password: string;
  name: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as RegisterBody;
    const { email, password, name } = body;
    
    const user = await prismadb.user.findUnique({
      where: { email },
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!user) {
      const newUser = await prismadb.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });
      const token = jwt.sign(
        { userId: newUser.id, name: newUser.name, email: newUser.email },
        process.env.SECRET_KEY || "",
        {
          expiresIn: "24h",
        }
      );
      const response = new NextResponse(
        JSON.stringify({
          message: "Successfully Account Created",
          id: newUser.id,
          token,
        })
      );

      response.headers.set("Set-Cookie", getCookieString("token", token));
	  try {
  await transporter.sendMail({
    from: `Student Note Books <${process.env.NODEMAILER_USER}>`,
    to: email,
    subject: "Welcome to Student Note Books!",
    html: welcomeEmailTemplate(name),
  });
} catch (emailError) {
  console.log("Welcome email error:", emailError);
}
      return response;
    } else {
      return new NextResponse("User Already Exists", { status: 403 });
    }
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
