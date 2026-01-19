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

  const goToNext = (e) => {
    e.preventDefault();
    if (currentStep < totalSteps - 1) {
      setCurrentStep((p) => p + 1);
    }
  };

  const goToPrevious = () => currentStep > 0 && setCurrentStep((p) => p - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted application data:", formData);
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

      <form
        onSubmit={isLastStep ? handleSubmit : goToNext}
        className="space-y-8 pt-8"
      >
        <div className="flex flex-col">
          {currentStepData.fields.map((field, index) => {
            if (field.type === "text") {
              return <FormInput key={index} {...field} />;
            }

            if (field.type === "group") {
              return (
                <div key={index}>
                  <h3 className="text-lg font-medium mb-4">{field.label}</h3>
                  <div className="flex flex-col md:flex-row gap-6">
                    {field.fields.map((sub, subIdx) => (
                      <FormInput
                        key={subIdx}
                        {...sub}
                        value={formData[sub.name] ?? ""}
                        onChange={(e) =>
                          updateField(
                            sub.name,
                            sub.type === "file"
                              ? e.target.files[0]
                              : e.target.value,
                          )
                        }
                      />
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <FormInput
                key={index}
                {...field}
                value={formData[field.name] ?? ""}
                onChange={(e) =>
                  updateField(
                    field.name,
                    field.type === "file" ? e.target.files[0] : e.target.value,
                  )
                }
              />
            );
          })}
        </div>

        <div className="pt-4 border-t space-y-4">
          {currentStepData.footerText && (
            <div>{currentStepData.footerText}</div>
          )}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={goToPrevious}
              disabled={currentStep === 0}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {isLastStep ? (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Submit
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
