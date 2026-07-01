type Tip = {
    icon: string;
    text: string;
};

type HealthTipsData = {
    [key: string]: {
        summary: string;
        tips: Tip[];
    };
};

const healthTips: HealthTipsData = {
  Underweight: {
    summary: 'Your BMI suggests you may be underweight. Focus on healthy weight gain.',
    tips: [
      { icon: '🍽️', text: 'Eat calorie-dense, nutritious foods like nuts, avocados, and whole grains.' },
      { icon: '💪', text: 'Add strength training to build muscle mass, not just fat.' },
      { icon: '🥛', text: 'Include protein-rich foods like eggs, legumes, dairy, and lean meats.' },
      { icon: '🩺', text: 'Consult a doctor to rule out underlying conditions causing low weight.' },
      { icon: '🕐', text: 'Eat smaller meals more frequently — 5 to 6 times a day.' },
    ],
  },
  Normal: {
    summary: 'Great work! Your BMI is in the healthy range. Focus on maintaining it.',
    tips: [
      { icon: '🥗', text: 'Keep eating a balanced diet with plenty of vegetables and whole foods.' },
      { icon: '🏃', text: 'Aim for at least 150 minutes of moderate exercise per week.' },
      { icon: '💧', text: 'Stay hydrated — drink 8 to 10 glasses of water daily.' },
      { icon: '😴', text: 'Prioritize 7 to 9 hours of quality sleep each night.' },
      { icon: '🧘', text: 'Manage stress through meditation, walks, or hobbies you enjoy.' },
    ],
  },
  Overweight: {
    summary: 'Your BMI is slightly above the healthy range. Small changes make a big difference.',
    tips: [
      { icon: '🚶', text: 'Start with 30 minutes of brisk walking daily — consistency beats intensity.' },
      { icon: '🍱', text: 'Watch portion sizes — use smaller plates to avoid overeating naturally.' },
      { icon: '🚫', text: 'Cut back on processed foods, sugary drinks, and refined carbs.' },
      { icon: '📊', text: 'Track what you eat for a week — awareness is the first step to change.' },
      { icon: '👥', text: 'Consider working with a nutritionist for a personalized plan.' },
    ],
  },
  Obese: {
    summary: 'Your BMI indicates obesity. Please consider speaking with a healthcare professional.',
    tips: [
      { icon: '🩺', text: 'Consult your doctor first — they can guide a safe, sustainable plan for you.' },
      { icon: '🏊', text: 'Low-impact exercise like swimming or cycling is easier on your joints.' },
      { icon: '🥦', text: 'Focus on whole foods and vegetables — crowding out bad foods works better than restricting.' },
      { icon: '📵', text: 'Limit screen time and sedentary periods — set a timer to move every hour.' },
      { icon: '❤️', text: 'Be kind to yourself — sustainable progress is built on consistency, not perfection.' },
    ],
  },
};

export default healthTips;