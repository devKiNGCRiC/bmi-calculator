import { useState } from 'react'
import { View , Text , StyleSheet, TextInput, TouchableOpacity , ScrollView } from 'react-native'
import BarGauge from '../../components/BarGauge';
import CurveGauge from '../../components/CurveGauge';

type BMIResult = {
  value: number;
  category: string;
  color: string;
}

export default function HomeScreen(){
  const [unit, setUnit] = useState('metric');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmiResult, setBmiResult] = useState<BMIResult | null>(null); // null = no result yet
  const [gaugeType,  setGaugeType] = useState<'bar' | 'curve'>('curve');

  const calculateBMI = () => {
    //Convert input strings to numbers
    const h = parseFloat(height);
    const w = parseFloat(weight);

    //Basic validation
    if(!h || !w || h <= 0 || w <= 0){
      alert('Please enter valid height and weight');
      return;
    }

    let bmi: number;

    if(unit === 'metric'){
      const heightInMeters = h / 100;
      bmi = w / (heightInMeters * heightInMeters);
    }else{
      bmi = (w / (h * h)) * 703;
    }

    bmi = parseFloat(bmi.toFixed(1)); //round to 1 decimal place

    setBmiResult({
      value: bmi,
      category: getCategory(bmi),
      color: getColor(bmi),
    });
  };

  const getCategory = (bmi: number) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal'; 
    if (bmi < 30) return 'Overweight';
    return 'Obese'
  };

  const getColor = (bmi: number) => {
    if (bmi < 18.5) return '#3b82f6' //Blue
    if (bmi < 25) return  '#22c55e' //Green
    if (bmi < 30) return '#f59e0b' //Orange
    return '#ef4444' //Red
  }

  return(
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle = {styles.container}
      keyboardShouldPersistTaps = "handled"
    >
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
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
      />
      {/* Weight Input */}
      <Text style={styles.label}>Weight ({unit === 'metric' ? 'kg' : 'lbs'})</Text>
      <TextInput
        style={styles.input}
        placeholder={unit === 'metric' ? 'e.g. 65' : 'e.g. 142'}
        placeholderTextColor= "#666"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />
      {/* Calculate Button */}
      <TouchableOpacity style={styles.calculateButton} onPress={calculateBMI}>
        <Text style={styles.calculateButtonText}>Calculate BMI</Text>
      </TouchableOpacity>

      {/* Result Card - Only shows if bmiResult exists */}
      {bmiResult && (
        <View style={[styles.resultCard, {borderColor: bmiResult.color }]}>
          <Text style={styles.resultLabel}>Your BMI</Text>
          <Text style={[styles.resultValue, { color: bmiResult.color }]}>
            {bmiResult.value}
          </Text>
          <Text style={[styles.resultCategory, { color: bmiResult.color }]}>
            {bmiResult.category}
          </Text>

          
          {/* Gauge Display */}
          {gaugeType === 'curve' 
            ? <CurveGauge bmi={bmiResult.value} />
            : <BarGauge bmi={bmiResult.value} />
          }

          {/* Gauge Toggle */}
          <View style={styles.gaugeToggleContainer}>
            <TouchableOpacity
              style={[styles.gaugeToggleButton, gaugeType === 'curve' && styles.gaugeToggleActive]}
              onPress={() => setGaugeType('curve')}
            >
              <Text style={[styles.gaugeToggleText, gaugeType === 'curve' && styles.gaugeToggleTextActive]}>
                Arc
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gaugeToggleButton, gaugeType === 'bar' && styles.gaugeToggleActive]}
              onPress={() => setGaugeType('bar')}
            >
              <Text style={[styles.gaugeToggleText, gaugeType === 'bar' && styles.gaugeToggleTextActive]}>
                Bar
              </Text>
            </TouchableOpacity>
          </View> 
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView:{
    flex:1,
    backgroundColor: '#0f0f0f',
  },
  container: {
    paddingTop: 80,
    paddingHorizontal: 24,
    paddingBottom: 60, //breathing room at the bottom
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
    borderColor: '#2a2a2a',
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
  resultCard:{
    backgroundColor: '#1a1a1a',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    marginTop: 28,
    borderWidth: 2,
  },
  resultLabel:{
    color: '#888',
    fontSize: 14,
  },
  resultValue:{
    fontSize: 48,
    fontWeight: 'bold',
    marginTop: 8,
  },
  resultCategory:{
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
  },
  gaugeToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#0f0f0f',
    borderRadius: 10,
    padding: 3,
    marginTop: 16,
  },
  gaugeToggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  gaugeToggleActive: {
    backgroundColor: '#2a2a2a',
  },
  gaugeToggleText: {
    color: '#555',
    fontSize: 13,
    fontWeight: '600',
  },
  gaugeToggleTextActive: {
    color: '#ffffff'
  }
});