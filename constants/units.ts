export type UnitCategory = "Length" | "Weight" | "Temperature" | "Area";

export const unitCategories: UnitCategory[] = ["Length", "Weight", "Temperature", "Area"];

export const units: Record<UnitCategory, string[]> = {
  Length: ["Meters", "Kilometers", "Miles", "Feet", "Inches", "Centimeters"],
  Weight: ["Kilograms", "Grams", "Pounds", "Ounces"],
  Temperature: ["Celsius", "Fahrenheit", "Kelvin"],
  Area: ["Square Meters", "Square Kilometers", "Square Miles", "Acres", "Hectares"],
};