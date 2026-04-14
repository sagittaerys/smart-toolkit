import { useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Spacing, FontSize, Radius } from "../../constants/theme";
import { fetchRates, convertCurrency } from "../../lib/currency";
import { popularCurrencies } from "../../constants/currencies";

export default function CurrencyScreen() {
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("NGN");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    loadRates();
  }, [fromCurrency]);

  async function loadRates() {
    setLoading(true);
    const data = await fetchRates(fromCurrency);
    setRates(data);
    setLastUpdated(new Date().toLocaleTimeString());
    setLoading(false);
  }

  const result =
    rates && amount
      ? convertCurrency(parseFloat(amount), 1, rates[toCurrency])
      : null;

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.container}>
        <View style={s.header}>
          <Text style={s.title}>Currency</Text>
          {lastUpdated && (
            <View style={s.chip}>
              <Text style={s.chipText}>Updated {lastUpdated}</Text>
            </View>
          )}
        </View>

        {/* From Currency */}
        <View style={s.card}>
          <Text style={s.label}>From</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.currencyRow}>
            {popularCurrencies.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setFromCurrency(c)}
                style={[s.currencyChip, fromCurrency === c && s.currencyChipActive]}
              >
                <Text style={[s.currencyText, fromCurrency === c && s.currencyTextActive]}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TextInput
            style={s.input}
            keyboardType="numeric"
            placeholder="Enter amount"
            placeholderTextColor={Colors.inkMuted}
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        {/* To Currency */}
        <View style={s.card}>
          <Text style={s.label}>To</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.currencyRow}>
            {popularCurrencies.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setToCurrency(c)}
                style={[s.currencyChip, toCurrency === c && s.currencyChipActive]}
              >
                <Text style={[s.currencyText, toCurrency === c && s.currencyTextActive]}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={s.resultBox}>
            {loading ? (
              <ActivityIndicator color={Colors.brand} />
            ) : (
              <>
                <Text style={s.resultText}>
                  {result !== null ? result.toFixed(2) : "—"}
                </Text>
                <Text style={s.resultUnit}>{toCurrency}</Text>
              </>
            )}
          </View>
        </View>

        {/* Rate info */}
        {rates && !loading && (
          <View style={s.rateCard}>
            <Text style={s.rateText}>
              1 {fromCurrency} = {rates[toCurrency]?.toFixed(4)} {toCurrency}
            </Text>
          </View>
        )}

        {/* Refresh */}
        <TouchableOpacity style={s.refreshBtn} onPress={loadRates}>
          <Text style={s.refreshText}>↻ Refresh Rates</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  container: { padding: Spacing.md, gap: Spacing.md },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { color: Colors.inkPrimary, fontSize: FontSize.xl, fontWeight: "700" },
  chip: {
    backgroundColor: Colors.surfaceRaised, borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm, paddingVertical: 4,
    borderWidth: 1, borderColor: Colors.border,
  },
  chipText: { color: Colors.inkMuted, fontSize: FontSize.xs },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, gap: Spacing.sm,
  },
  label: { color: Colors.inkSecondary, fontSize: FontSize.sm, fontWeight: "600" },
  currencyRow: { flexGrow: 0 },
  currencyChip: {
    paddingHorizontal: Spacing.sm, paddingVertical: 4,
    borderRadius: Radius.sm, backgroundColor: Colors.surfaceRaised,
    marginRight: Spacing.xs, borderWidth: 1, borderColor: Colors.border,
  },
  currencyChipActive: { backgroundColor: Colors.brandMuted, borderColor: Colors.brand },
  currencyText: { color: Colors.inkMuted, fontSize: FontSize.xs, fontWeight: "500" },
  currencyTextActive: { color: Colors.brand, fontWeight: "700" },
  input: {
    backgroundColor: Colors.surfaceRaised, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border, color: Colors.inkPrimary,
    fontSize: FontSize.lg, padding: Spacing.md,
  },
  resultBox: {
    backgroundColor: Colors.surfaceRaised, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.md, flexDirection: "row",
    alignItems: "baseline", gap: Spacing.sm, minHeight: 56,
    justifyContent: "center",
  },
  resultText: { color: Colors.brand, fontSize: FontSize.xl, fontWeight: "700" },
  resultUnit: { color: Colors.inkSecondary, fontSize: FontSize.md },
  rateCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.md,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.border,
    alignItems: "center",
  },
  rateText: { color: Colors.inkSecondary, fontSize: FontSize.sm },
  refreshBtn: {
    backgroundColor: Colors.surfaceRaised, borderRadius: Radius.md,
    padding: Spacing.md, alignItems: "center",
    borderWidth: 1, borderColor: Colors.border,
  },
  refreshText: { color: Colors.brand, fontSize: FontSize.sm, fontWeight: "600" },
});