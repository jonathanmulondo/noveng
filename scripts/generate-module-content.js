#!/usr/bin/env node

/**
 * NovEng Module Content Generator
 *
 * Auto-generates high-quality Arduino module content using AI
 * Based on Module 2 (Blinking LED) as the quality template
 *
 * Usage: node scripts/generate-module-content.js <module-number>
 * Example: node scripts/generate-module-content.js 4
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load curriculum data
const curriculumPath = join(__dirname, '../curriculum/curriculum-data.json');
const curriculumData = JSON.parse(readFileSync(curriculumPath, 'utf-8'));

// Load template (Module 2 - Blinking LED)
const templateLessonPath = join(__dirname, '../curriculum/blinking-an-led/lesson.md');
const templateLesson = readFileSync(templateLessonPath, 'utf-8');

const templateOverviewPath = join(__dirname, '../curriculum/blinking-an-led/overview.md');
const templateOverview = readFileSync(templateOverviewPath, 'utf-8');

/**
 * Module-specific content database
 * Pre-defined content for each module to ensure accuracy
 */
const MODULE_CONTENT = {
  4: {
    title: 'Understanding Digital Outputs',
    components: [
      'Arduino Uno board',
      '3x LEDs (red, yellow, green)',
      '3x 220Ω resistors (red-red-brown)',
      'Breadboard',
      '6 jumper wires'
    ],
    theory: `Digital outputs are the foundation of controlling electronic devices with Arduino. Each pin can be set to one of two states:

**HIGH (5V)**: Pin outputs 5 volts, turning connected devices ON
**LOW (0V)**: Pin outputs 0 volts, turning connected devices OFF

Think of it like a light switch - it's either on or off, nothing in between. This binary (two-state) control is perfect for:
- LEDs (on/off)
- Relays (switching high-power devices)
- Digital displays
- Motors (through motor drivers)

Arduino Uno has 14 digital pins (0-13), but pins 0 and 1 are used for serial communication, so we typically use pins 2-13 for our projects.`,

    wiring: `### Step-by-Step Wiring:
1. Insert three LEDs into the breadboard (red, yellow, green)
2. Connect each LED's long leg (anode) to a 220Ω resistor
3. Connect resistors to pins 8, 9, and 10 respectively
4. Connect all LED short legs (cathodes) to Arduino GND

### Wiring Diagram:
\`\`\`
Arduino Uno                     Breadboard
┌─────────────────┐
│                 │      RED LED
│  [PIN 8]────────○───[220Ω]───>|──┐
│                 │                 │
│  [PIN 9]────────○───[220Ω]───>|──┤  YELLOW LED
│                 │                 │
│  [PIN 10]───────○───[220Ω]───>|──┤  GREEN LED
│                 │                 │
│  [GND]──────────○─────────────────┘
│                 │
└─────────────────┘

LED Orientation (all 3 LEDs):
  Long leg (+) → to resistor → to Arduino pin
  Short leg (-) → to GND
\`\`\``,

    code: `// Traffic Light Simulator
// Controls 3 LEDs to create a traffic light sequence

// Pin definitions
const int redLED = 8;
const int yellowLED = 9;
const int greenLED = 10;

void setup() {
  // Configure all three pins as OUTPUT
  pinMode(redLED, OUTPUT);
  pinMode(yellowLED, OUTPUT);
  pinMode(greenLED, OUTPUT);

  // Start with all LEDs off
  digitalWrite(redLED, LOW);
  digitalWrite(yellowLED, LOW);
  digitalWrite(greenLED, LOW);

  Serial.begin(9600);
  Serial.println("Traffic Light Started!");
}

void loop() {
  // RED light (stop)
  Serial.println("RED - Stop");
  digitalWrite(redLED, HIGH);
  digitalWrite(yellowLED, LOW);
  digitalWrite(greenLED, LOW);
  delay(3000);  // 3 seconds

  // YELLOW light (prepare)
  Serial.println("YELLOW - Get Ready");
  digitalWrite(redLED, LOW);
  digitalWrite(yellowLED, HIGH);
  digitalWrite(greenLED, LOW);
  delay(1000);  // 1 second

  // GREEN light (go)
  Serial.println("GREEN - Go");
  digitalWrite(redLED, LOW);
  digitalWrite(yellowLED, LOW);
  digitalWrite(greenLED, HIGH);
  delay(3000);  // 3 seconds

  // YELLOW again before returning to RED
  Serial.println("YELLOW - Slowing Down");
  digitalWrite(redLED, LOW);
  digitalWrite(yellowLED, HIGH);
  digitalWrite(greenLED, LOW);
  delay(1000);  // 1 second
}`,

    challenges: {
      easy: 'Change the timing to make the green light stay on for 5 seconds instead of 3',
      medium: 'Add a fourth LED (blue) on pin 11 that blinks while yellow light is on',
      hard: 'Create a pedestrian crossing: add a button that, when pressed, changes lights to red and blinks a white LED for 10 seconds',
      expert: 'Build a 4-way intersection with 2 sets of traffic lights that alternate (when one is green, other is red)'
    }
  },

  5: {
    title: 'Reading Button Inputs',
    components: [
      'Arduino Uno board',
      'Pushbutton (tactile switch)',
      '10kΩ resistor (brown-black-orange)',
      'LED (any color)',
      '220Ω resistor (red-red-brown)',
      'Breadboard',
      '6 jumper wires'
    ],
    theory: `Reading button inputs allows Arduino to respond to user actions. When you press a button, you're completing a circuit, allowing current to flow.

**Pull-down Resistor Configuration:**
- Button not pressed: Pin reads LOW (0V through resistor to GND)
- Button pressed: Pin reads HIGH (5V from Arduino)
- Resistor prevents "floating" voltage when button is not pressed

**Why 10kΩ?**
- High enough to prevent excessive current drain
- Low enough to pull pin reliably to GND
- Standard value for digital inputs

**Debouncing:**
When you press a physical button, it doesn't make a clean on/off transition. The metal contacts "bounce" causing multiple rapid on/off signals (lasting 5-50ms). We handle this with software delays or debounce libraries.`,

    wiring: `### Step-by-Step Wiring:
1. Place pushbutton on breadboard spanning the center gap
2. Connect one button leg to Arduino 5V
3. Connect opposite button leg to pin 2 AND to 10kΩ resistor
4. Connect other end of 10kΩ resistor to GND (this is the pull-down)
5. Wire LED with 220Ω resistor to pin 13 (like Module 2)

### Wiring Diagram:
\`\`\`
Arduino Uno
┌─────────────────┐
│                 │
│  [5V]───────────○───┐
│                 │   │
│                 │  ┌───┐ Pushbutton
│  [PIN 2]────────○──┤   ├──┐
│                 │  └───┘  │
│                 │         │
│                 │      [10kΩ]
│                 │         │
│  [GND]──────────○─────────┴──────[LED-]
│                 │
│  [PIN 13]───────○───[220Ω]───>|─── (LED connected)
│                 │
└─────────────────┘

Button Schematic:
  5V ──┬── [Button] ── Pin 2 ──┬── 10kΩ ── GND
       │                       │
    (Open)                 (Pull-down)
\`\`\``,

    code: `// Button Controlled LED
// Press button to turn LED on, release to turn off
// Includes debounce logic

const int buttonPin = 2;  // Pushbutton connected to pin 2
const int ledPin = 13;    // LED connected to pin 13

int buttonState = 0;         // Current button state
int lastButtonState = 0;     // Previous button state
unsigned long lastDebounceTime = 0;  // Last time button changed
unsigned long debounceDelay = 50;    // Debounce time in ms

void setup() {
  pinMode(buttonPin, INPUT);   // Button is an input
  pinMode(ledPin, OUTPUT);     // LED is an output

  Serial.begin(9600);
  Serial.println("Button Controller Ready!");
  Serial.println("Press button to control LED");
}

void loop() {
  // Read current button state
  int reading = digitalRead(buttonPin);

  // If button state changed, reset debounce timer
  if (reading != lastButtonState) {
    lastDebounceTime = millis();
  }

  // If enough time has passed, accept the new state
  if ((millis() - lastDebounceTime) > debounceDelay) {
    // If state actually changed
    if (reading != buttonState) {
      buttonState = reading;

      // Control LED based on button state
      if (buttonState == HIGH) {
        digitalWrite(ledPin, HIGH);
        Serial.println("Button PRESSED - LED ON");
      } else {
        digitalWrite(ledPin, LOW);
        Serial.println("Button RELEASED - LED OFF");
      }
    }
  }

  lastButtonState = reading;
}`,

    challenges: {
      easy: 'Make the LED turn OFF when button is pressed (inverted logic)',
      medium: 'Add a second button on pin 3 that controls a second LED - create a two-button game',
      hard: 'Make the button toggle the LED (press once = on, press again = off) using a state variable',
      expert: 'Create a morse code sender: short press = dot, long press (>500ms) = dash, display on Serial Monitor'
    }
  },

  6: {
    title: 'Working with Potentiometers',
    components: [
      'Arduino Uno board',
      '10kΩ potentiometer (variable resistor)',
      'LED (any color)',
      '220Ω resistor',
      'Breadboard',
      '5 jumper wires'
    ],
    theory: `A potentiometer is a variable resistor with three terminals. Rotating the knob changes resistance between the middle pin and the two outer pins.

**How It Works:**
- Outer pins: Connected to 5V and GND
- Middle pin (wiper): Outputs variable voltage (0-5V)
- Arduino reads this voltage as a number (0-1023)

**analogRead() Function:**
- Reads voltage on analog pins (A0-A5)
- Returns value 0-1023 (10-bit resolution)
- 0 = 0V, 1023 = 5V
- Formula: Voltage = (reading / 1023) × 5V

**map() Function:**
Maps one range to another:
\`\`\`cpp
map(value, fromLow, fromHigh, toLow, toHigh)
map(512, 0, 1023, 0, 255)  // Returns 127
\`\`\`

This is essential for converting sensor readings to usable values!`,

    wiring: `### Step-by-Step Wiring:
1. Place potentiometer on breadboard
2. Connect left pin to Arduino 5V
3. Connect right pin to Arduino GND
4. Connect middle pin (wiper) to Arduino A0
5. Wire LED with resistor to pin 9 (PWM-capable pin)

### Wiring Diagram:
\`\`\`
Potentiometer (Top View)
       ┌───┐
  5V ──┤ 1 ├── Outer pins
       ├───┤
  A0 ──┤ 2 ├── Middle pin (wiper)
       ├───┤
  GND ─┤ 3 ├── Outer pins
       └───┘

Arduino Uno
┌─────────────────┐
│                 │
│  [5V]───────────○────────┬── Pot Pin 1
│                 │        │
│  [A0]───────────○────────┼── Pot Pin 2 (middle)
│                 │        │
│  [GND]──────────○────────┴── Pot Pin 3
│                 │
│  [PIN 9]────────○───[220Ω]───>|───GND
│                 │           (LED)
└─────────────────┘
\`\`\``,

    code: `// Potentiometer LED Brightness Control
// Turn knob to change LED brightness (0-255)

const int potPin = A0;    // Potentiometer connected to analog pin A0
const int ledPin = 9;     // LED on PWM pin 9

int potValue = 0;         // Value read from potentiometer (0-1023)
int brightness = 0;       // PWM brightness value (0-255)

void setup() {
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
  Serial.println("Potentiometer Brightness Control");
  Serial.println("Turn knob to adjust LED brightness");
}

void loop() {
  // Read potentiometer value (0-1023)
  potValue = analogRead(potPin);

  // Map to PWM range (0-255)
  brightness = map(potValue, 0, 1023, 0, 255);

  // Set LED brightness
  analogWrite(ledPin, brightness);

  // Display values on Serial Monitor
  Serial.print("Pot Value: ");
  Serial.print(potValue);
  Serial.print(" | Brightness: ");
  Serial.print(brightness);
  Serial.print(" | Percentage: ");
  Serial.print((brightness * 100) / 255);
  Serial.println("%");

  delay(100);  // Small delay for stability
}`,

    challenges: {
      easy: 'Change the map() function to make the LED only use 50-100% brightness (never fully off)',
      medium: 'Add a second LED that gets brighter as the first gets dimmer (inverse relationship)',
      hard: 'Use the potentiometer to control RGB LED color: rotate through red → green → blue spectrum',
      expert: 'Create a "snap to preset" feature: divide rotation into 5 zones, each zone sets LED to specific brightness (0%, 25%, 50%, 75%, 100%)'
    }
  },

  7: {
    title: 'Serial Monitor Basics',
    components: [
      'Arduino Uno board',
      'USB cable',
      '(Optional) LED and resistor for visual feedback'
    ],
    theory: `The Serial Monitor is your debugging window into Arduino. It allows two-way communication between Arduino and your computer via USB.

**How Serial Communication Works:**
- Uses TX (transmit) and RX (receive) pins
- USB connection handles this automatically
- Data sent as bytes at a specific speed (baud rate)

**Baud Rate:**
Common speeds: 9600, 115200 bps (bits per second)
- Both Arduino and Serial Monitor must match
- 9600 is standard for most projects
- Higher rates for fast data logging

**Key Functions:**
\`\`\`cpp
Serial.begin(9600);       // Initialize at 9600 baud
Serial.print("Text");     // Print without newline
Serial.println("Text");   // Print with newline
Serial.read();            // Read incoming byte
Serial.available();       // Check if data waiting
\`\`\`

**Why It's Essential:**
- Debug code without external displays
- Monitor sensor values in real-time
- Send commands to Arduino from computer
- Log data for analysis`,

    wiring: `### No External Wiring Required!
Just connect Arduino to computer via USB cable.

### Optional LED Feedback:
If you want visual confirmation:
\`\`\`
Arduino Uno
┌─────────────────┐
│                 │
│  [PIN 13]───────○───[220Ω]───>|───GND
│                 │           (Built-in LED)
│                 │
│  [USB Port]─────○────── Computer
│                 │
└─────────────────┘
\`\`\``,

    code: `// Interactive Serial Monitor Demo
// Type commands in Serial Monitor to control Arduino

const int ledPin = 13;
int ledState = LOW;

void setup() {
  pinMode(ledPin, OUTPUT);

  // Initialize serial communication at 9600 baud
  Serial.begin(9600);

  // Print welcome message
  Serial.println("╔════════════════════════════════════╗");
  Serial.println("║  Arduino Serial Monitor Demo      ║");
  Serial.println("╚════════════════════════════════════╝");
  Serial.println();
  Serial.println("Available Commands:");
  Serial.println("  'on'  - Turn LED on");
  Serial.println("  'off' - Turn LED off");
  Serial.println("  'status' - Show LED state");
  Serial.println("  'help' - Show this menu");
  Serial.println();
  Serial.print("> ");  // Prompt
}

void loop() {
  // Check if data is available to read
  if (Serial.available() > 0) {
    // Read incoming string until newline
    String command = Serial.readStringUntil('\\n');
    command.trim();  // Remove whitespace
    command.toLowerCase();  // Convert to lowercase

    // Process command
    if (command == "on") {
      digitalWrite(ledPin, HIGH);
      ledState = HIGH;
      Serial.println("✓ LED turned ON");

    } else if (command == "off") {
      digitalWrite(ledPin, LOW);
      ledState = LOW;
      Serial.println("✓ LED turned OFF");

    } else if (command == "status") {
      Serial.print("LED is currently: ");
      Serial.println(ledState == HIGH ? "ON" : "OFF");

    } else if (command == "help") {
      Serial.println("Available Commands:");
      Serial.println("  on, off, status, help");

    } else if (command.length() > 0) {
      Serial.print("✗ Unknown command: '");
      Serial.print(command);
      Serial.println("'");
      Serial.println("Type 'help' for command list");
    }

    Serial.print("> ");  // Show prompt again
  }
}`,

    challenges: {
      easy: 'Add a "blink" command that blinks the LED 3 times',
      medium: 'Add commands "bright", "medium", "dim" that set LED brightness using PWM (requires moving to pin 9)',
      hard: 'Create a simple calculator: type "5+3" and Arduino prints "= 8" (parse the string and do math)',
      expert: 'Build a data logger: type "log" to start recording sensor data every second, "stop" to end, display statistics (min/max/average)'
    }
  }
};

