interface ProgressIndicatorProps {
  currentStep: number;
}

const steps = [
  { number: 1, label: 'Budget', path: '/calculator/step1' },
  { number: 2, label: 'Future Value', path: '/calculator/step2' },
  { number: 3, label: 'NPV', path: '/calculator/step3' },
  { number: 4, label: 'Gap Analysis', path: '/calculator/step4' },
  { number: 5, label: 'Savings Plan', path: '/calculator/step5' },
];

export default function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      {/* Step Counter */}
      <div className="text-center mb-4">
        <span className="text-sm font-medium text-gray-600">
          Step {currentStep} of {steps.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        {/* Background Line */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200" />

        {/* Progress Line */}
        <div
          className="absolute top-5 left-0 h-1 bg-blue-600 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step) => {
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;
            const isFuture = step.number > currentStep;

            return (
              <div key={step.number} className="flex flex-col items-center">
                {/* Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm border-2 transition-all duration-300 ${
                    isCompleted
                      ? 'bg-green-600 border-green-600 text-white'
                      : isCurrent
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {isCompleted ? '✓' : step.number}
                </div>

                {/* Label */}
                <span
                  className={`mt-2 text-xs font-medium ${
                    isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
