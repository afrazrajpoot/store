import Product from "../../../app/models/productModal";
import { connection } from "../../../app/utils/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connection();
    const products = await Product.find({
      stock: {
        $elemMatch: {
          quantity: 0,
        },
      },
    });
    //   console.log(products,'products')
    return NextResponse.json(products);
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}
