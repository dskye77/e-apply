// src/lib/nowpayments.js - Client-side API wrapper

export class NowPaymentsAPI {
  static async makeRequest(endpoint, options = {}) {
    try {
      const url = `/api/crypto${endpoint}`;
      console.log(`Making request to: ${url}`);

      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("API Error Response:", data);
        throw new Error(data.error || `API request failed: ${response.status}`);
      }

      console.log(`Success response from ${endpoint}:`, data);
      return data;
    } catch (err) {
      console.error(`API Error (${endpoint}):`, err.message);
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
      const data = await this.makeRequest("/create-payment", {
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
      const data = await this.makeRequest(`/payment-status/${paymentId}`);
      return data;
    } catch (err) {
      console.error("Error fetching payment status:", err);
      throw err;
    }
  }

  // Helper to check if API is configured (always true on client since we check server-side)
  static isConfigured() {
    return true; // The server will handle configuration checks
  }

  // Helper to check if in sandbox mode (check via environment detection)
  static isSandbox() {
    // You could add an endpoint to check this if needed
    return false;
  }

  // Get the current environment
  static getEnvironment() {
    return this.isSandbox() ? "sandbox" : "production";
  }
}
