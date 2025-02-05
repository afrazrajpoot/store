import React from 'react';

export const CustomerEmail = ({
    customerDetails,
    items,
    totalPrice,
    paymentMethod
}) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            /* Base styles */
            body { 
                font-family: 'Arial', sans-serif; 
                line-height: 1.6; 
                color: #333; 
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
            .container { 
                background-color: white; 
                box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
                border-radius: 8px; 
                overflow: hidden;
                max-width: 600px;
                margin: 20px auto;
            }
            .header { 
                background: linear-gradient(135deg, #2ecc71, #27ae60);
                color: white; 
                text-align: center; 
                padding: 25px 20px; 
            }
            .header h1 { 
                margin: 0; 
                font-size: 24px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .content { 
                padding: 20px; 
            }
            .order-details {
                background-color: #f9f9f9; 
                border-radius: 8px; 
                padding: 20px;
                margin-bottom: 20px;
            }
            /* Mobile-responsive table styles */
            .products-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }
            .products-table th, 
            .products-table td {
                padding: 12px;
                text-align: left;
            }
            .products-table th {
                background-color: #f2f2f2;
                font-weight: bold;
            }
            /* Mobile-specific table styles */
            @media screen and (max-width: 600px) {
                .products-table, 
                .products-table tbody, 
                .products-table tr, 
                .products-table td, 
                .products-table th {
                    display: block;
                }
                .products-table tr {
                    margin-bottom: 20px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    overflow: hidden;
                }
                .products-table td {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 15px;
                    border-bottom: 1px solid #eee;
                }
                .products-table td:before {
                    content: attr(data-label);
                    font-weight: bold;
                    margin-right: 10px;
                }
                .products-table thead {
                    display: none;
                }
            }
            .customer-info {
                display: grid;
                grid-template-columns: 1fr;
                gap: 20px;
            }
            @media screen and (min-width: 600px) {
                .customer-info {
                    grid-template-columns: 1fr 1fr;
                }
            }
            .info-box {
                background-color: white;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }
            .thank-you {
                color: #2ecc71;
                font-weight: bold;
                text-align: center;
                margin: 20px 0;
                font-size: 20px;
            }
            .footer {
                background-color: #e8f5e9;
                text-align: center;
                padding: 20px;
                font-size: 14px;
                color: #666;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Order Confirmation</h1>
            </div>
            
            <div class="content">
                <div class="thank-you">
                    Thank You for Your Purchase, ${customerDetails.name}!
                </div>

                <div class="order-details">
                    <h2>Order Summary</h2>
                    <table class="products-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Size</th>
                                <th>Color</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${items.map(item => `
                                <tr>
                                    <td data-label="Product">${item.name}</td>
                                    <td data-label="Size">${item.size}</td>
                                    <td data-label="Color">${item.color}</td>
                                    <td data-label="Quantity">${item.quantity}</td>
                                    <td data-label="Price">PKR${item.price.toFixed(2)}</td>
                                    <td data-label="Total">PKR${(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <div class="customer-info">
                        <div class="info-box">
                            <h3>Payment Details</h3>
                            <p><strong>Total Amount:</strong> PKR${totalPrice.toFixed(2)}</p>
                            <p><strong>Payment Method:</strong> ${paymentMethod}</p>
                        </div>
                        
                        <div class="info-box">
                            <h3>Shipping Information</h3>
                            <p><strong>Name:</strong> ${customerDetails.name}</p>
                            <p><strong>Shipping Address:</strong><br>
                                ${customerDetails.address}<br>
                                ${customerDetails.city}, ${customerDetails.postalCode}<br>
                                ${customerDetails.country}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="footer">
                <p>Questions? Contact our customer support at support@yourcompany.com</p>
                <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

export default CustomerEmail;