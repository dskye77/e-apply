import { NextResponse } from "next/server";

const API_KEY = process.env.NOWPAYMENTS_API_KEY;
const API_URL = process.env.NOWPAYMENTS_API_URL || "https://api.nowpayments.io/v1";

export async function GET() {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "Payment system not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`${API_URL}/status`, {
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to check status");
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to check API status" },
      { status: 500 }
    );
  }
}