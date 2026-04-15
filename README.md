# Smart Toolkit

A clean, fast, and fully offline-capable utility app built with React Native and Expo. Smart Toolkit bundles four everyday tools into a single polished mobile experience.

---

## Features

### Unit Converter
Convert between units across four categories:
- **Length** — Meters, Kilometers, Miles, Feet, Inches, Centimeters
- **Weight** — Kilograms, Grams, Pounds, Ounces
- **Temperature** — Celsius, Fahrenheit, Kelvin
- **Area** — Square Meters, Square Kilometers, Square Miles, Acres, Hectares

### Currency Converter
- Live exchange rates via [ExchangeRate API](https://open.er-api.com)
- Supports 12 popular currencies including USD, EUR, GBP, NGN, JPY, and more
- Rates cached in AsyncStorage for 1 hour — works offline between refreshes
- Shows last-updated timestamp and one-tap refresh

### BMI Calculator
- Metric and Imperial input modes
- Instant BMI calculation with WHO category classification
- Color-coded result: Underweight, Normal, Overweight, Obese

### Task Manager
- Create, edit, and delete tasks with optional notes
- Mark tasks complete/incomplete with haptic feedback
- Filter by All, Active, or Done
- Fully persistent — tasks survive app restarts via AsyncStorage

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Expo SDK 54 | App framework |
| Expo Router | File-based navigation |
| TypeScript | Type safety |
| Zustand + persist | Tasks state + persistence |
| AsyncStorage | Local storage backend |
| expo-haptics | Tactile feedback |
| React Native StyleSheet | Styling |

---

## Project Structure

```
smart-toolkit/
├── app/
│   ├── _layout.tsx          # Root layout
│   └── (tabs)/
│       ├── _layout.tsx      # Tab bar config
│       ├── index.tsx        # Unit Converter
│       ├── currency.tsx     # Currency Converter
│       ├── bmi.tsx          # BMI Calculator
│       └── tasks.tsx        # Task Manager
├── components/
│   └── ui/                  # Shared UI components
├── constants/
│   ├── theme.ts             # Colors, spacing, typography
│   ├── units.ts             # Unit categories and values
│   └── currencies.ts        # Supported currency list
├── lib/
│   ├── conversions.ts       # Pure unit conversion logic
│   ├── bmi.ts               # BMI calculation logic
│   ├── currency.ts          # Fetch + cache logic
│   └── tasks.ts             # Task CRUD helpers + types
├── store/
│   └── useTaskStore.ts      # Zustand store with persistence
└── hooks/                   # Custom hooks
```

---

## Getting Started

### Prerequisites
- Node.js 20 LTS
- Expo Go app on your phone, or an Android/iOS simulator

### Installation

```bash
# Clone the repo
git clone https://github.com/sagittaerys/smart-toolkit.git
cd smart-toolkit

# Install dependencies
npm install

# Start the dev server
npx expo start --clear
```

Then scan the QR code with Expo Go (Android) or the Camera app (iOS).

### Build APK (Android)

```bash
npx eas build --platform android --profile preview
```

---

## Architecture Decisions

- **Pure functions in `lib/`** — all conversion and calculation logic is separated from UI, making it independently testable
- **Zustand with persist middleware** — lightweight state management with zero boilerplate, backed by AsyncStorage for offline persistence
- **Per-base currency caching** — exchange rates are cached per base currency to avoid stale rate bugs when switching between currencies
- **Single design token file** — all colors, spacing, font sizes, and border radii live in `constants/theme.ts` ensuring visual consistency across all four modules

---

