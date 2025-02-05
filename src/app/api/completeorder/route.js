
import orderModel from '@/app/models/orderModel';
import Product from '@/app/models/productModal';
import { connection } from '@/app/utils/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        // Connect to database
        await connection();

        // Parse the request body
        const { items, orderId, rto, complete } = await request.json();
        console.log(items, 'items');
        console.log(orderId, 'orderId');
        console.log(rto, 'rto');
        console.log(complete, 'complete');

        // Validate items array if it exists
        if (items && !Array.isArray(items)) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Items must be an array'
                },
                { status: 400 }
            );
        }

        // If orderId is provided, find and update the order
        if (orderId) {
            const order = await orderModel.findById(orderId);

            if (!order) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `Order not found with ID: ${orderId}`
                    },
                    { status: 404 }
                );
            }

            // Update the rto field if provided
            if (rto !== undefined) {
                order.status = 'RTO';
            }

            // Update the complete field if provided
            if (complete !== undefined) {
                order.status = 'Completed';
            }

            // Save the updated order
            await order.save();
        }

        // If items are provided, process each item in the order
        if (items) {
            for (const item of items) {
                const product = await Product.findById(item.productId);

                if (!product) {
                    return NextResponse.json(
                        {
                            success: false,
                            message: `Product not found with ID: ${item.productId}`
                        },
                        { status: 404 }
                    );
                }

                // Find the matching stock item based on size and color
                const stockItem = product.stock.find(
                    stock => stock.size === item.size
                );

                if (!stockItem) {
                    return NextResponse.json(
                        {
                            success: false,
                            message: `Stock not found for product ${item.name} with size ${item.size}`
                        },
                        { status: 400 }
                    );
                }

                // Check if enough stock is available
                if (stockItem.quantity < item.quantity) {
                    return NextResponse.json(
                        {
                            success: false,
                            message: `Insufficient stock for product ${item.name}. Available: ${stockItem.quantity}, Requested: ${item.quantity}`
                        },
                        { status: 400 }
                    );
                }

                // Update the stock quantity
                stockItem.quantity -= item.quantity;

                // Save the updated product
                await product.save();
            }
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Stock and order updated successfully'
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error updating stock and order:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error',
                error: error.message
            },
            { status: 500 }
        );
    }
}