// components/MultiStepForm.jsx
"use client";

import { useState, useCallback } from "react";
import FormInput from "./FormInput";

export default function MultiStepForm({ STEPS }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  const totalSteps = STEPS.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const currentStepData = STEPS[currentStep];

  const updateField = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const goToNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, totalSteps]);

  const goToPrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted application data:", formData);
    // Here you would typically send to API
    alert("Application submitted! (Check console)");
  };

  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="w-full mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>
            Step {currentStep + 1} of {totalSteps}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="border-b border-gray-400">
        <h2 className="text-3xl">{currentStepData.title}</h2>
        <p>{currentStepData.desc}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pt-8">
        {isLastStep ? (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-6">
              Review Your Information
            </h2>
            <pre className="whitespace-pre-wrap text-sm bg-white p-4 rounded border font-mono">
              {JSON.stringify(formData, null, 2)}
            </pre>
            <p className="mt-6 text-sm text-gray-600">
              Please verify all details are correct before submitting.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {currentStepData.fields.map((field, index) => {
              if (field.type === "group") {
                return (
                  <div key={field.label} className="md:col-span-2">
                    {field.label && (
                      <h3 className="text-lg font-medium mb-4">
                        {field.label}
                      </h3>
                    )}
                    <div className="flex flex-col md:flex-row gap-6">
                      {field.fields.map((subField) => (
                        <FormInput
                          key={subField.name}
                          {...subField}
                          value={formData[subField.name] ?? ""}
                          onChange={(e) =>
                            updateField(subField.name, e.target.value)
                          }
                        />
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={field.name}
                  className={field.fullWidth ? "md:col-span-2" : ""}
                >
                  <FormInput
                    {...field}
                    value={formData[field.name] ?? ""}
                    onChange={(e) => updateField(field.name, e.target.value)}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t">
          <button
            type="button"
            onClick={goToPrevious}
            disabled={currentStep === 0}
            className="px-4 py-2 bg-gray-500 text-white rounded-sm font-medium
                     hover:bg-gray-700 transition-colors"
          >
            Previous
          </button>

          {isLastStep ? (
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-sm font-medium
                       hover:bg-blue-700 transition-colors shadow-sm"
            >
              Submit
            </button>
          ) : (
            <button
              type="button"
              onClick={goToNext}
              className="px-4 py-2 bg-gray-500 text-white rounded-sm font-medium
                       hover:bg-gray-700 transition-colors shadow-sm"
            >
              Next
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
