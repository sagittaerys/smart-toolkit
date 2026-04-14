import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Spacing, FontSize, Radius } from "../../constants/theme";
import { calculateBMI, getBMICategory, getBMIColor, convertToMetric } from "../../lib/bmi";

type Unit = "metric" | "imperial";

export default function BMIScreen() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [weight, setWeight] = useState("");
  const [heightM, setHeightM] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");

  function getBMI(): number | null {
    if (unit === "metric") {
      const w = parseFloat(weight);
      const h = parseFloat(heightM);
      if (!w || !h) return null;
      return calculateBMI(w, h);
    } else {
      const w = parseFloat(weight);
      const ft = parseFloat(heightFt) || 0;
      const inch = parseFloat(heightIn) || 0;
      if (!w || (!ft && !inch)) return null;
      const { weight: wKg, height: hM } = convertToMetric(w, ft, inch);
      return calculateBMI(wKg, hM);
    }
  }

  const bmi = getBMI();
  const category = bmi ? getBMICategory(bmi) : null;
  const color = category ? getBMIColor(category) : Colors.inkMuted;

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.container}>
        <Text style={s.title}>BMI Calculator</Text>

        {/* Unit Toggle */}
        <View style={s.toggle}>
          {(["metric", "imperial"] as Unit[]).map((u) => (
            <TouchableOpacity
              key={u}
              onPress={() => { setUnit(u); setWeight(""); setHeightM(""); setHeightFt(""); setHeightIn(""); }}
              style={[s.toggleBtn, unit === u && s.toggleBtnActive]}
            >
              <Text style={[s.toggleText, unit === u && s.toggleTextActive]}>
                {u.charAt(0).toUpperCase() + u.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Inputs */}
        <View style={s.card}>
          <Text style={s.label}>
            Weight ({unit === "metric" ? "kg" : "lbs"})
          </Text>
          <TextInput
            style={s.input}
            keyboardType="numeric"
            placeholder={unit === "metric" ? "e.g. 70" : "e.g. 154"}
            placeholderTextColor={Colors.inkMuted}
            value={weight}
            onChangeText={setWeight}
          />

          <Text style={s.label}>
            Height ({unit === "metric" ? "meters" : "ft / in"})
          </Text>
          {unit === "metric" ? (
            <TextInput
              style={s.input}
              keyboardType="numeric"
              placeholder="e.g. 1.75"
              placeholderTextColor={Colors.inkMuted}
              value={heightM}
              onChangeText={setHeightM}
            />
          ) : (
            <View style={s.row}>
              <TextInput
                style={[s.input, { flex: 1 }]}
                keyboardType="numeric"
                placeholder="ft"
                placeholderTextColor={Colors.inkMuted}
                value={heightFt}
                onChangeText={setHeightFt}
              />
              <TextInput
                style={[s.input, { flex: 1 }]}
                keyboardType="numeric"
                placeholder="in"
                placeholderTextColor={Colors.inkMuted}
                value={heightIn}
                onChangeText={setHeightIn}
              />
            </View>
          )}
        </View>

        {/* Result */}
        {bmi && category && (
          <View style={[s.card, s.resultCard, { borderColor: color }]}>
            <Text style={s.resultLabel}>Your BMI</Text>
            <Text style={[s.bmiValue, { color }]}>{bmi.toFixed(1)}</Text>
            <View style={[s.badge, { backgroundColor: color + "26", borderColor: color + "60" }]}>
              <Text style={[s.badgeText, { color }]}>{category}</Text>
            </View>
            <View style={s.scale}>
              {["Underweight", "Normal", "Overweight", "Obese"].map((c) => (
                <View key={c} style={s.scaleItem}>
                  <View style={[s.scaleDot, { backgroundColor: getBMIColor(c as any), opacity: category === c ? 1 : 0.3 }]} />
                  <Text style={[s.scaleLabel, { opacity: category === c ? 1 : 0.4 }]}>{c}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  container: { padding: Spacing.md, gap: Spacing.md },
  title: { color: Colors.inkPrimary, fontSize: FontSize.xl, fontWeight: "700" },
  toggle: {
    flexDirection: "row", backgroundColor: Colors.surface,
    borderRadius: Radius.md, padding: 4, borderWidth: 1, borderColor: Colors.border,
  },
  toggleBtn: { flex: 1, paddingVertical: Spacing.sm, borderRadius: Radius.sm, alignItems: "center" },
  toggleBtnActive: { backgroundColor: Colors.brand },
  toggleText: { color: Colors.inkMuted, fontSize: FontSize.sm, fontWeight: "600" },
  toggleTextActive: { color: Colors.inkPrimary },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, gap: Spacing.sm,
  },
  label: { color: Colors.inkSecondary, fontSize: FontSize.sm, fontWeight: "600" },
  input: {
    backgroundColor: Colors.surfaceRaised, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border, color: Colors.inkPrimary,
    fontSize: FontSize.md, padding: Spacing.md,
  },
  row: { flexDirection: "row", gap: Spacing.sm },
  resultCard: { alignItems: "center", gap: Spacing.md },
  resultLabel: { color: Colors.inkSecondary, fontSize: FontSize.sm, fontWeight: "600" },
  bmiValue: { fontSize: 56, fontWeight: "800" },
  badge: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
    borderRadius: Radius.full, borderWidth: 1,
  },
  badgeText: { fontSize: FontSize.sm, fontWeight: "700", letterSpacing: 0.5 },
  scale: { flexDirection: "row", gap: Spacing.md, flexWrap: "wrap", justifyContent: "center" },
  scaleItem: { alignItems: "center", gap: 4 },
  scaleDot: { width: 10, height: 10, borderRadius: 5 },
  scaleLabel: { color: Colors.inkSecondary, fontSize: FontSize.xs },
});