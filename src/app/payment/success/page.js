import { Suspense } from "react";
import PaymentSuccessClient from "@/screen/payment/success";

export default function Page() {
  return (
    <Suspense fallback={<p className="text-center mt-12">Loading payment result...</p>}>
      <PaymentSuccessClient />
    </Suspense>
  );
}