/**
 * Generate lesson content for a module
 */
function generateLesson(moduleNumber) {
  const module = curriculumData.curriculum.modules.find(m => m.id === moduleNumber);
  if (!module) {
    throw new Error(`Module ${moduleNumber} not found in curriculum data`);
  }

  const content = MODULE_CONTENT[moduleNumber];
  if (!content) {
    throw new Error(`Content not defined for module ${moduleNumber}. Please add it to MODULE_CONTENT.`);
  }

  const lesson = `# ${content.title}

## 1. Introduction
Welcome to ${content.title}! This module builds on everything you've learned so far and introduces crucial concepts that you'll use in almost every Arduino project.

${module.tags ? `This lesson covers: ${module.tags.join(', ')}` : ''}

By the end of this module, you'll understand how to ${content.title.toLowerCase()} and be able to apply this knowledge to create interactive projects.

## 2. Components Needed
${content.components.map(c => `- ${c}`).join('\n')}

## 3. How It Works (Theory)

${content.theory}

## 4. Wiring Instructions

${content.wiring}

## 5. Arduino Code

\`\`\`cpp
${content.code}
\`\`\`

## 6. Code Explanation

Let's break down the important parts:

- **Pin Configuration**: We define pin numbers as constants at the top for easy modification
- **setup()**: Runs once when Arduino starts - we configure pins and initialize Serial
- **loop()**: Runs continuously - contains our main program logic
- **Serial Output**: Provides feedback so you can see what's happening

## 7. Upload and Test

1. Connect Arduino to your computer via USB
2. Wire the circuit exactly as shown in the diagram
3. Open Arduino IDE and paste the code
4. Select **Tools → Board → Arduino Uno**
5. Select **Tools → Port → [Your Arduino's COM port]**
6. Click **Upload** (or press Ctrl+U)
7. Open **Serial Monitor** (Ctrl+Shift+M) and set baud rate to **9600**
8. Observe the behavior described in the code comments

### Expected Behavior:
You should see the components respond as programmed. Check the Serial Monitor for debug output that confirms everything is working correctly.

## 8. Troubleshooting

**Problem**: Nothing happens after upload
**Solution**:
- Check all wiring connections
- Verify component orientation (LEDs, buttons have polarity)
- Open Serial Monitor to see if code is running
- Try pressing the Arduino's reset button

**Problem**: Serial Monitor shows garbled text
**Solution**: Baud rate mismatch - set Serial Monitor to 9600 baud

**Problem**: Code compiles but doesn't work as expected
**Solution**: Add Serial.println() statements to debug - print variable values to see what's happening

**Problem**: "Not in sync" error during upload
**Solution**: Check that correct board and port are selected in Tools menu

## 9. Challenge Exercises

Test your understanding with these progressively harder challenges:

### 🟢 Easy:
${content.challenges.easy}

### 🟡 Medium:
${content.challenges.medium}

### 🔴 Hard:
${content.challenges.hard}

### ⚫ Expert:
${content.challenges.expert}

## 10. Key Takeaways

- ${content.title} is fundamental to Arduino projects
- Always test circuit wiring before uploading code
- Use Serial Monitor for debugging and feedback
- Start simple, then add complexity gradually
- Pin numbers in code must match physical wiring

## 11. Going Further

Now that you've mastered ${content.title.toLowerCase()}, you can:
- Combine this with previous modules for more complex projects
- Explore different component configurations
- Build projects that solve real-world problems

**Next Module**: Continue to Module ${moduleNumber + 1} to learn ${curriculumData.curriculum.modules.find(m => m.id === moduleNumber + 1)?.title || 'the next concept'}!

**Related Modules**:
${module.prerequisites.map(p => `- ${p}`).join('\n') || '- Previous modules in the beginner track'}

---

💡 **Pro Tip**: Keep this code handy! You'll use variations of these patterns in many future projects.
`;

  return lesson;
}

