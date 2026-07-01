import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import healthTips from '../constants/healthTips';

type HealthTipsProps = {
  category: string;
  color: string;
};

export default function HealthTips({ category, color }: HealthTipsProps) {
  const [expanded, setExpanded] = useState(false);

  const data = healthTips[category];

  // Safety check — if category doesn't match, render nothing
  if (!data) return null;

  return (
    <View style={[styles.card, { borderColor: color }]}>

      {/* Tappable header row */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.headerIcon}>💡</Text>
          <Text style={styles.headerTitle}>Health Tips</Text>
        </View>
        <Text style={[styles.chevron, { color: color }]}>
          {expanded ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {/* Expandable content */}
      {expanded && (
        <View style={styles.content}>
          {/* Summary line */}
          <Text style={styles.summary}>{data.summary}</Text>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: color }]} />

          {/* Individual tips */}
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
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIcon: {
    fontSize: 18,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  chevron: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  summary: {
    color: '#aaa',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 14,
  },
  divider: {
    height: 1,
    opacity: 0.3,
    marginBottom: 14,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 10,
  },
  tipIcon: {
    fontSize: 18,
    marginTop: 1,
  },
  tipText: {
    color: '#ccc',
    fontSize: 13,
    lineHeight: 20,
    flex: 1,
  },
});