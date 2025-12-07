import { Module, FeedItem, User } from '../types';

export const MOCK_USER: User = {
  id: 'user_123',
  name: 'Alex Engineer',
  email: 'alex@noveng.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  stats: {
    level: 12,
    currentXp: 2847,
    nextLevelXp: 3500,
    streakDays: 7,
    totalLearningHours: 12.5,
    skills: {
      arduino: 75,
      pcbDesign: 45,
      coding: 60,
      electronics: 30
    }
  },
  completedModules: ['mod_1_step_1', 'mod_1_step_2'],
  badges: ['First Light', 'Wire Master', 'Breadboard Ninja']
};

export const MOCK_MODULES: Module[] = [
  {
    id: 'mod_1',
    title: 'Arduino Foundations',
    description: 'Master the fundamentals of Arduino programming and circuit design from scratch.',
    category: 'Arduino',
    difficulty: 'Beginner',
    duration: '8 hours',
    rating: 4.8,
    studentCount: 2847,
    progress: 45,
    thumbnail: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=800&q=80',
    steps: [
      {
        title: 'Introduction to PWM',
        content: 'Pulse Width Modulation (PWM) is a powerful technique for getting analog results with digital means. Digital control is used to create a square wave, a signal switched between on and off.',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
        keyConcepts: [
          'PWM uses digital pins to simulate analog output',
          'Duty cycle determines the effective voltage',
          'Used for dimming LEDs and controlling motors'
        ]
      },
      {
        title: 'PWM Control Basics',
        content: 'Learn how to implement PWM control in Arduino using the analogWrite() function. This allows you to control LED brightness, motor speed, and other analog-like outputs.',
        keyConcepts: [
          'PWM uses digital pins to simulate analog output by rapidly switching between HIGH and LOW',
          'Duty cycle ranges from 0 (always off) to 255 (always on) in Arduino',
          'Only specific pins support PWM (marked with ~ on Arduino boards)'
        ],
        codeSnippet: `// Define LED pin (must be PWM-capable)
const int ledPin = 9;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  // Fade in
  for (int brightness = 0; brightness <= 255; brightness++) {
    analogWrite(ledPin, brightness);
    delay(5);
  }
  
  // Fade out
  for (int brightness = 255; brightness >= 0; brightness--) {
    analogWrite(ledPin, brightness);
    delay(5);
  }
}`
      }
    ],
    quiz: []
  },
  {
    id: 'mod_2',
    title: 'Advanced PCB Design',
    description: 'Professional PCB layout, routing, and manufacturing techniques using Altium and KiCad.',
    category: 'PCB Design',
    difficulty: 'Advanced',
    duration: '12 hours',
    rating: 4.9,
    studentCount: 1523,
    progress: 20,
    thumbnail: 'https://images.unsplash.com/photo-1593106410288-9642f563d6da?auto=format&fit=crop&w=800&q=80',
    steps: [],
    quiz: []
  },
  {
    id: 'mod_3',
    title: 'Raspberry Pi Projects',
    description: 'Build real-world IoT and automation projects with Raspberry Pi 4.',
    category: 'Raspberry Pi',
    difficulty: 'Intermediate',
    duration: '10 hours',
    rating: 4.7,
    studentCount: 3201,
    progress: 0,
    thumbnail: 'https://images.unsplash.com/photo-1550005809-91a759055272?auto=format&fit=crop&w=800&q=80',
    steps: [],
    quiz: []
  },
  {
    id: 'mod_4',
    title: 'Power Electronics Basics',
    description: 'Understanding voltage regulation, converters, and power management.',
    category: 'Power Electronics',
    difficulty: 'Intermediate',
    duration: '6 hours',
    rating: 4.6,
    studentCount: 1876,
    progress: 0,
    thumbnail: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80',
    steps: [],
    quiz: []
  },
  {
    id: 'mod_5',
    title: 'Embedded Systems Design',
    description: 'Deep dive into microcontroller architecture and embedded C programming.',
    category: 'Embedded Systems',
    difficulty: 'Advanced',
    duration: '15 hours',
    rating: 4.9,
    studentCount: 1245,
    progress: 65,
    thumbnail: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&w=800&q=80',
    steps: [],
    quiz: []
  },
  {
    id: 'mod_6',
    title: 'Sensor Integration',
    description: 'Work with temperature, pressure, motion, and environmental sensors.',
    category: 'Arduino',
    difficulty: 'Beginner',
    duration: '5 hours',
    rating: 4.8,
    studentCount: 4123,
    progress: 0,
    thumbnail: 'https://images.unsplash.com/photo-1555664424-778a696fa350?auto=format&fit=crop&w=800&q=80',
    steps: [],
    quiz: []
  }
];

export const MOCK_FEED: FeedItem[] = [
  {
    id: 'post_1',
    author: 'CircuitMaster',
    avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=150&q=80',
    type: 'video',
    src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    caption: 'Satisfying soldering timelapse! 🌡️⚡️ Watch that flux flow. #soldering #pcb #electronics',
    likes: 2400,
    comments: 124,
    tags: ['soldering', 'satisfying', 'pcb']
  },
  {
    id: 'post_2',
    author: 'ArduinoGirl',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    type: 'video',
    src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    caption: 'Debugging the main control unit. Pro tip: Always check your ground connections first! 🔧🧐 #debugging #engineering',
    likes: 1850,
    comments: 89,
    tags: ['tips', 'debug', 'wiring']
  },
  {
    id: 'post_3',
    author: 'RoboBuilder',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    type: 'video',
    src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    caption: 'Macro shot of the new ESP32 board layout. Look at those traces! 😍 #esp32 #pcbdesign #macro',
    likes: 3200,
    comments: 210,
    tags: ['hardware', 'art', 'macro']
  },
  {
    id: 'post_4',
    author: 'NovEngOfficial',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    type: 'video',
    src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    caption: 'Wiring Challenge: Can you name every component on this breadboard? 👇 #quiz #breadboard #learning',
    likes: 1500,
    comments: 450,
    tags: ['quiz', 'challenge', 'community']
  },
  {
    id: 'post_5',
    author: 'TechWizard',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    type: 'video',
    src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    caption: 'New project alert! Building an autonomous robot from scratch 🤖✨ Stay tuned for updates! #robotics #maker #diy',
    likes: 4200,
    comments: 310,
    tags: ['robotics', 'maker', 'project']
  },
  {
    id: 'post_6',
    author: 'MakerMia',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    type: 'video',
    src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    caption: 'Prototyping session! First iteration of my smart home controller 🏠💡 #smarthome #iot #arduino',
    likes: 2850,
    comments: 156,
    tags: ['iot', 'smarthome', 'prototype']
  },
  {
    id: 'post_7',
    author: 'CodeAndCircuits',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    type: 'video',
    src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    caption: 'The beauty of PCB design 🎨 Check out these copper traces! #pcbdesign #electronics #satisfying',
    likes: 5100,
    comments: 278,
    tags: ['pcb', 'design', 'engineering']
  },
  {
    id: 'post_8',
    author: 'ElectroEngineer',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=150&q=80',
    type: 'video',
    src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    caption: 'Testing the new power supply circuit ⚡ 12V to 5V conversion working perfectly! #power #electronics #testing',
    likes: 1920,
    comments: 95,
    tags: ['power', 'testing', 'circuit']
  }
];