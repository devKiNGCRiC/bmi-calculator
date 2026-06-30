import { View, Text,  StyleSheet } from 'react-native'

type BarGuageProps ={ 
    bmi: number;
};

export default function BarGauge({ bmi }: BarGuageProps){
    //Define our display range
    const MIN_BMI = 15;
    const MAX_BMI = 40;

    //Calculate marker position as a percentage (0-100)
    const rawPercent = ((bmi - MIN_BMI) / (MAX_BMI - MIN_BMI)) * 100;

    //Clamp between 0 and 100 so extreme values don't break layout
    const markerPercent = Math.min(Math.max(rawPercent, 0), 100);

    return(
        <View style={styles.wrapper}>
            {/* The colored segmented bar */}
            <View style={styles.barContainer}>
                <View style={[styles.segment, {backgroundColor: '#3b82f6', flex: 3.5}]} />
                <View style={[styles.segment, {backgroundColor: '#22c55e', flex: 6.5}]} />
                <View style={[styles.segment, {backgroundColor: '#f59e0b', flex: 5}]} />
                <View style={[styles.segment, {backgroundColor: '#ef4444', flex: 10}]} />

                {/* The Marker showing current BMI position */}
                <View style={[styles.marker ,{ left: `${markerPercent}%`}]} />
            </View>

            {/* Labels under the bar */}
            <View style={styles.labelsRow}>
                <Text style= {styles.labelText}>15</Text>
                <Text style= {styles.labelText}>18.5</Text>
                <Text style= {styles.labelText}>25</Text>
                <Text style= {styles.labelText}>30</Text>
                <Text style= {styles.labelText}>40+</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 20,
        width: '100%',
    },
    barContainer: {
        flexDirection: 'row',
        height: 16,
        borderRadius: 8,
        overflow: 'visible', //so marker can stick out above/below 
        position: 'relative',
    },
    segment: {
        height: 16,
    },
    marker: {
        position: 'absolute',
        top: -6,
        width: 4,
        height: 28,
        backgroundColor: '#ffffff',
        borderRadius: 2,
        marginLeft: -2, //center the marker on its position
        shadowColor: '#000',
        shadowOffset: { width: 0 , height: 2},
        shadowOpacity: 0.5,
        shadowRadius: 4,
    },
    labelsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    labelText:{
        color: '#666',
        fontSize: 12,
    },
});