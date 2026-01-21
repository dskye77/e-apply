import { NextResponse } from "next/server";

const API_KEY = process.env.NOWPAYMENTS_API_KEY;
const API_URL = process.env.NOWPAYMENTS_API_URL || "https://api.nowpayments.io/v1";

export async function POST(request) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "Payment system not configured" },
      { status: 500 }
    );
  }

  try {
    const paymentData = await request.json();

    // Add callback URLs from server-side env
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (appUrl) {
      paymentData.ipn_callback_url = `${appUrl}/api/payment/callback`;
      paymentData.success_url = `${appUrl}/payment/success`;
      paymentData.cancel_url = `${appUrl}/payment/cancel`;
    }

    console.log("Creating payment with data:", paymentData);

    const response = await fetch(`${API_URL}/payment`, {
      method: "POST",
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Payment creation failed:", data);
      throw new Error(data.message || "Failed to create payment");
    }

    console.log("Payment created successfully:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Payment creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create payment" },
      { status: 500 }
    );
  }
}