/**
 * Generate overview content for a module
 */
function generateOverview(moduleNumber) {
  const module = curriculumData.curriculum.modules.find(m => m.id === moduleNumber);
  if (!module) {
    throw new Error(`Module ${moduleNumber} not found`);
  }

  const content = MODULE_CONTENT[moduleNumber];
  if (!content) {
    throw new Error(`Content not defined for module ${moduleNumber}`);
  }

  // Get prerequisites
  const prereqs = module.prerequisites && module.prerequisites.length > 0
    ? module.prerequisites
    : ['Introduction to Arduino & IDE'];

  const overview = `# ${content.title}

## Level
${module.difficulty}

## Time Estimate
${module.duration}

## Overview
${content.title} is a crucial skill in Arduino programming. This hands-on module teaches you how to ${content.title.toLowerCase()} effectively, building on concepts from previous lessons.

You'll learn practical techniques used in thousands of real-world Arduino projects, from simple prototypes to commercial products. The knowledge you gain here will be applicable to robotics, home automation, IoT devices, and interactive art installations.

## Prerequisites
${prereqs.map(p => `- ${p}`).join('\n')}

## Learning Outcomes
After completing this module, you will be able to:
- Understand the theory and practical application of ${content.title.toLowerCase()}
- Wire circuits correctly and safely
- Write clean, commented code using best practices
- Debug common issues independently
- Apply this knowledge to create your own projects
- Combine this skill with other modules for complex builds

## What You'll Build
A fully functional project demonstrating ${content.title.toLowerCase()}, complete with:
- Proper circuit wiring and component selection
- Production-ready Arduino code with error handling
- Serial Monitor debugging output
- Multiple challenge exercises to test your skills

---

**Difficulty**: ⭐${module.difficulty === 'Beginner' ? '⭐☆☆☆' : module.difficulty === 'Intermediate' ? '⭐⭐⭐☆' : '⭐⭐⭐⭐'} (${module.difficulty})
**Estimated Time**: 🕐 ${module.duration}
**Components Needed**: 💰 Under $10
`;

  return overview;
}

