// src/components/CryptoPayment.jsx
"use client";

import { useState, useEffect, useRef } from "react";
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
  const [initializing, setInitializing] = useState(true);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState(null);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [currentPaymentStatus, setCurrentPaymentStatus] = useState(null);

  const pollingIntervalRef = useRef(null);

  useEffect(() => {
    initializePayment();

    // Cleanup polling on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedCurrency) {
      fetchEstimate();
    } else {
      setEstimatedAmount(0);
    }
  }, [selectedCurrency, amount]);

  // Start polling when payment details are shown
  useEffect(() => {
    if (paymentStatus?.payment_id && !pollingIntervalRef.current) {
      startPaymentPolling(paymentStatus.payment_id);
    }
  }, [paymentStatus]);

  async function initializePayment() {
    setInitializing(true);
    setError(null);

    try {
      const status = await NowPaymentsAPI.getStatus();
      setApiStatus(status);

      if (status && status.message === "OK") {
        console.log("✅ NOWPayments API is operational");
      }

      await loadCurrencies();
    } catch (err) {
      console.error("Initialization error:", err);
      setError("Unable to connect to payment service. Please try again.");
    } finally {
      setInitializing(false);
    }
  }

  async function loadCurrencies() {
    try {
      const curr = await NowPaymentsAPI.getAvailableCurrencies();

      if (curr.length === 0) {
        setError("Unable to load payment currencies. Please try again later.");
        return;
      }

      const popular = [
        "btc",
        "eth",
        "ltc",
        "usdt",
        "usdc",
        "sol",
        "bnb",
        "trx",
        "xrp",
        "doge",
        "ada",
      ];
      const filtered = curr.filter((c) => popular.includes(c.toLowerCase()));
      const finalList = filtered.length > 0 ? filtered : curr.slice(0, 15);

      setCurrencies(finalList);
      console.log(`✅ Loaded ${finalList.length} cryptocurrencies`);
    } catch (err) {
      console.error("Error loading currencies:", err);
      setError("Unable to load payment currencies. Please try again.");
    }
  }

  async function fetchEstimate() {
    if (!selectedCurrency) return;

    try {
      setError(null);
      const estimate = await NowPaymentsAPI.getEstimatedPrice(
        amount,
        "usd",
        selectedCurrency,
      );

      if (estimate > 0) {
        setEstimatedAmount(estimate);
      } else {
        setError("Unable to get price estimate. Please try another currency.");
      }
    } catch (err) {
      console.error("Estimate error:", err);
      setError("Unable to get price estimate. Please try another currency.");
    }
  }

  async function handlePayment() {
    if (!selectedCurrency) {
      setError("Please select a cryptocurrency");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderData = {
        price_amount: amount,
        price_currency: "usd",
        pay_currency: selectedCurrency,
        order_id: `eres_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        order_description:
          `e-Residency Application - ${formData.firstName || "Applicant"} ${formData.lastName || ""}`.trim(),
      };

      console.log("Creating payment with order data:", orderData);

      const payment = await NowPaymentsAPI.createPayment(orderData);
      console.log("Payment created successfully:", payment);

      if (payment.invoice_url) {
        console.log("Redirecting to invoice URL:", payment.invoice_url);
        window.location.href = payment.invoice_url;
      } else if (payment.payment_url) {
        console.log("Redirecting to payment URL:", payment.payment_url);
        setPaymentUrl(payment.payment_url);
        window.location.href = payment.payment_url;
      } else if (payment.pay_address) {
        console.log("Showing direct payment details");
        setPaymentStatus(payment);
      } else {
        throw new Error("No payment URL or address returned from API");
      }
    } catch (err) {
      console.error("Payment creation error:", err);
      setError(err.message || "Error creating payment. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Poll payment status every 10 seconds
  function startPaymentPolling(paymentId) {
    console.log("Starting payment status polling for:", paymentId);

    pollingIntervalRef.current = setInterval(async () => {
      try {
        const status = await NowPaymentsAPI.getPaymentStatus(paymentId);
        console.log("Payment status update:", status);

        setCurrentPaymentStatus(status.payment_status);

        // Check if payment is completed
        if (status.payment_status === "finished") {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;

          // Redirect to success page
          window.location.href = `/payment/success?payment_id=${paymentId}`;
        } else if (
          status.payment_status === "failed" ||
          status.payment_status === "expired"
        ) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;

          setError("Payment failed or expired. Please try again.");
        }
      } catch (err) {
        console.error("Error checking payment status:", err);
      }
    }, 10000); // Check every 10 seconds
  }

  async function handleCheckPaymentStatus() {
    if (!paymentStatus?.payment_id) return;

    setCheckingPayment(true);
    try {
      const status = await NowPaymentsAPI.getPaymentStatus(
        paymentStatus.payment_id,
      );
      console.log("Manual payment status check:", status);

      setCurrentPaymentStatus(status.payment_status);

      if (status.payment_status === "finished") {
        window.location.href = `/payment/success?payment_id=${paymentStatus.payment_id}`;
      } else if (status.payment_status === "waiting") {
        setError(
          "Payment not yet received. Please send the exact amount to the address shown.",
        );
      } else if (status.payment_status === "confirming") {
        setError("Payment received! Waiting for blockchain confirmations...");
      } else {
        setError(
          `Payment status: ${status.payment_status}. Please wait or contact support.`,
        );
      }
    } catch (err) {
      console.error("Error checking payment status:", err);
      setError("Unable to check payment status. Please try again.");
    } finally {
      setCheckingPayment(false);
    }
  }

  // Loading state
  if (initializing) {
    return (
      <div className="p-6 bg-white rounded-lg border">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Initializing payment system...</p>
          </div>
        </div>
      </div>
    );
  }

  // Configuration error
  if (error && error.includes("not configured")) {
    return (
      <div className="p-6 bg-red-50 border-2 border-red-500 rounded-lg">
        <div className="text-6xl mb-4 text-center">⚠️</div>
        <h3 className="text-xl font-bold text-red-800 mb-4 text-center">
          Payment System Not Configured
        </h3>
        <p className="text-red-700 mb-6 text-center">
          The cryptocurrency payment system is not properly configured. Please
          contact support.
        </p>
        <div className="text-center">
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Direct payment details view
  if (paymentStatus && !paymentUrl) {
    return (
      <div className="p-6 bg-white rounded-lg border">
        <h3 className="text-xl font-bold mb-4">Complete Your Payment</h3>

        {/* Show current payment status */}
        {currentPaymentStatus && (
          <div
            className={`mb-4 p-3 rounded border ${
              currentPaymentStatus === "waiting"
                ? "bg-yellow-50 border-yellow-300"
                : currentPaymentStatus === "confirming"
                  ? "bg-blue-50 border-blue-300"
                  : currentPaymentStatus === "finished"
                    ? "bg-green-50 border-green-300"
                    : "bg-gray-50 border-gray-300"
            }`}
          >
            <p className="text-sm font-semibold">
              Status:{" "}
              {currentPaymentStatus === "waiting"
                ? "⏳ Waiting for payment"
                : currentPaymentStatus === "confirming"
                  ? "🔄 Confirming transaction"
                  : currentPaymentStatus === "finished"
                    ? "✅ Payment confirmed"
                    : currentPaymentStatus}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded">
            <p className="text-sm text-gray-600 mb-1">Amount to send:</p>
            <p className="text-3xl font-bold text-blue-600">
              {paymentStatus.pay_amount}{" "}
              {paymentStatus.pay_currency.toUpperCase()}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">Payment address:</p>
            <div className="flex gap-2 items-center">
              <div className="flex-1 bg-gray-100 p-3 rounded border">
                <p className="text-sm font-mono break-all">
                  {paymentStatus.pay_address}
                </p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(paymentStatus.pay_address);
                  alert("Address copied to clipboard!");
                }}
                className="px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 whitespace-nowrap"
              >
                Copy
              </button>
            </div>
          </div>

          {paymentStatus.payment_id && (
            <div>
              <p className="text-sm text-gray-600">Payment ID:</p>
              <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                {paymentStatus.payment_id}
              </p>
            </div>
          )}

          <div className="bg-yellow-50 p-4 rounded border border-yellow-300">
            <p className="text-sm text-yellow-800 font-semibold mb-2">
              ⚠️ Important:
            </p>
            <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
              <li>Send the exact amount shown above</li>
              <li>Payment will be confirmed automatically</li>
              <li>
                Do not close this page - we&apos;re monitoring for your payment
              </li>
              <li>Confirmation may take a few minutes</li>
            </ul>
          </div>

          {error && (
            <div className="bg-red-50 p-3 border border-red-300 rounded">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleCheckPaymentStatus}
              disabled={checkingPayment}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checkingPayment ? "Checking..." : "Check Payment Status"}
            </button>
            <button
              onClick={onCancel}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            We&apos;re automatically checking for your payment every 10 seconds
          </p>
        </div>
      </div>
    );
  }

  // Main payment selection view
  return (
    <div className="p-6 bg-white rounded-lg border">
      <h3 className="text-xl font-bold mb-4">Pay with Cryptocurrency</h3>

      <div className="mb-4 p-3 bg-green-50 border border-green-300 rounded">
        <p className="text-sm text-green-800">
          🔒 <strong>Secure Payment:</strong> Your payment will be processed
          securely via NOWPayments.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded">
          <p className="text-sm text-red-800">❌ {error}</p>
        </div>
      )}

      <div className="mb-6 p-4 bg-gray-50 rounded">
        <p className="text-sm text-gray-600 mb-1">Total amount:</p>
        <p className="text-3xl font-bold">${amount} USD</p>
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-semibold">
          Select Cryptocurrency *
        </label>
        <select
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading || currencies.length === 0}
        >
          <option value="">— Select cryptocurrency —</option>
          {currencies.map((curr) => (
            <option key={curr} value={curr}>
              {curr.toUpperCase()}
            </option>
          ))}
        </select>
        {currencies.length === 0 && (
          <p className="text-xs text-red-600 mt-1">
            No cryptocurrencies available. Please refresh the page.
          </p>
        )}
      </div>

      {estimatedAmount > 0 && selectedCurrency && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-gray-600 mb-1">
            You will pay approximately:
          </p>
          <p className="text-2xl font-bold text-blue-600">
            ≈ {estimatedAmount} {selectedCurrency.toUpperCase()}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            * Exchange rate is fixed at checkout
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handlePayment}
          disabled={loading || !selectedCurrency || currencies.length === 0}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Proceed to Payment"
          )}
        </button>
        <button
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Powered by NOWPayments • Secure Cryptocurrency Processing
        </p>
      </div>
    </div>
  );
}
