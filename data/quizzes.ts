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

  'blinking-an-led': {
    moduleSlug: 'blinking-an-led',
    moduleNumber: 2,
    questions: [
      {
        id: 1,
        question: 'What does the resistor do in an LED circuit?',
        options: [
          'Makes the LED brighter',
          'Limits current to prevent LED burnout',
          'Changes the LED color',
          'Nothing, it\'s optional'
        ],
        correctAnswer: 1,
        explanation: 'The 220Ω resistor limits the current flowing through the LED to a safe level (around 20mA). Without it, too much current would flow and burn out the LED instantly.',
        difficulty: 'easy'
      },
      {
        id: 2,
        question: 'What voltage does digitalWrite(pin, HIGH) output on an Arduino Uno?',
        options: [
          '3.3V',
          '5V',
          '12V',
          '0V'
        ],
        correctAnswer: 1,
        explanation: 'digitalWrite(pin, HIGH) sets the pin to 5 volts on Arduino Uno. This is the logic HIGH level for most Arduino boards (some newer boards use 3.3V).',
        difficulty: 'easy'
      },
      {
        id: 3,
        question: 'Which LED leg connects to positive voltage (through the resistor)?',
        options: [
          'Shorter leg (cathode)',
          'Longer leg (anode)',
          'Either leg works',
          'Depends on LED color'
        ],
        correctAnswer: 1,
        explanation: 'The longer leg is the anode (+) and connects to positive voltage. The shorter leg is the cathode (-) and connects to ground. LEDs only work when connected with correct polarity.',
        difficulty: 'easy'
      },
      {
        id: 4,
        question: 'What does delay(1000) do in the code?',
        options: [
          'Pauses for 1 second',
          'Pauses for 1 minute',
          'Pauses for 100 milliseconds',
          'Pauses for 10 seconds'
        ],
        correctAnswer: 0,
        explanation: 'delay(1000) pauses the program for 1000 milliseconds, which equals 1 second. The delay() function takes time in milliseconds as its parameter.',
        difficulty: 'easy'
      },
      {
        id: 5,
        question: 'Why must pinMode() be called in setup()?',
        options: [
          'It makes the LED brighter',
          'It configures the pin as INPUT or OUTPUT',
          'It isn\'t required, the code works without it',
          'It sets the pin voltage to 5V'
        ],
        correctAnswer: 1,
        explanation: 'pinMode() must be called in setup() to configure whether a pin will be used as an INPUT (to read sensors) or OUTPUT (to control LEDs, motors, etc.). Without it, the pin behavior is undefined.',
        difficulty: 'medium'
      },
      {
        id: 6,
        question: 'What happens if you use a resistor value that\'s too high (e.g., 10kΩ)?',
        options: [
          'LED burns out immediately',
          'LED is very dim or doesn\'t light',
          'LED gets brighter',
          'Arduino gets damaged'
        ],
        correctAnswer: 1,
        explanation: 'A resistor value that\'s too high (like 10kΩ) limits current too much, making the LED very dim or not lighting at all. The standard 220Ω provides good brightness without risk of burnout.',
        difficulty: 'medium'
      },
      {
        id: 7,
        question: 'Can you control multiple LEDs from a single Arduino pin?',
        options: [
          'Yes, unlimited LEDs can share one pin',
          'No, each LED needs its own pin',
          'Yes, but only 2-3 LEDs maximum',
          'Yes, if you use a transistor or LED driver chip'
        ],
        correctAnswer: 3,
        explanation: 'While you can\'t directly connect many LEDs to one pin (Arduino pins have limited current), you can use a transistor or specialized LED driver chip (like ULN2003 or shift register) to control many LEDs from one pin.',
        difficulty: 'hard'
      },
      {
        id: 8,
        question: 'What would happen if you connected the LED backwards (reversed polarity)?',
        options: [
          'LED works normally',
          'LED explodes',
          'LED doesn\'t light up (no damage)',
          'Arduino gets damaged'
        ],
        correctAnswer: 2,
        explanation: 'LEDs are diodes - they only allow current in one direction. If connected backwards, the LED simply won\'t light up. No damage occurs to the LED or Arduino, just flip it around and it will work.',
        difficulty: 'medium'
      }
    ]
  },

  'understanding-digital-outputs': {
    moduleSlug: 'understanding-digital-outputs',
    moduleNumber: 4,
    questions: [
      {
        id: 1,
        question: 'How many digital I/O pins does Arduino Uno have?',
        options: [
          '6 pins',
          '10 pins',
          '14 pins (0-13)',
          '20 pins'
        ],
        correctAnswer: 2,
        explanation: 'Arduino Uno has 14 digital I/O pins numbered 0-13. Pins 0 and 1 are typically reserved for serial communication (TX/RX), so we usually use pins 2-13 for projects.',
        difficulty: 'easy'
      },
      {
        id: 2,
        question: 'What are the two possible states for a digital output pin?',
        options: [
          'ON and OFF',
          'HIGH (5V) and LOW (0V)',
          '1 and 0',
          'All of the above'
        ],
        correctAnswer: 3,
        explanation: 'All three answers describe the same thing! A digital pin can be HIGH (5V, ON, 1) or LOW (0V, OFF, 0). These are binary states - no in-between values.',
        difficulty: 'easy'
      },
      {
        id: 3,
        question: 'Which pins should you avoid using for regular digital output?',
        options: [
          'Pins 13 and 12',
          'Pins 0 and 1 (used for Serial)',
          'Pins 9 and 10',
          'Pin 7'
        ],
        correctAnswer: 1,
        explanation: 'Pins 0 (RX) and 1 (TX) are used for serial communication with your computer. Using them for other purposes can interfere with uploading code and Serial Monitor communication.',
        difficulty: 'medium'
      },
      {
        id: 4,
        question: 'Can digital outputs be used to control motors directly?',
        options: [
          'Yes, any motor can connect directly',
          'No, you need a motor driver (H-bridge) for most motors',
          'Only small motors under 1V',
          'Only servo motors'
        ],
        correctAnswer: 1,
        explanation: 'Arduino pins can only provide 20-40mA of current, which isn\'t enough for most motors. You need a motor driver (like L298N or motor shield) to amplify the signal and provide sufficient current.',
        difficulty: 'medium'
      },
      {
        id: 5,
        question: 'What happens if you forget to set pinMode() for a pin?',
        options: [
          'Pin defaults to INPUT mode',
          'Pin defaults to OUTPUT mode',
          'Arduino crashes',
          'Behavior is unpredictable'
        ],
        correctAnswer: 0,
        explanation: 'Pins default to INPUT mode if pinMode() isn\'t called. This means digitalWrite() won\'t work as expected for controlling outputs. Always explicitly set pinMode() in setup().',
        difficulty: 'hard'
      },
      {
        id: 6,
        question: 'In the traffic light code, what controls the sequence timing?',
        options: [
          'The LED colors',
          'The delay() function',
          'The digitalWrite() function',
          'The pinMode() function'
        ],
        correctAnswer: 1,
        explanation: 'The delay() function controls timing by pausing the program for specified milliseconds. In the traffic light example, different delay values create the red-yellow-green-yellow sequence.',
        difficulty: 'easy'
      },
      {
        id: 7,
        question: 'Why do we use const int for pin numbers in the code?',
        options: [
          'It\'s required by Arduino',
          'Makes code easier to read and modify',
          'It makes the code run faster',
          'It saves memory'
        ],
        correctAnswer: 1,
        explanation: 'Using const int (or #define) for pin numbers makes code more readable and easier to modify. If you need to change which pin a component is connected to, you only update one line instead of finding every reference.',
        difficulty: 'medium'
      }
    ]
  },

  'reading-button-inputs': {
    moduleSlug: 'reading-button-inputs',
    moduleNumber: 5,
    questions: [
      {
        id: 1,
        question: 'What is the purpose of the 10kΩ resistor in the button circuit?',
        options: [
          'Limits current to the button',
          'Acts as a pull-down resistor to prevent floating voltage',
          'Makes the button more sensitive',
          'Protects the Arduino'
        ],
        correctAnswer: 1,
        explanation: 'The 10kΩ resistor is a pull-down resistor that connects the pin to ground when the button isn\'t pressed. Without it, the pin would "float" at an undefined voltage, causing unreliable readings.',
        difficulty: 'medium'
      },
      {
        id: 2,
        question: 'What is "debouncing" in the context of buttons?',
        options: [
          'Making the button physically bounce',
          'Filtering out rapid on/off signals from mechanical contacts',
          'Making the button easier to press',
          'Increasing button lifespan'
        ],
        correctAnswer: 1,
        explanation: 'When you press a physical button, the metal contacts "bounce" creating multiple rapid on/off signals. Debouncing (using delays or capacitors) filters these false triggers to read one clean press.',
        difficulty: 'medium'
      },
      {
        id: 3,
        question: 'What does digitalRead(buttonPin) return when the button is pressed?',
        options: [
          'LOW (0)',
          'HIGH (1)',
          '5V',
          'true'
        ],
        correctAnswer: 1,
        explanation: 'digitalRead() returns HIGH (1) when the button is pressed because it connects the pin to 5V. When released, the pull-down resistor pulls the pin to GND, returning LOW (0).',
        difficulty: 'easy'
      },
      {
        id: 4,
        question: 'Why is 50ms a common debounce delay value?',
        options: [
          'It\'s a random number that works',
          'Button bounces typically last 5-50ms',
          'Humans can\'t press faster than 50ms',
          'Arduino requires this specific value'
        ],
        correctAnswer: 1,
        explanation: 'Physical button bounces typically last between 5-50 milliseconds. A 50ms debounce delay is long enough to filter out bounces but short enough that users don\'t notice any lag.',
        difficulty: 'hard'
      },
      {
        id: 5,
        question: 'What\'s the difference between pull-down and pull-up resistors?',
        options: [
          'Pull-down connects to GND, pull-up connects to 5V',
          'Pull-up is stronger than pull-down',
          'Pull-down is for buttons, pull-up is for LEDs',
          'No difference, just naming convention'
        ],
        correctAnswer: 0,
        explanation: 'Pull-down resistors connect the pin to GND (reads LOW when button not pressed). Pull-up resistors connect to 5V (reads HIGH when button not pressed). Arduino has internal pull-ups you can enable with INPUT_PULLUP.',
        difficulty: 'medium'
      },
      {
        id: 6,
        question: 'How would you create a toggle button (press once = on, press again = off)?',
        options: [
          'Use two buttons',
          'Can\'t be done with Arduino',
          'Use a boolean variable to track state',
          'Use a special toggle button component'
        ],
        correctAnswer: 2,
        explanation: 'To create toggle behavior, use a boolean variable to track LED state. When button is pressed, flip the variable (ledState = !ledState) and update the LED. This requires detecting rising edge (button press, not hold).',
        difficulty: 'hard'
      }
    ]
  },

  'working-with-potentiometers': {
    moduleSlug: 'working-with-potentiometers',
    moduleNumber: 6,
    questions: [
      {
        id: 1,
        question: 'What range of values does analogRead() return?',
        options: [
          '0-255',
          '0-1023',
          '0-5V',
          '0-100'
        ],
        correctAnswer: 1,
        explanation: 'analogRead() returns a 10-bit value ranging from 0 to 1023. This represents the voltage on the analog pin: 0 = 0V, 1023 = 5V, 512 = 2.5V, etc.',
        difficulty: 'easy'
      },
      {
        id: 2,
        question: 'What does the map() function do?',
        options: [
          'Creates a navigation map',
          'Converts one range of values to another range',
          'Displays values on a map',
          'Finds the location of a value'
        ],
        correctAnswer: 1,
        explanation: 'map() converts values from one range to another. For example, map(512, 0, 1023, 0, 255) converts the analog reading (0-1023) to PWM range (0-255), returning 127.',
        difficulty: 'easy'
      },
      {
        id: 3,
        question: 'How many analog input pins does Arduino Uno have?',
        options: [
          '2 pins (A0-A1)',
          '4 pins (A0-A3)',
          '6 pins (A0-A5)',
          '8 pins (A0-A7)'
        ],
        correctAnswer: 2,
        explanation: 'Arduino Uno has 6 analog input pins labeled A0 through A5. These pins can read voltage levels from 0-5V and convert them to digital values using the built-in ADC (Analog-to-Digital Converter).',
        difficulty: 'easy'
      },
      {
        id: 4,
        question: 'What happens when you turn a potentiometer fully clockwise?',
        options: [
          'Resistance becomes 0Ω',
          'Resistance becomes maximum (10kΩ)',
          'Middle pin outputs 5V',
          'Depends on how it\'s wired'
        ],
        correctAnswer: 3,
        explanation: 'The behavior depends on wiring! If left pin is connected to 5V, turning clockwise increases voltage on middle pin toward 5V. If right pin is 5V, it decreases toward 0V. Always check your wiring orientation.',
        difficulty: 'medium'
      },
      {
        id: 5,
        question: 'Which Arduino pins support analogWrite() for PWM output?',
        options: [
          'All digital pins (0-13)',
          'All analog pins (A0-A5)',
          'Only pins marked with ~ (3, 5, 6, 9, 10, 11)',
          'Only pin 13'
        ],
        correctAnswer: 2,
        explanation: 'Only pins marked with ~ symbol support PWM via analogWrite(): pins 3, 5, 6, 9, 10, and 11 on Arduino Uno. These pins have hardware timers that can generate PWM signals.',
        difficulty: 'medium'
      },
      {
        id: 6,
        question: 'What is the resolution of Arduino Uno\'s ADC (Analog-to-Digital Converter)?',
        options: [
          '8-bit (256 values)',
          '10-bit (1024 values)',
          '12-bit (4096 values)',
          '16-bit (65536 values)'
        ],
        correctAnswer: 1,
        explanation: 'Arduino Uno has a 10-bit ADC, providing 1024 possible values (0-1023). Some other Arduino boards (like Due) have 12-bit ADCs for finer resolution.',
        difficulty: 'hard'
      },
      {
        id: 7,
        question: 'Why might you add a small delay in the loop when reading a potentiometer?',
        options: [
          'Arduino requires it',
          'Stabilizes readings and reduces noise',
          'Makes the LED brighter',
          'Saves battery power'
        ],
        correctAnswer: 1,
        explanation: 'A small delay (10-100ms) helps stabilize readings by giving the ADC time to settle and reduces noise from rapid sampling. It also makes Serial Monitor output more readable.',
        difficulty: 'medium'
      }
    ]
  },

  'serial-monitor-basics': {
    moduleSlug: 'serial-monitor-basics',
    moduleNumber: 7,
    questions: [
      {
        id: 1,
        question: 'What is a baud rate?',
        options: [
          'The brightness of Serial Monitor',
          'The speed of serial communication in bits per second',
          'The number of lines displayed',
          'The size of the Serial Monitor window'
        ],
        correctAnswer: 1,
        explanation: 'Baud rate is the speed of serial communication measured in bits per second (bps). Common values are 9600, 115200. Both Arduino code and Serial Monitor must use the same baud rate to communicate correctly.',
        difficulty: 'easy'
      },
      {
        id: 2,
        question: 'What\'s the difference between Serial.print() and Serial.println()?',
        options: [
          'println() is faster',
          'println() adds a newline at the end',
          'print() is for numbers only',
          'No difference'
        ],
        correctAnswer: 1,
        explanation: 'Serial.print() outputs text without moving to a new line, while Serial.println() adds a newline (\\n) and carriage return (\\r) after the text, moving the cursor to the next line.',
        difficulty: 'easy'
      },
      {
        id: 3,
        question: 'What does Serial.begin(9600) do?',
        options: [
          'Opens the Serial Monitor window',
          'Initializes serial communication at 9600 baud',
          'Sends the number 9600 to computer',
          'Sets pin 9 to 600 volts'
        ],
        correctAnswer: 1,
        explanation: 'Serial.begin(9600) initializes serial communication at 9600 bits per second. This must be called in setup() before using Serial.print() or other serial functions.',
        difficulty: 'easy'
      },
      {
        id: 4,
        question: 'How do you read user input from Serial Monitor?',
        options: [
          'Serial.read()',
          'Serial.input()',
          'Serial.get()',
          'Serial.scan()'
        ],
        correctAnswer: 0,
        explanation: 'Serial.read() reads one byte from the serial buffer. For strings, use Serial.readString() or Serial.readStringUntil(). Always check Serial.available() > 0 before reading.',
        difficulty: 'medium'
      },
      {
        id: 5,
        question: 'What happens if you see garbled text in Serial Monitor?',
        options: [
          'Arduino is broken',
          'Baud rates don\'t match',
          'Cable is faulty',
          'Computer needs restart'
        ],
        correctAnswer: 1,
        explanation: 'Garbled text usually means the baud rate in Serial.begin() doesn\'t match the Serial Monitor setting. Check that both are set to the same value (typically 9600).',
        difficulty: 'medium'
      },
      {
        id: 6,
        question: 'What does Serial.available() return?',
        options: [
          'true if serial is working',
          'Number of bytes waiting in the buffer',
          'The next character to read',
          'The baud rate'
        ],
        correctAnswer: 1,
        explanation: 'Serial.available() returns the number of bytes available to read in the serial buffer. If it returns 0, there\'s no data waiting. Check this before calling Serial.read() to avoid reading empty data.',
        difficulty: 'medium'
      },
      {
        id: 7,
        question: 'Can you use Serial Monitor while pins 0 and 1 are connected to other devices?',
        options: [
          'Yes, no problem',
          'No, pins 0 (RX) and 1 (TX) are used for serial',
          'Only if using wireless connection',
          'Only on Tuesdays'
        ],
        correctAnswer: 1,
        explanation: 'Pins 0 (RX) and 1 (TX) are hardware serial pins. Connecting other components to them interferes with USB communication. Use other pins for your project, or use SoftwareSerial library.',
        difficulty: 'hard'
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
