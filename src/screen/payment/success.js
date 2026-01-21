"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("payment_id");

  return (
    <div className="max-w-2xl mx-auto my-12 px-4">
      <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8 text-center">
        <div className="text-6xl mb-4">✅</div>

        <h1 className="text-3xl font-bold text-green-800 mb-4">
          Payment Successful!
        </h1>

        <p className="text-gray-700 mb-6">
          Your payment has been processed successfully. Your e-Residency
          application is now being reviewed.
        </p>

        {paymentId && (
          <p className="text-sm text-gray-600 mb-6">
            Payment ID: <span className="font-mono">{paymentId}</span>
          </p>
        )}

        <div className="bg-white p-4 rounded-lg mb-6">
          <h2 className="font-semibold mb-2">What happens next?</h2>
          <ul className="text-left text-sm text-gray-600 space-y-2">
            <li>✓ You will receive a confirmation email shortly</li>
            <li>✓ Your application will be reviewed within 14 days</li>
            <li>✓ You&apos;ll be notified of the decision via email</li>
          </ul>
        </div>

        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
