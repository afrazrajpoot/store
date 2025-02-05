export const ShipmentEmail = ({ customerName, trackingNumber, message }) => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #4CAF50;">📦 Shipment Update</h2>
        <p>Dear <strong>${customerName}</strong>,</p>
        <p>Your order has been shipped! Here are the details:</p>
        <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
        <p>${message}</p>
        <p>You can track your order using the tracking number above.</p>
        <p>Thank you for shopping with us! 🚀</p>
        <p>Best Regards, <br><strong>Your Store Team</strong></p>
      </div>
    `;
  };
  