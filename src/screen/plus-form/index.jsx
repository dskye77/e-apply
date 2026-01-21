// src/screen/plus-form/index.jsx
"use client";
import MultiStepForm from "@/components/MultiStepForm";
import { form1, form2, form3, form4, form5Plus } from "@/data/data.js";

const STEPS = [form1, form2, form3, form4, form5Plus];

export default function PlusFormScreen() {
  return (
    <div className="max-w-6xl mx-auto my-12 px-4 md:px-0">
      <h1 className="text-3xl font-bold mb-6 text-left">
        e-Resident Plus Application
      </h1>
      <MultiStepForm STEPS={STEPS} amount={58} />
    </div>
  );
}
