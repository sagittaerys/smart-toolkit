export type BMICategory = "Underweight" | "Normal" | "Overweight" | "Obese";

export function calculateBMI(weight: number, height: number): number {
  return weight / (height * height);
}

export function getBMICategory(bmi: number): BMICategory {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

export function getBMIColor(category: BMICategory): string {
  switch (category) {
    case "Underweight": return "#2196F3";
    case "Normal": return "#4CAF50";
    case "Overweight": return "#FF9800";
    case "Obese": return "#F44336";
  }
}

export function convertToMetric(
  weightLbs: number, heightFt: number, heightIn: number
): { weight: number; height: number } {
  return {
    weight: weightLbs * 0.453592,
    height: (heightFt * 12 + heightIn) * 0.0254,
  };
}