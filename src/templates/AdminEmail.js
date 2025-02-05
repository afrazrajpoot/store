export const AdminEmail = ({
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
                color: #2d3748; 
                margin: 0;
                padding: 0;
                background-color: #f7fafc;
            }
            .container { 
                background-color: white; 
                box-shadow: 0 4px 12px rgba(0,0,0,0.1); 
                border-radius: 12px; 
                overflow: hidden;
                max-width: 800px;
                margin: 20px auto;
            }
            .header { 
                background: linear-gradient(135deg, #3498db, #2980b9);
                color: white; 
                text-align: center; 
                padding: 30px 20px; 
            }
            .header h1 { 
                margin: 0; 
                font-size: 28px;
                letter-spacing: 0.5px;
                text-transform: uppercase;
            }
            .content { 
                padding: 30px; 
            }
            .order-details {
                background-color: #f8fafc; 
                border-radius: 10px; 
                padding: 25px;
                margin-bottom: 30px;
                border: 1px solid #e2e8f0;
            }
            /* Mobile-responsive table styles */
            .products-table {
                width: 100%;
                border-collapse: separate;
                border-spacing: 0;
                margin-bottom: 30px;
                border-radius: 8px;
                overflow: hidden;
            }
            .products-table th, 
            .products-table td {
                padding: 15px;
                text-align: left;
                border-bottom: 1px solid #e2e8f0;
            }
            .products-table th {
                background-color: #edf2f7;
                font-weight: 600;
                text-transform: uppercase;
                font-size: 14px;
                color: #4a5568;
            }
            .product-image {
                width: 80px;
                height: 80px;
                object-fit: cover;
                border-radius: 6px;
                border: 1px solid #e2e8f0;
            }
            /* Mobile-specific styles */
            @media screen and (max-width: 768px) {
                .products-table, 
                .products-table tbody, 
                .products-table tr, 
                .products-table td, 
                .products-table th {
                    display: block;
                }
                .products-table tr {
                    margin-bottom: 20px;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    background: white;
                }
                .products-table td {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 15px;
                    border-bottom: 1px solid #e2e8f0;
                }
                .products-table td:last-child {
                    border-bottom: none;
                }
                .products-table td:before {
                    content: attr(data-label);
                    font-weight: 600;
                    margin-right: 10px;
                }
                .products-table thead {
                    display: none;
                }
                .product-image {
                    width: 60px;
                    height: 60px;
                }
                .customer-info {
                    grid-template-columns: 1fr !important;
                }
            }
            .customer-info {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 25px;
                margin-top: 30px;
            }
            .info-box {
                background: white;
                padding: 20px;
                border-radius: 8px;
                border: 1px solid #e2e8f0;
            }
            .info-box h3 {
                margin-top: 0;
                color: #2d3748;
                font-size: 18px;
                border-bottom: 2px solid #3498db;
                padding-bottom: 10px;
                margin-bottom: 15px;
            }
            .footer {
                background-color: #f8fafc;
                text-align: center;
                padding: 20px;
                font-size: 14px;
                color: #718096;
                border-top: 1px solid #e2e8f0;
            }
            .status-badge {
                background: #ebf8ff;
                color: #3498db;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
                display: inline-block;
                margin-top: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>New Order Received</h1>
                <div class="status-badge">New Order #${Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
            </div>
            
            <div class="content">
                <div class="order-details">
                    <h2>Product Details</h2>
                    <table class="products-table">
                        <thead>
                            <tr>
                                <th>Image</th>
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
                                    <td data-label="Image">
                                        <img src="${item.image || 'https://via.placeholder.com/100'}" 
                                             alt="${item.name}" 
                                             class="product-image">
                                    </td>
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
                            <h3>Order Summary</h3>
                            <p><strong>Total Price:</strong> PKR${totalPrice.toFixed(2)}</p>
                            <p><strong>Payment Method:</strong> ${paymentMethod}</p>
                            <p><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</p>
                        </div>
                        
                        <div class="info-box">
                            <h3>Customer Information</h3>
                            <p><strong>Name:</strong> ${customerDetails.name}</p>
                            <p><strong>Email:</strong> ${customerDetails.email}</p>
                            <p><strong>Phone:</strong> ${customerDetails.phone}</p>
                        </div>
                    </div>
  
                    <div class="info-box" style="margin-top: 25px;">
                        <h3>Shipping Address</h3>
                        <p style="margin-bottom: 0;">
                            ${customerDetails.address}<br>
                            ${customerDetails.city}, ${customerDetails.postalCode}<br>
                            ${customerDetails.country}
                        </p>
                    </div>
                </div>
            </div>
  
            <div class="footer">
                <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
                <p style="margin-bottom: 0;">This is an automated order notification email.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  };
  
  export default AdminEmail;