import { useState } from 'react'
import { View , Text , StyleSheet, TextInput, TouchableOpacity } from 'react-native'

export default function HomeScreen(){
  const [unit, setUnit] = useState('metric');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  return(
    <View style={styles.container}>
      <Text style={styles.title}>BMI Calculator</Text>

      {/* Unit Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, unit === 'metric' && styles.toggleActive]}
          onPress={() => setUnit('metric')}
        >
          <Text style={[styles.toggleText, unit === 'metric' && styles.toggleTextActive]}>
            Metric (kg/cm)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, unit === 'imperial' && styles.toggleActive]}
          onPress={() => setUnit('imperial')}
        >
          <Text style={[styles.toggleText, unit === 'imperial' && styles.toggleTextActive]}>
            Imperial (lb/in)
          </Text>
        </TouchableOpacity>
      </View>
      {/* Height Input */}
      <Text style={styles.label}>Height ({unit === 'metric' ? 'cm' : 'inches'})</Text>
      <TextInput
        style={styles.input}
        placeholder={unit === 'metric' ? 'e.g. 170' : 'e.g. 67'}
        placeholderTextColor= "#666"
        keyboardType='numeric'
        value={height}
        onChangeText={setHeight}
      />
      {/* Weight Input */}
      <Text style={styles.label}>Weight ({unit === 'metric' ? 'kg' : 'lbs'})</Text>
      <TextInput
        style={styles.input}
        placeholder={unit === 'metric' ? 'e.g. 65' : 'e.g. 142'}
        placeholderTextColor= "#666"
        keyboardType='numeric'
        value={weight}
        onChangeText={setWeight}
      />
      {/* Calculate Button */}
      <TouchableOpacity style={styles.calculateButton} onPress={() => console.log('Calculate pressed')}>
        <Text style={styles.calculateButtonText}>Calculate BMI</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#0f0f0f',
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  title:{
    fontSize: 28,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign:'center',
  },
  toggleContainer:{
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 4,
    marginBottom: 30,
  },
  toggleButton:{
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  toggleActive:{
    backgroundColor: '#3b82f6'
  },
  toggleText:{
    color: '#888',
    fontWeight: '600',
  },
  toggleTextActive:{
    color: '#ffffff'
  },
  label:{
    color: '#aaa',
    fontSize: 14,
    marginBottom: 8,
    marginTop: 16,
  },
  input:{
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a"
  },
  calculateButton:{
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 40,
  },
  calculateButtonText:{
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});