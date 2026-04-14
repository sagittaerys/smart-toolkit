import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_KEY = "currency_rates";
const CACHE_TS_KEY = "currency_rates_ts";
const CACHE_DURATION = 60 * 60 * 1000; 

export async function fetchRates(base: string): Promise<Record<string, number> | null> {
  try {
    const cachedTs = await AsyncStorage.getItem(CACHE_TS_KEY);
    const cachedData = await AsyncStorage.getItem(CACHE_KEY);

    if (cachedTs && cachedData) {
      const age = Date.now() - parseInt(cachedTs);
      if (age < CACHE_DURATION) {
        return JSON.parse(cachedData);
      }
    }

    const res = await fetch(`https://open.er-api.com/v6/latest/${base}`);
    const json = await res.json();

    if (json.result === "success") {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(json.rates));
      await AsyncStorage.setItem(CACHE_TS_KEY, Date.now().toString());
      return json.rates;
    }
    return cachedData ? JSON.parse(cachedData) : null;
  } catch {
    const cachedData = await AsyncStorage.getItem(CACHE_KEY);
    return cachedData ? JSON.parse(cachedData) : null;
  }
}

export function convertCurrency(
  amount: number,
  fromRate: number,
  toRate: number
): number {
  return (amount / fromRate) * toRate;
}