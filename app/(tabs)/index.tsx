import { View , Text , StyleSheet } from 'react-native'

export default function HomeScreen(){
  return(
    <View style={styles.container}>
      <Text style={styles.title}>BMI Calculator</Text>
      <Text style={styles.subtitle}>Build by devKiNGCRiC 💪</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#0f0f0f',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title:{
    fontSize: 32,
    color: '#ffffff',
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
    marginTop: 8
  }
})