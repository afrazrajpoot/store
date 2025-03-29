import nodemailer from "nodemailer";
import { google } from "googleapis";
import { AdminEmail } from "../templates/AdminEmail";
import { CustomerEmail } from "../templates/CustomerEmail";
import { ShipmentEmail } from "../templates/ShipmentEmail";

// Initialize OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

// Set credentials with the refresh token
oAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

// Function to refresh the access token
const refreshAccessToken = async () => {
  try {
    const { token } = await oAuth2Client.getAccessToken();
    console.log("New access token generated:", token);
    return token;
  } catch (error) {
    if (error.code === "400" && error.message.includes("invalid_grant")) {
      console.error("Refresh token expired. Re-authenticate the user.");
      // Redirect the user to the consent screen
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["https://mail.google.com/"],
        prompt: "consent",
      });
      console.log("Authorize this app by visiting this URL:", authUrl);
      throw new Error("Refresh token expired. Re-authenticate the user.");
    } else {
      console.error("Error refreshing access token:", error);
      throw error;
    }
  }
};

// Listen for token updates
oAuth2Client.on("tokens", (tokens) => {
  if (tokens.refresh_token) {
    // Save the new refresh token if it's provided
    console.log("New refresh token:", tokens.refresh_token);
    process.env.REFRESH_TOKEN = tokens.refresh_token;
  }
  console.log("New access token:", tokens.access_token);
});

// Function to send order emails
export const sendOrderEmails = async (orderDetails) => {
  try {
    const { customerDetails, items, totalPrice, paymentMethod } = orderDetails;
    console.log(customerDetails, "customer details");

    const adminEmail = process.env.ADMIN_EMAIL;
    const customerEmail = customerDetails?.email;

    if (!adminEmail || !customerEmail) {
      throw new Error("Missing admin or customer email");
    }

    // Refresh the access token before sending emails
    const accessToken = await refreshAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.SENDER_EMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const adminHtmlContent = AdminEmail({
      customerDetails,
      items,
      totalPrice,
      paymentMethod,
    });

    const customerHtmlContent = CustomerEmail({
      customerDetails,
      items,
      totalPrice,
      paymentMethod,
    });

    // Prevent duplicate emails
    const uniqueEmails = new Set([adminEmail, customerEmail]);
    const emailPromises = Array.from(uniqueEmails).map((to) =>
      transporter.sendMail({
        from: `Roshni Store <${process.env.SENDER_EMAIL}>`,
        to,
        subject: to === adminEmail ? `New Order` : `Order Confirmation`,
        html: to === adminEmail ? adminHtmlContent : customerHtmlContent,
      })
    );

    const results = await Promise.all(emailPromises);

    return {
      adminEmailResult: results[0],
      customerEmailResult: results[1],
    };
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
};

// Function to send shipment emails
export const sendShipmentMessage = async (
  customerEmail,
  customerName,
  trackingNumber,
  message
) => {
  try {
    if (!customerEmail) {
      throw new Error("Customer email is required");
    }

    // Refresh the access token before sending the shipment email
    const accessToken = await refreshAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.SENDER_EMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const shipmentHtmlContent = ShipmentEmail({
      customerName,
      trackingNumber,
      message,
    });

    const emailResult = await transporter.sendMail({
      from: `Roshni store <${process.env.SENDER_EMAIL}>`,
      to: customerEmail,
      subject: "📦 Your Order Has Been Shipped!",
      html: shipmentHtmlContent,
    });

    return emailResult;
  } catch (error) {
    console.error("Shipment email sending error:", error);
    throw error;
  }
};
