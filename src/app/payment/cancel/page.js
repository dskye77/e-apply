import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="max-w-2xl mx-auto my-12 px-4">
      <div className="bg-yellow-50 border-2 border-yellow-500 rounded-lg p-8 text-center">
        <div className="text-6xl mb-4">⚠️</div>

        <h1 className="text-3xl font-bold text-yellow-800 mb-4">
          Payment Cancelled
        </h1>

        <p className="text-gray-700 mb-6">
          Your payment was cancelled. Your application has not been submitted.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/e-resident-basic-application-duplicate-147"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </Link>

          <Link
            href="/"
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
