import orderModel from "../../../app/models/orderModel";
import { connection } from "../../../app/utils/db";
import { sendOrderEmails } from "../../../utils/sendAdminMail";

import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Connect to the database
    await connection();

    // Parse incoming request body
    const orderData = await request.json();

    // Validate order data
    if (!orderData || !orderData.items || orderData.items.length === 0) {
      return NextResponse.json(
        { error: "Invalid order data" },
        { status: 400 }
      );
    }

    // Create new order
    const newOrder = new orderModel({
      customerDetails: orderData.customerDetails,
      items: orderData.items,
      totalPrice: orderData.totalPrice,
      paymentMethod: orderData.paymentMethod || "Cash on Delivery (COD)",
      orderDate: new Date(),
      status: "Pending",
    });

    // Save order to database
    const savedOrder = await newOrder.save();

    const customerDetails = orderData.customerDetails;

    const items = orderData.items;
    // customerDetails,items,totalPrice,paymentMethod
    await sendOrderEmails({
      customerDetails,
      items,
      totalPrice: orderData.totalPrice,
      paymentMethod: orderData.paymentMethod,
    });
    // Return success response
    return NextResponse.json(
      {
        message: "Order placed successfully",
        orderId: savedOrder._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit order", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    // Connect to the database
    await connection();

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1; // Default to page 1
    const limit = 5; // Fixed 5 products per page

    // Validate page
    if (isNaN(page) || page < 1) {
      return NextResponse.json(
        { error: "Invalid page number. Page must be a positive integer." },
        { status: 400 }
      );
    }

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch orders with pagination
    const orders = await orderModel.find().skip(skip).limit(limit);

    // Get the total number of orders for pagination metadata
    const totalOrders = await orderModel.countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(totalOrders / limit);

    // Return the orders along with pagination metadata
    return NextResponse.json(
      {
        success: true,
        data: orders,
        pagination: {
          page,
          limit,
          totalOrders,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Error fetching orders", details: error.message },
      { status: 500 }
    );
  }
}
