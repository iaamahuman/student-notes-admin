import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

interface AddProductBody {
  product_name: string;
  product_description?: string;
  price: number;
  quantity: number;
  image?: string;
  category: string;
  featured?: boolean;
  visible?: boolean;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AddProductBody;
    const {
      product_name,
      product_description,
      price,
      quantity,
      image,
      category,
      featured,
      visible,
    } = body;

    const newProduct = await prismadb.product.create({
      data: {
        product_name,
        product_description,
        price,
        quantity,
        image,
        category,
        featured,
        visible,
      },
    });

    return NextResponse.json(newProduct);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
