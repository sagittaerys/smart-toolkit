import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Spacing, FontSize, Radius } from "../../constants/theme";
import { units, unitCategories, UnitCategory } from "../../constants/units";
import { convert } from "../../lib/conversion";

export default function UnitConverterScreen() {
  const [category, setCategory] = useState<UnitCategory>("Length");
  const [fromUnit, setFromUnit] = useState("Meters");
  const [toUnit, setToUnit] = useState("Kilometers");
  const [inputValue, setInputValue] = useState("");

  const availableUnits = units[category];
  const result = inputValue
    ? convert(parseFloat(inputValue), fromUnit, toUnit, category)
    : null;

  function handleCategoryChange(cat: UnitCategory) {
    setCategory(cat);
    setFromUnit(units[cat][0]);
    setToUnit(units[cat][1]);
    setInputValue("");
  }

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.container}>
        <Text style={s.title}>Unit Converter</Text>

        {/* category selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.categoryRow}
        >
          {unitCategories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => handleCategoryChange(cat)}
              style={[s.categoryChip, category === cat && s.categoryChipActive]}
            >
              <Text
                style={[
                  s.categoryText,
                  category === cat && s.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* input */}
        <View style={s.card}>
          <Text style={s.label}>From</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={s.unitRow}
          >
            {availableUnits.map((u) => (
              <TouchableOpacity
                key={u}
                onPress={() => setFromUnit(u)}
                style={[s.unitChip, fromUnit === u && s.unitChipActive]}
              >
                <Text style={[s.unitText, fromUnit === u && s.unitTextActive]}>
                  {u}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TextInput
            style={s.input}
            keyboardType="numeric"
            placeholder="Enter value"
            placeholderTextColor={Colors.inkMuted}
            value={inputValue}
            onChangeText={setInputValue}
          />
        </View>

        {/* output */}
        <View style={s.card}>
          <Text style={s.label}>To</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={s.unitRow}
          >
            {availableUnits.map((u) => (
              <TouchableOpacity
                key={u}
                onPress={() => setToUnit(u)}
                style={[s.unitChip, toUnit === u && s.unitChipActive]}
              >
                <Text style={[s.unitText, toUnit === u && s.unitTextActive]}>
                  {u}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={s.resultBox}>
            <Text style={s.resultText}>
              {result !== null ? result.toFixed(4) : "—"}
            </Text>
            <Text style={s.resultUnit}>{toUnit}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  container: { padding: Spacing.md, gap: Spacing.md },
  title: { color: Colors.inkPrimary, fontSize: FontSize.xl, fontWeight: "700" },
  categoryRow: { flexGrow: 0, marginBottom: Spacing.sm },
  categoryChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.brand,
    borderColor: Colors.brand,
  },
  categoryText: {
    color: Colors.inkSecondary,
    fontSize: FontSize.sm,
    fontWeight: "500",
  },
  categoryTextActive: { color: Colors.inkPrimary },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  label: {
    color: Colors.inkSecondary,
    fontSize: FontSize.sm,
    fontWeight: "600",
  },
  unitRow: { flexGrow: 0 },
  unitChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceRaised,
    marginRight: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  unitChipActive: {
    backgroundColor: Colors.brandMuted,
    borderColor: Colors.brand,
  },
  unitText: { color: Colors.inkMuted, fontSize: FontSize.xs },
  unitTextActive: { color: Colors.brand, fontWeight: "600" },
  input: {
    backgroundColor: Colors.surfaceRaised,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.inkPrimary,
    fontSize: FontSize.lg,
    padding: Spacing.md,
  },
  resultBox: {
    backgroundColor: Colors.surfaceRaised,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    flexDirection: "row",
    alignItems: "baseline",
    gap: Spacing.sm,
  },
  resultText: { color: Colors.brand, fontSize: FontSize.xl, fontWeight: "700" },
  resultUnit: { color: Colors.inkSecondary, fontSize: FontSize.md },
});
