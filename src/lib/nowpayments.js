// src/lib/nowpayments.js

const API_URL =
  process.env.NEXT_PUBLIC_NOWPAYMENTS_API_URL ||
  "https://api.nowpayments.io/v1";
const API_KEY = process.env.NEXT_PUBLIC_NOWPAYMENTS_API_KEY;

// Validate API configuration
if (!API_KEY) {
  console.warn(
    "⚠️ NOWPayments API key is not configured. Please set NEXT_PUBLIC_NOWPAYMENTS_API_KEY in your .env.local file",
  );
}

export class NowPaymentsAPI {
  static async makeRequest(endpoint, options = {}) {
    if (!API_KEY) {
      throw new Error("NOWPayments API key is not configured");
    }

    try {
      const url = `${API_URL}${endpoint}`;
      console.log(`Making request to: ${url}`);

      const response = await fetch(url, {
        ...options,
        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("API Error Response:", data);
        throw new Error(
          data.message ||
            data.error ||
            `API request failed: ${response.status}`,
        );
      }

      console.log(`Success response from ${endpoint}:`, data);
      return data;
    } catch (err) {
      console.error(`NOWPayments API Error (${endpoint}):`, err.message);
      throw err;
    }
  }

  static async getStatus() {
    try {
      const data = await this.makeRequest("/status");
      console.log("API Status:", data);
      return data;
    } catch (err) {
      console.error("Error checking API status:", err);
      return null;
    }
  }

  static async getAvailableCurrencies() {
    try {
      const data = await this.makeRequest("/currencies");
      console.log("Available currencies:", data.currencies?.length);
      return data.currencies || [];
    } catch (err) {
      console.error("Error fetching currencies:", err);
      return [];
    }
  }

  static async getMinimumAmount(currencyFrom, currencyTo = "usd") {
    try {
      const data = await this.makeRequest(
        `/min-amount?currency_from=${currencyFrom}&currency_to=${currencyTo}`,
      );
      return data.min_amount || 0;
    } catch (err) {
      console.error("Error fetching minimum amount:", err);
      return 0;
    }
  }

  static async getEstimatedPrice(amount, currencyFrom, currencyTo) {
    try {
      const data = await this.makeRequest(
        `/estimate?amount=${amount}&currency_from=${currencyFrom}&currency_to=${currencyTo}`,
      );
      console.log(
        `Estimate for ${amount} ${currencyFrom}:`,
        data.estimated_amount,
        currencyTo,
      );
      return data.estimated_amount || 0;
    } catch (err) {
      console.error("Error fetching estimate:", err);
      return 0;
    }
  }

  static async createPayment(paymentData) {
    try {
      console.log("Creating payment with data:", paymentData);
      const data = await this.makeRequest("/payment", {
        method: "POST",
        body: JSON.stringify(paymentData),
      });
      console.log("Payment created:", data);
      return data;
    } catch (err) {
      console.error("Error creating payment:", err);
      throw err;
    }
  }

  static async getPaymentStatus(paymentId) {
    try {
      const data = await this.makeRequest(`/payment/${paymentId}`);
      return data;
    } catch (err) {
      console.error("Error fetching payment status:", err);
      throw err;
    }
  }

  static async createInvoice(invoiceData) {
    try {
      console.log("Creating invoice with data:", invoiceData);
      const data = await this.makeRequest("/invoice", {
        method: "POST",
        body: JSON.stringify(invoiceData),
      });
      console.log("Invoice created:", data);
      return data;
    } catch (err) {
      console.error("Error creating invoice:", err);
      throw err;
    }
  }

  // Helper to check if API is configured correctly
  static isConfigured() {
    return !!API_KEY;
  }

  // Helper to check if in sandbox mode
  static isSandbox() {
    return API_URL.includes("sandbox");
  }

  // Get the current environment
  static getEnvironment() {
    return this.isSandbox() ? "sandbox" : "production";
  }
}
