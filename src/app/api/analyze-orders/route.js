import { NextResponse } from "next/server";
import moment from "moment";
import { connection } from "../../../app/utils/db";
import orderModel from "../../../app/models/orderModel";

export async function GET() {
  try {
    await connection();

    const orders = await orderModel.find();

    // Basic stats
    const totalOrders = orders.length;
    const rtoOrders = orders.filter((order) => order.status === "RTO").length;
    const completedOrders = orders.filter(
      (order) => order.status === "Completed"
    ).length;
    const pendingOrders = orders.filter(
      (order) => order.status === "Pending"
    ).length;

    // Monthly breakdown
    const monthlyData = Array(12)
      .fill(0)
      .map((_, index) => {
        const monthOrders = orders.filter((order) => {
          const orderDate = moment(order.orderDate);
          return (
            orderDate.month() === index && orderDate.year() === moment().year()
          );
        });

        return {
          month: moment().month(index).format("MMM"),
          total: monthOrders.length,
          completed: monthOrders.filter((order) => order.status === "Completed")
            .length,
          rto: monthOrders.filter((order) => order.status === "RTO").length,
          pending: monthOrders.filter((order) => order.status === "Pending")
            .length,
        };
      });

    // Calculate growth rates
    const monthlyGrowth = monthlyData.map((month, index) => {
      if (index === 0) return { month: month.month, growth: 0 };
      const previousMonth = monthlyData[index - 1].total;
      const currentMonth = month.total;
      const growth =
        previousMonth === 0
          ? 0
          : ((currentMonth - previousMonth) / previousMonth) * 100;
      return { month: month.month, growth };
    });

    return NextResponse.json({
      totalOrders,
      rtoOrders,
      completedOrders,
      pendingOrders,
      monthlyData,
      monthlyGrowth,
      message: "Order analytics fetched successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch order analytics", details: error.message },
      { status: 500 }
    );
  }
}
