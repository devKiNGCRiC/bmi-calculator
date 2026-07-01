import { View , Text, StyleSheet } from 'react-native';
import Svg , { Path, Circle , Line } from 'react-native-svg';

type CurveGaugeProps = {
    bmi: number;
};

export default function CurveGauge({ bmi }: CurveGaugeProps){
    const MIN_BMI = 15;
    const MAX_BMI = 40;

    const SIZE = 240; //width of the SVG canvas
    const RADIUS = 100;
    const CENTER_X = SIZE / 2;
    const CENTER_Y = 130;
    const STROKE_WIDTH = 20;

    // Convert a BMI range boundary into an angle (in degrees, 100 to 0)
    const bmiToAngle = (value: number) => {
        const clamped = Math.min(Math.max(value, MIN_BMI), MAX_BMI);
        const percent = (clamped - MIN_BMI) / (MAX_BMI - MIN_BMI);
        return 180 - percent * 180; //180deg at start, 0deg at end
    };

    //Convert polar coordinates (angle + radius) into x,y points on screen
    const polarToCartesian = (angleDeg: number, radius: number) => {
        const angleRad = (angleDeg * Math.PI) / 180;
        return {
            x: CENTER_X + radius * Math.cos(angleRad),
            y: CENTER_Y - radius * Math.sin(angleRad),
        };
    };

    //Build an SVG arc path string between two angles
    const describeArc = (startAngle: number, endAngle: number) => {
        const start = polarToCartesian(startAngle, RADIUS);
        const end = polarToCartesian(endAngle, RADIUS);
        const largeArcFlag = Math.abs(startAngle - endAngle) > 180 ? 1 : 0;

        return `M ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
    }

    //Define our 4 BMI segments and converts their boundaries to angles
    const segments = [
        {from: 15, to: 18.5, color: '#3b82f6'},
        {from: 18.5, to: 25, color: '#22c55e'},
        {from: 25, to: 30, color: '#f59e0b'},
        {from: 30, to: 40, color: '#ef4444'},
    ];

    // Calculate needle angle based on actual BMI
    const needleAngle = bmiToAngle(bmi);
    const needleTip = polarToCartesian(needleAngle, RADIUS - 30);

    return(
        <View style={styles.wrapper}>
            <Svg width={SIZE} height={150}>
                {/* Draw each colored segment of the arc */}
                {segments.map((seg, index) => (
                    <Path
                        key={index}
                        d={describeArc(bmiToAngle(seg.from), bmiToAngle(seg.to))}
                        stroke={seg.color}
                        strokeWidth={STROKE_WIDTH}
                        fill="none"
                        strokeLinecap="butt"
                    />
                ))}

                {/* The needle */}
                <Line 
                    x1={CENTER_X}
                    y1={CENTER_Y}
                    x2={needleTip.x}
                    y2={needleTip.y}
                    stroke="#ffffff"
                    strokeWidth={3}
                    strokeLinecap="round"
                />

                {/* Center pivot dot */}
                <Circle cx={CENTER_X} cy={CENTER_Y} r={6} fill="#ffffff" />
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        alignItems: 'center',
        marginTop: 20,
    },
});