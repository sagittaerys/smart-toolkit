import { UnitCategory } from "../constants/units";

export function convert(value: number, from: string, to: string, category: UnitCategory): number {
  if (from === to) return value;

  if (category === "Temperature") {
    return convertTemperature(value, from, to);
  }

  const toBase = toBaseFactors[category][from];
  const fromBase = toBaseFactors[category][to];
  if (toBase == null || fromBase == null) return 0;
  return (value * toBase) / fromBase;
}

function convertTemperature(value: number, from: string, to: string): number {
  let celsius: number;
  if (from === "Celsius") celsius = value;
  else if (from === "Fahrenheit") celsius = (value - 32) * (5 / 9);
  else celsius = value - 273.15;

  if (to === "Celsius") return celsius;
  if (to === "Fahrenheit") return celsius * (9 / 5) + 32;
  return celsius + 273.15;
}

const toBaseFactors: Record<string, Record<string, number>> = {
  Length: {
    Meters: 1, Kilometers: 1000, Miles: 1609.34,
    Feet: 0.3048, Inches: 0.0254, Centimeters: 0.01,
  },
  Weight: {
    Kilograms: 1, Grams: 0.001, Pounds: 0.453592, Ounces: 0.0283495,
  },
  Area: {
    "Square Meters": 1, "Square Kilometers": 1e6,
    "Square Miles": 2.59e6, Acres: 4046.86, Hectares: 10000,
  },
};