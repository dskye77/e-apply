// src/lib/nowpayments.js

const API_URL = process.env.NEXT_PUBLIC_NOWPAYMENTS_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_NOWPAYMENTS_API_KEY;

export class NowPaymentsAPI {
  static async getAvailableCurrencies() {
    try {
      const res = await fetch(`${API_URL}/currencies`, {
        headers: {
          "x-api-key": API_KEY,
        },
      });
      const data = await res.json();
      return data.currencies || [];
    } catch (err) {
      console.error("Error fetching currencies:", err);
      return [];
    }
  }

  static async getMinimumAmount(currencyFrom, currencyTo = "usd") {
    try {
      const res = await fetch(
        `${API_URL}/min-amount?currency_from=${currencyFrom}&currency_to=${currencyTo}`,
        {
          headers: {
            "x-api-key": API_KEY,
          },
        },
      );
      const data = await res.json();
      return data.min_amount || 0;
    } catch (err) {
      console.error("Error fetching minimum amount:", err);
      return 0;
    }
  }

  static async getEstimatedPrice(amount, currencyFrom, currencyTo = "usd") {
    try {
      const res = await fetch(
        `${API_URL}/estimate?amount=${amount}&currency_from=${currencyFrom}&currency_to=${currencyTo}`,
        {
          headers: {
            "x-api-key": API_KEY,
          },
        },
      );
      const data = await res.json();
      return data.estimated_amount || 0;
    } catch (err) {
      console.error("Error fetching estimate:", err);
      return 0;
    }
  }

  static async createPayment(paymentData) {
    try {
      const res = await fetch(`${API_URL}/payment`, {
        method: "POST",
        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Error creating payment:", err);
      throw err;
    }
  }

  static async getPaymentStatus(paymentId) {
    try {
      const res = await fetch(`${API_URL}/payment/${paymentId}`, {
        headers: {
          "x-api-key": API_KEY,
        },
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Error fetching payment status:", err);
      throw err;
    }
  }
}
