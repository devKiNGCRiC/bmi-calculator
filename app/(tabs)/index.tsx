import { useState , useEffect } from 'react';
import { View , Text , StyleSheet, TextInput, TouchableOpacity , ScrollView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import BarGauge from '../../components/BarGauge';
import CurveGauge from '../../components/CurveGauge';
import HealthTips from '../../components/HealthTips';

type BMIResult = {
  value: number;
  category: string;
  color: string;
}

type HistoryEntry = {
  id: string,
  bmi: number,
  category: string,
  color: string,
  unit: string,
  date: string, // human-readable date string
}

export default function HomeScreen(){
  const [unit, setUnit] = useState('metric');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmiResult, setBmiResult] = useState<BMIResult | null>(null); // null = no result yet
  const [gaugeType,  setGaugeType] = useState<'bar' | 'curve'>('curve');
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const STORAGE_KEY = 'bmi_history';

  //Load history from device when app opens

  useEffect(() =>{
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try{
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if(stored){
        setHistory(JSON.parse(stored))
      }
    }catch(error){
      console.log('Failed to load history:', error)
    }
  }

  const saveToHistory = async (entry: HistoryEntry) => {
    try {
      const updated = [entry, ...history]; //new entry goes to the top
      setHistory(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }catch(error){
      console.log('Failed to Save History: ', error);
    }
  }

  const clearHistory = async () => {
    try{
      await AsyncStorage.removeItem(STORAGE_KEY);
      setHistory([]);
    }catch(error){
      console.log('Failed to clear history:', error);
    }
  }

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

    const result = ({
      value: bmi,
      category: getCategory(bmi),
      color: getColor(bmi),
    });

    setBmiResult(result);

    //Save to history
    const entry: HistoryEntry ={
      id: Date.now().toString(), //unique ID using timestamp
      bmi: result.value,
      category: result.category,
      color: result.color,
      unit: unit,
      date: new Date().toLocaleDateString('en-IN' , {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }), 
    };

    saveToHistory(entry);

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
          {/* Health Tips — add this */}
          <HealthTips
            category={bmiResult.category}
            color={bmiResult.color}
          />
        </View>
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
                <Text style={[styles.historyBmi, {color: entry.color}]}>
                  {entry.bmi}
                </Text>
                <Text style={[styles.historyCategory, { color: entry.color}]}>
                  {entry.category}
                </Text>
              </View>

              {/* Right side - unit + date  */}
              <View style={styles.historyRight}>
                <Text style={styles.historyUnit}>
                  {entry.unit === 'metric' ? 'kg/cm' : 'lbs/in'}
                </Text>
                <Text style={styles.historyDate}>
                  {entry.date}
                </Text>
              </View>

              {/* Left color accent bar */}
              <View style={[styles.historyAccent, { backgroundColor: entry.color}]}/>
            </View>
          ))}
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
  },
  historyContainer: {
  marginTop: 40,
},
historyHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 16,
},
historyTitle: {
  color: '#ffffff',
  fontSize: 20,
  fontWeight: 'bold',
},
clearButton: {
  color: '#ef4444',
  fontSize: 14,
  fontWeight: '600',
},
historyCard: {
  backgroundColor: '#1a1a1a',
  borderRadius: 12,
  padding: 16,
  marginBottom: 10,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  overflow: 'hidden',
  position: 'relative',
},
historyLeft: {
  flex: 1,
},
historyBmi: {
  fontSize: 24,
  fontWeight: 'bold',
},
historyCategory: {
  fontSize: 13,
  fontWeight: '600',
  marginTop: 2,
},
historyRight: {
  alignItems: 'flex-end',
},
historyUnit: {
  color: '#666',
  fontSize: 12,
},
historyDate: {
  color: '#555',
  fontSize: 12,
  marginTop: 4,
},
historyAccent: {
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  width: 4,
},
});