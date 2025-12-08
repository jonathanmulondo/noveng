import { Module, FeedItem, User } from '../types';

export const MOCK_USER: User = {
  id: 'user_123',
  name: 'Alex Maker',
  email: 'alex@noveng.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  stats: {
    level: 5,
    currentXp: 1250,
    nextLevelXp: 1500,
    streakDays: 7,
    totalLearningHours: 8.5,
    skills: {
      arduino: 65,        // Arduino programming
      pcbDesign: 0,       // Not part of MVP
      coding: 55,         // C++ for Arduino
      electronics: 40     // Basic circuits
    }
  },
  completedModules: ['arduino_basics', 'led_blink'],
  badges: ['First Blink', 'Circuit Builder', 'Code Warrior']
};

// Arduino Kit-Focused Modules
export const MOCK_MODULES: Module[] = [
  {
    id: 'arduino_basics',
    title: 'Arduino Uno Basics',
    description: 'Get started with Arduino Uno. Learn the board layout, power up your first circuit, and run your first sketch.',
    category: 'Arduino',
    difficulty: 'Beginner',
    duration: '2 hours',
    rating: 4.9,
    studentCount: 5432,
    progress: 100,
    thumbnail: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80',
    steps: [
      {
        title: 'Meet Your Arduino Uno',
        content: 'The Arduino Uno is your gateway to electronics. In this lesson, you\'ll learn about the different parts of the board: digital pins, analog pins, power pins, and the USB connector.',
        image: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80',
        keyConcepts: [
          'Arduino Uno has 14 digital pins and 6 analog pins',
          'Power the board via USB or external power (7-12V)',
          'The built-in LED is connected to pin 13'
        ]
      },
      {
        title: 'Installing Arduino IDE',
        content: 'Download and install the Arduino IDE - your coding environment for writing, compiling, and uploading sketches to your Arduino board.',
        keyConcepts: [
          'Arduino IDE is free and available for Windows, Mac, and Linux',
          'Select "Arduino Uno" as your board type',
          'Connect your board and select the correct COM port'
        ]
      }
    ],
    quiz: []
  },
  {
    id: 'led_blink',
    title: 'LED Blinking Project',
    description: 'Build your first Arduino circuit! Make an LED blink using digital output and learn the basics of Arduino programming.',
    category: 'Arduino',
    difficulty: 'Beginner',
    duration: '1.5 hours',
    rating: 4.8,
    studentCount: 4821,
    progress: 75,
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    steps: [
      {
        title: 'Wiring the LED Circuit',
        content: 'Learn how to safely connect an LED to your Arduino. You\'ll use a 220Ω resistor to protect the LED from burning out.',
        image: 'https://images.unsplash.com/photo-1601524908162-1f15f4e407e3?auto=format&fit=crop&w=800&q=80',
        keyConcepts: [
          'LEDs have polarity: long leg is positive (anode), short leg is negative (cathode)',
          'Always use a resistor (220Ω-1kΩ) to limit current through the LED',
          'Connect LED anode to Pin 13 via resistor, cathode to GND'
        ]
      },
      {
        title: 'Writing the Blink Sketch',
        content: 'Write your first Arduino program to make the LED blink on and off every second.',
        keyConcepts: [
          'setup() runs once when the board starts',
          'loop() runs repeatedly forever',
          'digitalWrite() sets a pin HIGH (5V) or LOW (0V)'
        ],
        codeSnippet: `// LED Blink - Your First Arduino Program
const int ledPin = 13;

void setup() {
  // Set pin 13 as an output
  pinMode(ledPin, OUTPUT);
}

void loop() {
  digitalWrite(ledPin, HIGH);  // Turn LED on
  delay(1000);                  // Wait 1 second
  digitalWrite(ledPin, LOW);   // Turn LED off
  delay(1000);                  // Wait 1 second
}`
      }
    ],
    quiz: []
  },
  {
    id: 'button_input',
    title: 'Button & Digital Input',
    description: 'Learn to read button presses and control LEDs based on user input. Master digital input and pull-up resistors.',
    category: 'Arduino',
    difficulty: 'Beginner',
    duration: '2 hours',
    rating: 4.7,
    studentCount: 3912,
    progress: 30,
    thumbnail: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80',
    steps: [],
    quiz: []
  },
  {
    id: 'pwm_led',
    title: 'LED Dimming with PWM',
    description: 'Use Pulse Width Modulation (PWM) to control LED brightness. Create fading effects and smooth transitions.',
    category: 'Arduino',
    difficulty: 'Beginner',
    duration: '2.5 hours',
    rating: 4.8,
    studentCount: 3456,
    progress: 0,
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    steps: [],
    quiz: []
  },
  {
    id: 'servo_motor',
    title: 'Servo Motor Control',
    description: 'Control servo motors with Arduino. Build projects like robotic arms and automated mechanisms.',
    category: 'Arduino',
    difficulty: 'Intermediate',
    duration: '3 hours',
    rating: 4.9,
    studentCount: 2834,
    progress: 0,
    thumbnail: 'https://images.unsplash.com/photo-1563207153-f403bf289096?auto=format&fit=crop&w=800&q=80',
    steps: [],
    quiz: []
  },
  {
    id: 'ultrasonic_sensor',
    title: 'Distance Sensing Project',
    description: 'Use an ultrasonic sensor (HC-SR04) to measure distance. Build proximity alarms and obstacle detectors.',
    category: 'Arduino',
    difficulty: 'Intermediate',
    duration: '2.5 hours',
    rating: 4.7,
    studentCount: 2654,
    progress: 0,
    thumbnail: 'https://images.unsplash.com/photo-1580894908361-967195033215?auto=format&fit=crop&w=800&q=80',
    steps: [],
    quiz: []
  },
  {
    id: 'temperature_sensor',
    title: 'Temperature Monitoring',
    description: 'Read temperature data from sensors (DHT11/LM35). Display readings and build a weather station.',
    category: 'Arduino',
    difficulty: 'Intermediate',
    duration: '3 hours',
    rating: 4.6,
    studentCount: 2123,
    progress: 0,
    thumbnail: 'https://images.unsplash.com/photo-1555664424-778a696fa350?auto=format&fit=crop&w=800&q=80',
    steps: [],
    quiz: []
  },
  {
    id: 'lcd_display',
    title: 'LCD Display Project',
    description: 'Connect and program a 16x2 LCD display. Show custom messages, sensor data, and real-time information.',
    category: 'Arduino',
    difficulty: 'Intermediate',
    duration: '2.5 hours',
    rating: 4.8,
    studentCount: 1987,
    progress: 0,
    thumbnail: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=800&q=80',
    steps: [],
    quiz: []
  }
];

