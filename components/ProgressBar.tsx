import { cn } from "@/lib/utils"

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  stepNames?: string[]
  className?: string
}

export function ProgressBar({ currentStep, totalSteps, stepNames = [], className }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100

  // Get the current step name, either from provided names or default names
  const getCurrentStepName = () => {
    if (stepNames && stepNames.length >= currentStep) {
      return stepNames[currentStep - 1]
    }
    return getDefaultStepName(currentStep)
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-2">
        <span className="text-sm font-medium text-epiclinx-teal">
          Step {currentStep}/{totalSteps}. {getCurrentStepName()}
        </span>
      </div>
      <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-epiclinx-teal transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

function getDefaultStepName(step: number): string {
  switch (step) {
    case 1:
      return "Business Info"
    case 2:
      return "Legal Info"
    case 3:
      return "Account Info"
    case 4:
      return "Additional"
    default:
      return ""
  }
}