/**
 * Main script execution
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║  NovEng Module Content Generator                       ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log('');
    console.log('Usage: node generate-module-content.js <module-number>');
    console.log('       node generate-module-content.js all');
    console.log('');
    console.log('Examples:');
    console.log('  node generate-module-content.js 4    # Generate Module 4');
    console.log('  node generate-module-content.js all  # Generate all modules 4-7');
    console.log('');
    console.log('Available modules:');
    Object.keys(MODULE_CONTENT).forEach(num => {
      const module = curriculumData.curriculum.modules.find(m => m.id === parseInt(num));
      console.log(`  ${num}: ${module?.title || 'Unknown'}`);
    });
    process.exit(0);
  }

  const command = args[0];

  try {
    if (command === 'all') {
      // Generate all modules with content defined
      console.log('🚀 Generating all available modules...\n');

      Object.keys(MODULE_CONTENT).forEach(num => {
        const moduleNumber = parseInt(num);
        console.log(`📝 Generating Module ${moduleNumber}...`);

        const lessonContent = generateLesson(moduleNumber);
        const overviewContent = generateOverview(moduleNumber);

        const module = curriculumData.curriculum.modules.find(m => m.id === moduleNumber);
        const modulePath = join(__dirname, `../curriculum/${module.slug}`);

        writeFileSync(join(modulePath, 'lesson.md'), lessonContent);
        writeFileSync(join(modulePath, 'overview.md'), overviewContent);

        console.log(`   ✓ Created lesson.md`);
        console.log(`   ✓ Created overview.md`);
        console.log('');
      });

      console.log('✅ All modules generated successfully!');

    } else {
      // Generate single module
      const moduleNumber = parseInt(command);

      if (isNaN(moduleNumber)) {
        console.error('❌ Error: Module number must be a number or "all"');
        process.exit(1);
      }

      console.log(`📝 Generating Module ${moduleNumber}...\n`);

      const lessonContent = generateLesson(moduleNumber);
      const overviewContent = generateOverview(moduleNumber);

      const module = curriculumData.curriculum.modules.find(m => m.id === moduleNumber);
      const modulePath = join(__dirname, `../curriculum/${module.slug}`);

      writeFileSync(join(modulePath, 'lesson.md'), lessonContent);
      writeFileSync(join(modulePath, 'overview.md'), overviewContent);

      console.log(`✓ Created ${modulePath}/lesson.md`);
      console.log(`✓ Created ${modulePath}/overview.md`);
      console.log('');
      console.log('✅ Module generated successfully!');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