// Arduino-focused community feed
export const MOCK_FEED: FeedItem[] = [
   {
    id: 'post_1765189482326',
    author: 'Jonathan Mulondo',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    type: 'video',
    src: 'https://mtvwxjuofppthkrwuxnu.supabase.co/storage/v1/object/public/videos/1765189479995-arduino1.mp4',
    caption: 'My first Arduino project! Building and testing circuits 🔌⚡ #arduino #electronics #maker',
    likes: 0,
    comments: 0,
    tags: ['arduino', 'electronics', 'maker']
  },
  {
    id: 'post_1',
    author: 'ArduinoMaster',
    avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=150&q=80',
    type: 'video',
    src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    caption: 'Just finished my Arduino robotic arm! Controlled with servo motors and a joystick 🤖 #arduino #robotics #maker',
    likes: 3400,
    comments: 215,
    tags: ['arduino', 'robotics', 'servos']
  },
  {
    id: 'post_2',
    author: 'CircuitQueen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    type: 'video',
    src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    caption: 'LED matrix animation running on Arduino! Coded from scratch 💡✨ #arduino #leds #coding',
    likes: 2850,
    comments: 142,
    tags: ['arduino', 'leds', 'animation']
  },
  {
    id: 'post_3',
    author: 'MakerMike',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    type: 'video',
    src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    caption: 'Smart plant watering system using Arduino + soil moisture sensor 🌱💧 #arduino #iot #plants',
    likes: 4200,
    comments: 298,
    tags: ['arduino', 'iot', 'automation']
  },
  {
    id: 'post_4',
    author: 'TechTina',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    type: 'video',
    src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    caption: 'Ultrasonic distance sensor setup tutorial! Perfect for obstacle avoidance 📏⚡ #arduino #sensors #tutorial',
    likes: 1920,
    comments: 87,
    tags: ['arduino', 'sensors', 'tutorial']
  },
  {
    id: 'post_5',
    author: 'CodeCraft',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    type: 'video',
    src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    caption: 'Temperature-controlled fan using Arduino and DHT11 sensor 🌡️🔥 #arduino #automation #diy',
    likes: 3150,
    comments: 176,
    tags: ['arduino', 'temperature', 'automation']
  },
  {
    id: 'post_6',
    author: 'ElectroElla',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=150&q=80',
    type: 'video',
    src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    caption: 'My first Arduino traffic light system! Red, yellow, green sequencing ⚠️🚦 #arduino #beginner #learning',
    likes: 2640,
    comments: 134,
    tags: ['arduino', 'beginner', 'leds']
  },
  {
    id: 'post_7',
    author: 'RobotRaj',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    type: 'video',
    src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    caption: 'Bluetooth-controlled Arduino car! Control from your phone 📱🚗 #arduino #bluetooth #robotics',
    likes: 5200,
    comments: 412,
    tags: ['arduino', 'bluetooth', 'car']
  },
  {
    id: 'post_8',
    author: 'WireWizard',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=150&q=80',
    type: 'video',
    src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    caption: 'Clean breadboard wiring tips for Arduino projects! 🔧✨ #arduino #breadboard #tips',
    likes: 1780,
    comments: 93,
    tags: ['arduino', 'tips', 'breadboard']
  }
];
