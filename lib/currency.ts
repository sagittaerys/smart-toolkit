import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_DURATION = 60 * 60 * 1000;

function cacheKey(base: string) { return `currency_rates_${base}`; }
function cacheTsKey(base: string) { return `currency_rates_ts_${base}`; }

export async function fetchRates(base: string): Promise<Record<string, number> | null> {
  try {
    const cachedTs = await AsyncStorage.getItem(cacheTsKey(base));
    const cachedData = await AsyncStorage.getItem(cacheKey(base));

    if (cachedTs && cachedData) {
      const age = Date.now() - parseInt(cachedTs);
      if (age < CACHE_DURATION) {
        return JSON.parse(cachedData);
      }
    }

    const res = await fetch(`https://open.er-api.com/v6/latest/${base}`);
    const json = await res.json();

    if (json.result === "success") {
      await AsyncStorage.setItem(cacheKey(base), JSON.stringify(json.rates));
      await AsyncStorage.setItem(cacheTsKey(base), Date.now().toString());
      return json.rates;
    }
    return cachedData ? JSON.parse(cachedData) : null;
  } catch {
    const cachedData = await AsyncStorage.getItem(cacheKey(base));
    return cachedData ? JSON.parse(cachedData) : null;
  }
}

export function convertCurrency(amount: number, fromRate: number, toRate: number): number {
  return (amount / fromRate) * toRate;
}