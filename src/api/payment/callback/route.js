// src/app/api/payment/callback/route.js
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request) {
  try {
    const body = await request.json();

    // Verify the IPN signature
    const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;
    const signature = request.headers.get("x-nowpayments-sig");

    if (ipnSecret && signature) {
      const hmac = crypto.createHmac("sha512", ipnSecret);
      hmac.update(JSON.stringify(body));
      const calculatedSignature = hmac.digest("hex");

      if (calculatedSignature !== signature) {
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 },
        );
      }
    }

    // Handle payment status
    const { payment_status, order_id, pay_amount, pay_currency } = body;

    console.log("Payment callback received:", {
      payment_status,
      order_id,
      pay_amount,
      pay_currency,
    });

    // Update your database based on payment status
    switch (payment_status) {
      case "finished":
        // Payment successful - update application status
        console.log("Payment finished for order:", order_id);
        // TODO: Update your database to mark the application as paid
        break;

      case "partially_paid":
        // Partial payment received
        console.log("Partial payment for order:", order_id);
        break;

      case "failed":
      case "expired":
        // Payment failed or expired
        console.log("Payment failed/expired for order:", order_id);
        // TODO: Update your database to mark the application as failed
        break;

      default:
        console.log("Unknown payment status:", payment_status);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing payment callback:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
