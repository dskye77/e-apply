// src/components/CryptoPayment.jsx
"use client";

import { useState, useEffect } from "react";
import { NowPaymentsAPI } from "@/lib/nowpayments";

export default function CryptoPayment({
  amount,
  onSuccess,
  onCancel,
  formData,
}) {
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [estimatedAmount, setEstimatedAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    loadCurrencies();
  }, []);

  useEffect(() => {
    if (selectedCurrency) {
      fetchEstimate();
    }
  }, [selectedCurrency]);

  async function loadCurrencies() {
    const curr = await NowPaymentsAPI.getAvailableCurrencies();
    // Filter popular cryptocurrencies
    const popular = ["btc", "eth", "ltc", "usdt", "usdc", "sol", "bnb"];
    const filtered = curr.filter((c) => popular.includes(c.toLowerCase()));
    setCurrencies(filtered);
  }

  async function fetchEstimate() {
    if (!selectedCurrency) return;
    const estimate = await NowPaymentsAPI.getEstimatedPrice(
      amount,
      "usd",
      selectedCurrency,
    );
    setEstimatedAmount(estimate);
  }

  async function handlePayment() {
    if (!selectedCurrency) {
      alert("Please select a cryptocurrency");
      return;
    }

    setLoading(true);

    try {
      const paymentData = {
        price_amount: amount,
        price_currency: "usd",
        pay_currency: selectedCurrency,
        ipn_callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback`,
        order_id: `order_${Date.now()}`,
        order_description: `e-Residency Application - ${formData.firstName} ${formData.lastName}`,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
      };

      const payment = await NowPaymentsAPI.createPayment(paymentData);

      if (payment.payment_url) {
        setPaymentUrl(payment.payment_url);
        // Redirect to payment page
        window.location.href = payment.payment_url;
      } else if (payment.pay_address) {
        // Show payment details if direct payment
        setPaymentStatus(payment);
      }
    } catch (err) {
      alert("Error creating payment. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (paymentStatus && !paymentUrl) {
    return (
      <div className="p-6 bg-white rounded-lg border">
        <h3 className="text-xl font-bold mb-4">Payment Details</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Send exactly:</p>
            <p className="text-2xl font-bold">
              {paymentStatus.pay_amount}{" "}
              {paymentStatus.pay_currency.toUpperCase()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">To address:</p>
            <p className="text-sm font-mono bg-gray-100 p-2 rounded break-all">
              {paymentStatus.pay_address}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded">
            <p className="text-sm text-yellow-800">
              ⚠️ Send the exact amount to complete the payment. Payment will be
              confirmed automatically.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg border">
      <h3 className="text-xl font-bold mb-4">Pay with Cryptocurrency</h3>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Amount to pay:</p>
        <p className="text-2xl font-bold">${amount} USD</p>
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-semibold">
          Select Cryptocurrency
        </label>
        <select
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        >
          <option value="">— Select currency —</option>
          {currencies.map((curr) => (
            <option key={curr} value={curr}>
              {curr.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {estimatedAmount > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded">
          <p className="text-sm text-gray-600">Estimated amount:</p>
          <p className="text-lg font-semibold">
            ≈ {estimatedAmount} {selectedCurrency.toUpperCase()}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            * Final amount will be calculated at checkout
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handlePayment}
          disabled={loading || !selectedCurrency}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Proceed to Payment"}
        </button>
        <button
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
