// HealthTips.tsx
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import healthTips from "../constants/healthTips";
import { colors, radius, spacing } from "../constants/theme";

type HealthTipsProps = {
  category: string;
  color: string;
};

export default function HealthTips({ category, color }: HealthTipsProps) {
  const [expanded, setExpanded] = useState(false);

  const data = healthTips[category];

  if (!data) return null;

  return (
    <View style={[styles.card, { borderColor: color }]}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Toggle health tips"
      >
        <View style={styles.headerLeft}>
          <Ionicons name="bulb-outline" size={18} color={colors.primary} />
          <Text style={styles.headerTitle}>Health Tips</Text>
        </View>
        <Feather
          name={expanded ? "chevron-up" : "chevron-down"}
          size={18}
          color={color}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          <Text style={styles.summary}>{data.summary}</Text>

          <View style={[styles.divider, { backgroundColor: color }]} />

          {data.tips.map((tip, index) => (
            <View key={index} style={styles.tipRow}>
              <Text style={styles.tipIcon}>{tip.icon}</Text>
              <Text style={styles.tipText}>{tip.text}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bg,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.lg,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "800",
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  summary: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: spacing.md + 2,
  },
  divider: {
    height: 1,
    opacity: 0.25,
    marginBottom: spacing.md + 2,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.md,
    gap: 10,
  },
  tipIcon: {
    fontSize: 18,
    marginTop: 1,
  },
  tipText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    flex: 1,
  },
});