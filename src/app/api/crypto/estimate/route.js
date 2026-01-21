import { NextResponse } from "next/server";

const API_KEY = process.env.NOWPAYMENTS_API_KEY;
const API_URL = process.env.NOWPAYMENTS_API_URL || "https://api.nowpayments.io/v1";

export async function GET(request) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "Payment system not configured" },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const amount = searchParams.get("amount");
    const currencyFrom = searchParams.get("currency_from");
    const currencyTo = searchParams.get("currency_to");

    if (!amount || !currencyFrom || !currencyTo) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${API_URL}/estimate?amount=${amount}&currency_from=${currencyFrom}&currency_to=${currencyTo}`,
      {
        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to get estimate");
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Estimate error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get estimate" },
      { status: 500 }
    );
  }
}