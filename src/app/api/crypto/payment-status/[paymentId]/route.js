// src/app/api/crypto/payment-status/[paymentId]/route.js
import { NextResponse } from "next/server";

const API_KEY = process.env.NOWPAYMENTS_API_KEY;
const API_URL =
  process.env.NOWPAYMENTS_API_URL || "https://api.nowpayments.io/v1";

export async function GET(request, { params }) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "Payment system not configured" },
      { status: 500 },
    );
  }

  try {
    const { paymentId } = await params;

    const response = await fetch(`${API_URL}/payment/${paymentId}`, {
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch payment status");
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Payment status error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch payment status" },
      { status: 500 },
    );
  }
}
