/**
 * Quiz Questions for NovEng Arduino Modules
 *
 * Each module has 5-10 questions testing understanding of concepts
 * Questions are categorized by difficulty: easy, medium, hard
 */

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ModuleQuiz {
  moduleSlug: string;
  moduleNumber: number;
  questions: QuizQuestion[];
}

export const QUIZZES: Record<string, ModuleQuiz> = {
  'introduction-to-arduino-and-ide': {
    moduleSlug: 'introduction-to-arduino-and-ide',
    moduleNumber: 1,
    questions: [
      {
        id: 1,
        question: 'What are the two main functions that every Arduino sketch must have?',
        options: [
          'start() and run()',
          'setup() and loop()',
          'begin() and execute()',
          'init() and main()'
        ],
        correctAnswer: 1,
        explanation: 'Every Arduino sketch requires setup() which runs once at startup to initialize settings, and loop() which runs continuously forever. These are the fundamental building blocks of Arduino programs.',
        difficulty: 'easy'
      },
      {
        id: 2,
        question: 'What baud rate should you select in the Serial Monitor to see "Hello, World!" messages correctly if Serial.begin(9600) is used in your code?',
        options: [
          '4800',
          '9600',
          '115200',
          'It doesn\'t matter'
        ],
        correctAnswer: 1,
        explanation: 'The baud rate in Serial Monitor must match the value used in Serial.begin(). If your code uses Serial.begin(9600), you must select 9600 baud in the Serial Monitor dropdown, otherwise you\'ll see garbled text.',
        difficulty: 'easy'
      },
      {
        id: 3,
        question: 'Which microcontroller chip is the "brain" of the Arduino Uno?',
        options: [
          'ESP8266',
          'ATmega328P',
          'Raspberry Pi',
          'Intel Core i5'
        ],
        correctAnswer: 1,
        explanation: 'The ATmega328P is the microcontroller chip on Arduino Uno that executes your code. It\'s a small, efficient processor designed for embedded systems, different from full computers like Raspberry Pi.',
        difficulty: 'medium'
      }
    ]
  },

  'using-a-breadboard': {
    moduleSlug: 'using-a-breadboard',
    moduleNumber: 2,
    questions: [
      {
        id: 1,
        question: 'How are holes connected in a breadboard terminal strip?',
        options: [
          'All holes in a row are connected together',
          'Holes a-e are connected, holes f-j are connected, but not across the gap',
          'Holes are connected vertically in columns',
          'No holes are connected - you must use wires'
        ],
        correctAnswer: 1,
        explanation: 'In terminal strips, holes a-b-c-d-e are connected horizontally, and f-g-h-i-j are connected horizontally, but the center gap separates them. This gap is designed for IC chips.',
        difficulty: 'easy'
      },
      {
        id: 2,
        question: 'What is the purpose of power rails on a breadboard?',
        options: [
          'To make the breadboard look prettier',
          'To provide vertical connections for power and ground',
          'To separate different circuits',
          'To hold the breadboard in place'
        ],
        correctAnswer: 1,
        explanation: 'Power rails run vertically along the sides of a breadboard. All holes in a power rail are connected, making it easy to distribute power (+) and ground (-) to multiple components.',
        difficulty: 'easy'
      },
      {
        id: 3,
        question: 'Why is there a gap in the middle of the breadboard?',
        options: [
          'To save plastic during manufacturing',
          'To allow airflow for cooling',
          'To accommodate IC chips without shorting their pins',
          'To make the breadboard fold in half'
        ],
        correctAnswer: 2,
        explanation: 'The center gap ensures that when you insert an IC chip (integrated circuit), the pins on opposite sides don\'t connect to each other. Each side of the chip can then connect to different components.',
        difficulty: 'medium'
      }
    ]
  },

  'blinking-an-led': {
    moduleSlug: 'blinking-an-led',
    moduleNumber: 3,
    questions: [
      {
        id: 1,
        question: 'Why must you use a resistor with an LED?',
        options: [
          'To make the LED brighter',
          'To limit current and prevent the LED from burning out',
          'To change the LED color',
          'Resistors are optional with LEDs'
        ],
        correctAnswer: 1,
        explanation: 'LEDs can only handle about 20mA of current. Without a resistor, too much current would flow from the 5V Arduino pin, causing the LED to burn out instantly. The 220Ω resistor limits current to a safe level.',
        difficulty: 'easy'
      },
      {
        id: 2,
        question: 'Which LED leg connects to positive voltage?',
        options: [
          'The shorter leg (cathode)',
          'The longer leg (anode)',
          'Either leg works the same way',
          'It depends on the LED color'
        ],
        correctAnswer: 1,
        explanation: 'The longer leg is the anode (+) and must connect to positive voltage. The shorter leg is the cathode (-) and connects to ground. LEDs are polarized and only work in one direction.',
        difficulty: 'easy'
      },
      {
        id: 3,
        question: 'What does pinMode(13, OUTPUT) do?',
        options: [
          'Sets pin 13 to 5 volts',
          'Configures pin 13 to send power out (not read input)',
          'Turns pin 13 on and off repeatedly',
          'Reads the voltage on pin 13'
        ],
        correctAnswer: 1,
        explanation: 'pinMode() configures whether a pin will be used as an OUTPUT (sending power to control devices) or INPUT (reading sensors). You must call pinMode() in setup() before using digitalWrite().',
        difficulty: 'medium'
      }
    ]
  }
};

/**
 * Get quiz for a specific module
 */
export function getQuizBySlug(slug: string): ModuleQuiz | null {
  return QUIZZES[slug] || null;
}

/**
 * Get quiz by module number
 */
export function getQuizByNumber(moduleNumber: number): ModuleQuiz | null {
  const quiz = Object.values(QUIZZES).find(q => q.moduleNumber === moduleNumber);
  return quiz || null;
}

/**
 * Check if a module has a quiz
 */
export function hasQuiz(slug: string): boolean {
  return slug in QUIZZES;
}
