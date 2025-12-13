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
