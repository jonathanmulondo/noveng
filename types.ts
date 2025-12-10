// User & Auth
export interface UserStats {
  level: number;
  currentXp: number;
  nextLevelXp: number;
  streakDays: number;
  totalLearningHours: number;
  skills: {
    arduino: number;
    pcbDesign: number;
    coding: number;
    electronics: number;
  }
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  stats: UserStats;
  completedModules: string[];
  badges: string[];
}

// Learning Modules
export type ModuleCategory = 'Arduino' | 'PCB Design' | 'Raspberry Pi' | 'Embedded Systems' | 'Power Electronics';

export interface ModuleStep {
  title: string;
  content: string; // Markdown supported
  image?: string;
  codeSnippet?: string;
  keyConcepts?: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  category: ModuleCategory;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string; // e.g. "15 min" or "8 hours"
  rating: number;
  studentCount: number;
  progress: number; // 0-100 for the current user
  thumbnail: string;
  steps: ModuleStep[];
  quiz: QuizQuestion[];
}

// Community Feed
export interface FeedItem {
  id: string;
  author: string;
  avatar: string;
  type: 'video' | 'image';
  src: string;
  caption: string;
  likes: number;
  comments: number;
  tags: string[];
  isAd?: boolean;
}

// Simulator Types
export enum ComponentType {
  ARDUINO_UNO = 'ARDUINO_UNO',
  LED = 'LED',
  RESISTOR = 'RESISTOR',
  BATTERY = 'BATTERY',
  BUTTON = 'BUTTON',
  ULTRASONIC = 'ULTRASONIC',
  SERVO = 'SERVO',
  POTENTIOMETER = 'POTENTIOMETER',
  LCD_16X2 = 'LCD_16X2',
  BREADBOARD = 'BREADBOARD',
  BUZZER = 'BUZZER',
  RGB_LED = 'RGB_LED'
}

export interface Pin {
  id: string;
  name: string;
  x: number; // Relative to component
  y: number;
  type: 'power' | 'ground' | 'digital' | 'analog';
}

export interface ComponentState {
  // Button
  isPressed?: boolean;
  // Potentiometer
  angle?: number; // 0-270 degrees
  resistance?: number; // 0-10000 ohms
  // Sensor values
  sensorValue?: number;
  // LED
  brightness?: number; // 0-255
  // RGB LED
  red?: number; // 0-255
  green?: number; // 0-255
  blue?: number; // 0-255
  // Buzzer
  isActive?: boolean;
  frequency?: number; // Hz
  // LCD Display
  displayText?: string[];
}

export interface SimComponent {
  id: string;
  type: ComponentType;
  x: number;
  y: number;
  state?: ComponentState;
  rotation?: 0 | 90 | 180 | 270;
  label?: string;
}

export interface Wire {
  id: string;
  fromCompId: string;
  fromPinId: string;
  toCompId: string;
  toPinId: string;
}

export interface CircuitState {
  components: SimComponent[];
  wires: Wire[];
  version: string;
  createdAt: string;
  name?: string;
}