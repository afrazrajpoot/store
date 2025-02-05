import { sendShipmentMessage } from "@/utils/sendAdminMail";
import { NextResponse } from "next/server";


export async function POST(request) {
    try {
        const data = await request.json();
        const { email, customerName, message } = data;

        if (!email || !customerName  || !message) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Send shipment email
        await sendShipmentMessage(email, customerName,1234, message);

        return NextResponse.json(
            { message: `Shipment email sent to ${email}` },
            { status: 200 }
        );
    } catch (err) {
        console.error("Error sending shipment email:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
