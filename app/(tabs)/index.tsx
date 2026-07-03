import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BarGauge from "../../components/BarGauge";
import CurveGauge from "../../components/CurveGauge";
import HealthTips from "../../components/HealthTips";
import { getBmiInfo } from '../../constants/theme';

type BMIResult = {
  value: number;
  category: string;
  color: string;
};

type HistoryEntry = {
  id: string;
  bmi: number;
  category: string;
  color: string;
  unit: string;
  date: string; // human-readable date string
};

export default function HomeScreen() {
  const [unit, setUnit] = useState("metric");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmiResult, setBmiResult] = useState<BMIResult | null>(null); // null = no result yet
  const [gaugeType, setGaugeType] = useState<"bar" | "curve">("curve");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [heightFocused, setHeightFocused] = useState(false);
  const [weightFocused, setWeightFocused] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];

  const STORAGE_KEY = "bmi_history";
  const canCalculate = height.trim().length > 0 && weight.trim().length > 0;

  //Load history from device when app opens

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.log("Failed to load history:", error);
    }
  };

  const saveToHistory = async (entry: HistoryEntry) => {
    try {
      const updated = [entry, ...history]; //new entry goes to the top
      setHistory(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.log("Failed to Save History: ", error);
    }
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setHistory([]);
    } catch (error) {
      console.log("Failed to clear history:", error);
    }
  };

  const calculateBMI = () => {
    //Convert input strings to numbers
    const h = parseFloat(height);
    const w = parseFloat(weight);

    //Basic validation
    if (!h || !w || h <= 0 || w <= 0) {
      alert("Please enter valid height and weight");
      return;
    }

    let bmi: number;

    if (unit === "metric") {
      const heightInMeters = h / 100;
      bmi = w / (heightInMeters * heightInMeters);
    } else {
      bmi = (w / (h * h)) * 703;
    }

    bmi = parseFloat(bmi.toFixed(1)); //round to 1 decimal place

    const info = getBmiInfo(bmi);
    const result = {
      value: bmi,
      category: info.category,
      color: info.color,
    };

    setBmiResult(result);

    // Reset animation values first
    fadeAnim.setValue(0);
    slideAnim.setValue(30);

    // Run both animations simultaneously
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, // fade from 0 to 1 (invisible to visible)
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0, // slide from 30px below to 0 (natural position)
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    //Save to history
    const entry: HistoryEntry = {
      id: Date.now().toString(), //unique ID using timestamp
      bmi: result.value,
      category: result.category,
      color: result.color,
      unit: unit,
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    saveToHistory(entry);
  };

  const getCategorySummary = (category: string) => {
    switch (category) {
      case "Underweight":
        return "You are below the healthy range. Focus on gradual, consistent weight gain.";
      case "Normal":
        return "You are in a healthy range. Keep the habits that are working.";
      case "Overweight":
        return "You are slightly above the healthy range. Small adjustments can help.";
      case "Obese":
        return "You are above the healthy range. A steady, supported plan is best.";
      default:
        return "Check your inputs to see your BMI result.";
    }
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.backgroundGlowTop} />
      <View style={styles.backgroundGlowBottom} />

      {/* Hero */}
      <View style={styles.heroCard}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>Body health tracker</Text>
        </View>
        <Text style={styles.headerTitle}>BMI Calculator</Text>
        <Text style={styles.heroCopy}>
          Measure, compare, and save your progress with a cleaner flow and a
          more readable result.
        </Text>

        <View style={styles.heroStatsRow}>
          <View style={styles.heroStatCard}>
            <Text style={styles.heroStatValue}>4</Text>
            <Text style={styles.heroStatLabel}>BMI bands</Text>
          </View>
          <View style={styles.heroStatCard}>
            <Text style={styles.heroStatValue}>2</Text>
            <Text style={styles.heroStatLabel}>unit systems</Text>
          </View>
          <View style={styles.heroStatCard}>
            <Text style={styles.heroStatValue}>Saved</Text>
            <Text style={styles.heroStatLabel}>history entries</Text>
          </View>
        </View>
      </View>

      <View style={styles.panel}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Calculate</Text>
          <Text style={styles.sectionSubtitle}>
            Enter your details to see your score.
          </Text>
        </View>

        {/* Unit Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              unit === "metric" && styles.toggleActive,
            ]}
            onPress={() => setUnit("metric")}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.toggleText,
                unit === "metric" && styles.toggleTextActive,
              ]}
            >
              Metric
            </Text>
            <Text
              style={[
                styles.toggleCaption,
                unit === "metric" && styles.toggleCaptionActive,
              ]}
            >
              kg / cm
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              unit === "imperial" && styles.toggleActive,
            ]}
            onPress={() => setUnit("imperial")}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.toggleText,
                unit === "imperial" && styles.toggleTextActive,
              ]}
            >
              Imperial
            </Text>
            <Text
              style={[
                styles.toggleCaption,
                unit === "imperial" && styles.toggleCaptionActive,
              ]}
            >
              lb / in
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.fieldHeader}>
            <Text style={styles.label}>Height</Text>
            <Text style={styles.fieldHint}>
              {unit === "metric" ? "cm" : "inches"}
            </Text>
          </View>
          <TextInput
            style={[styles.input, heightFocused && styles.inputFocused]}
            placeholder={unit === "metric" ? "e.g. 170" : "e.g. 67"}
            placeholderTextColor="#7a828a"
            keyboardType="numeric"
            value={height}
            onChangeText={setHeight}
            onFocus={() => setHeightFocused(true)}
            onBlur={() => setHeightFocused(false)}
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.fieldHeader}>
            <Text style={styles.label}>Weight</Text>
            <Text style={styles.fieldHint}>
              {unit === "metric" ? "kg" : "lbs"}
            </Text>
          </View>
          <TextInput
            style={[styles.input, weightFocused && styles.inputFocused]}
            placeholder={unit === "metric" ? "e.g. 65" : "e.g. 142"}
            placeholderTextColor="#7a828a"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
            onFocus={() => setWeightFocused(true)}
            onBlur={() => setWeightFocused(false)}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.calculateButton,
            !canCalculate && styles.calculateButtonDisabled,
          ]}
          onPress={calculateBMI}
          disabled={!canCalculate}
          activeOpacity={0.9}
        >
          <Text style={styles.calculateButtonText}>Calculate BMI</Text>
        </TouchableOpacity>
      </View>

      {/* Result Card - Only shows if bmiResult exists */}
      {bmiResult && (
        <Animated.View
          style={[
            styles.resultCard,
            { borderColor: bmiResult.color },
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View
            style={[styles.resultAccent, { backgroundColor: bmiResult.color }]}
          />
          <View style={styles.resultHeader}>
            <Text style={styles.resultLabel}>Your BMI</Text>
            <View style={[styles.resultChip, { borderColor: bmiResult.color }]}>
              <Text style={[styles.resultChipText, { color: bmiResult.color }]}>
                {bmiResult.category}
              </Text>
            </View>
          </View>
          <Text style={[styles.resultValue, { color: bmiResult.color }]}>
            {bmiResult.value}
          </Text>
          <Text style={styles.resultSummary}>
            {getCategorySummary(bmiResult.category)}
          </Text>

          <View style={styles.gaugeShell}>
            <View style={styles.gaugeToggleContainer}>
              <TouchableOpacity
                style={[
                  styles.gaugeToggleButton,
                  gaugeType === "curve" && styles.gaugeToggleActive,
                ]}
                onPress={() => setGaugeType("curve")}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.gaugeToggleText,
                    gaugeType === "curve" && styles.gaugeToggleTextActive,
                  ]}
                >
                  Arc
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.gaugeToggleButton,
                  gaugeType === "bar" && styles.gaugeToggleActive,
                ]}
                onPress={() => setGaugeType("bar")}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.gaugeToggleText,
                    gaugeType === "bar" && styles.gaugeToggleTextActive,
                  ]}
                >
                  Bar
                </Text>
              </TouchableOpacity>
            </View>

            {gaugeType === "curve" ? (
              <CurveGauge bmi={bmiResult.value} />
            ) : (
              <BarGauge bmi={bmiResult.value} />
            )}
          </View>

          <HealthTips category={bmiResult.category} color={bmiResult.color} />
        </Animated.View>
      )}

      {/* History Section */}
      {history.length > 0 && (
        <View style={styles.historyContainer}>
          {/* Header row */}
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>History</Text>
            <TouchableOpacity onPress={clearHistory}>
              <Text style={styles.clearButton}>Clear All</Text>
            </TouchableOpacity>
          </View>

          {/*History entries */}
          {history.map((entry) => (
            <View key={entry.id} style={styles.historyCard}>
              {/* Left side - BMI value + category */}
              <View style={styles.historyLeft}>
                <Text style={[styles.historyBmi, { color: entry.color }]}>
                  {entry.bmi}
                </Text>
                <Text style={[styles.historyCategory, { color: entry.color }]}>
                  {entry.category}
                </Text>
              </View>

              {/* Right side - unit + date  */}
              <View style={styles.historyRight}>
                <Text style={styles.historyUnit}>
                  {entry.unit === "metric" ? "kg/cm" : "lbs/in"}
                </Text>
                <Text style={styles.historyDate}>{entry.date}</Text>
              </View>

              {/* Left color accent bar */}
              <View
                style={[styles.historyAccent, { backgroundColor: entry.color }]}
              />
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#0b1220",
  },
  container: {
    paddingTop: 28,
    paddingHorizontal: 24,
    paddingBottom: 60, //breathing room at the bottom
  },
  backgroundGlowTop: {
    position: "absolute",
    top: -40,
    right: -60,
    width: 180,
    height: 180,
    borderRadius: 180,
    backgroundColor: "rgba(59, 130, 246, 0.18)",
  },
  backgroundGlowBottom: {
    position: "absolute",
    bottom: 320,
    left: -70,
    width: 220,
    height: 220,
    borderRadius: 220,
    backgroundColor: "rgba(34, 197, 94, 0.09)",
  },
  heroCard: {
    backgroundColor: "rgba(12, 17, 27, 0.92)",
    borderColor: "rgba(148, 163, 184, 0.12)",
    borderWidth: 1,
    borderRadius: 28,
    padding: 22,
    marginTop: 12,
    marginBottom: 18,
  },
  heroBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(59, 130, 246, 0.16)",
    borderColor: "rgba(59, 130, 246, 0.28)",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 14,
  },
  heroBadgeText: {
    color: "#bfdbfe",
    fontSize: 12,
    fontWeight: "500",
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.7,
    lineHeight: 36,
  },
  heroCopy: {
    color: "#b7c0cc",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  heroStatsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },
  heroStatCard: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.82)",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.08)",
  },
  heroStatValue: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
  },
  heroStatLabel: {
    color: "#8d98a8",
    fontSize: 12,
    marginTop: 4,
  },
  panel: {
    backgroundColor: "#101826",
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
  },
  sectionSubtitle: {
    color: "#8d98a8",
    fontSize: 13,
    marginTop: 4,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#0b1220",
    borderRadius: 18,
    padding: 4,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.10)",
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  toggleActive: {
    backgroundColor: "rgba(59, 130, 246, 0.18)",
  },
  toggleText: {
    color: "#93a0b3",
    fontWeight: "600",
    fontSize: 14,
  },
  toggleCaption: {
    color: "#607086",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "600",
  },
  toggleTextActive: {
    color: "#ffffff",
  },
  toggleCaptionActive: {
    color: "#bfdbfe",
  },
  inputGroup: {
    marginBottom: 16,
  },
  fieldHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    color: "#d5dbe4",
    fontSize: 14,
    fontWeight: "700",
  },
  fieldHint: {
    color: "#7f8a99",
    fontSize: 12,
  },
  input: {
    backgroundColor: "#0b1220",
    color: "#ffffff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    borderWidth: 1.25,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },
  inputFocused: {
    borderColor: "rgba(59, 130, 246, 0.9)",
    backgroundColor: "#0d1728",
  },
  calculateButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8, // Android shadow
  },
  calculateButtonDisabled: {
    opacity: 0.45,
  },
  calculateButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  resultCard: {
    backgroundColor: "#101826",
    borderRadius: 28,
    padding: 22,
    marginTop: 18,
    borderWidth: 1.5,
    borderColor: "rgba(148, 163, 184, 0.10)",
    overflow: "hidden",
  },
  resultAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    height: 4,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultLabel: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "600",
  },
  resultChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  resultChipText: {
    fontSize: 12,
    fontWeight: "700",
  },
  resultValue: {
    fontSize: 64,
    fontWeight: "800",
    marginTop: 12,
    letterSpacing: -2.5,
    lineHeight: 68,
  },
  resultSummary: {
    color: "#c9d2dd",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  gaugeShell: {
    backgroundColor: "#0b1220",
    borderRadius: 20,
    padding: 16,
    marginTop: 18,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.08)",
  },
  gaugeToggleContainer: {
    flexDirection: "row",
    backgroundColor: "#111a2b",
    borderRadius: 12,
    padding: 3,
    marginBottom: 6,
  },
  gaugeToggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  gaugeToggleActive: {
    backgroundColor: "#2a2a2a",
  },
  gaugeToggleText: {
    color: "#7d8a9b",
    fontSize: 13,
    fontWeight: "600",
  },
  gaugeToggleTextActive: {
    color: "#ffffff",
  },
  historyContainer: {
    marginTop: 28,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  historyTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
  },
  clearButton: {
    color: "#fda4af",
    fontSize: 14,
    fontWeight: "700",
  },
  historyCard: {
    backgroundColor: "#101826",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.08)",
  },
  historyLeft: {
    flex: 1,
  },
  historyBmi: {
    fontSize: 24,
    fontWeight: "800",
  },
  historyCategory: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },
  historyRight: {
    alignItems: "flex-end",
  },
  historyUnit: {
    color: "#94a3b8",
    fontSize: 12,
  },
  historyDate: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 4,
  },
  historyAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
});
