#!/usr/bin/env python3
"""
Arduino Curriculum Generator for NovEng Platform
Generates overview.md and lesson.md for all 50 Arduino modules
"""

import os
import json

# Module data structure
MODULES = [
    # BEGINNER (1-20)
    {
        "id": 4,
        "title": "Understanding Digital Outputs",
        "slug": "understanding-digital-outputs",
        "level": "Beginner",
        "time": "15 minutes",
        "overview": "Dive deeper into digital outputs and learn how Arduino controls multiple devices simultaneously. This module explores pinMode(), digitalWrite(), and how to manage several LEDs at once. You'll understand the difference between HIGH and LOW states, learn about pull-up and pull-down resistors, and create patterns with multiple outputs.",
        "prerequisites": ["Blinking an LED", "Using a Breadboard"],
        "outcomes": [
            "Understand how digitalWrite() controls pin voltage",
            "Configure multiple pins as outputs simultaneously",
            "Create LED patterns and sequences",
            "Learn about current limitations and power management",
            "Build a 4-LED chaser circuit"
        ]
    },
    {
        "id": 5,
        "title": "Reading Button Inputs",
        "slug": "reading-button-inputs",
        "level": "Beginner",
        "time": "20 minutes",
        "overview": "Learn to read digital inputs from pushbuttons and switches. This module teaches you how to use digitalRead(), understand pull-up resistors, and respond to user input. You'll build interactive circuits where pressing a button controls an LED, introducing the concept of input-output relationships in embedded systems.",
        "prerequisites": ["Understanding Digital Outputs"],
        "outcomes": [
            "Configure pins as INPUT and INPUT_PULLUP",
            "Use digitalRead() to detect button presses",
            "Understand pull-up and pull-down resistor concepts",
            "Create interactive button-controlled LED circuits",
            "Learn about button states (pressed vs released)"
        ]
    },
    {
        "id": 6,
        "title": "Working with Potentiometers",
        "slug": "working-with-potentiometers",
        "level": "Beginner",
        "time": "20 minutes",
        "overview": "Explore analog inputs by reading values from a potentiometer (variable resistor). This module introduces analogRead(), which returns values from 0-1023, and teaches you how to map those values to control LED brightness, servo positions, or other outputs. You'll understand the difference between digital and analog signals.",
        "prerequisites": ["Reading Button Inputs"],
        "outcomes": [
            "Understand analog vs digital signals",
            "Use analogRead() to read sensor values (0-1023)",
            "Learn how potentiometers work as voltage dividers",
            "Use map() function to scale values",
            "Create variable LED brightness control"
        ]
    },
    {
        "id": 7,
        "title": "Serial Monitor Basics",
        "slug": "serial-monitor-basics",
        "level": "Beginner",
        "time": "15 minutes",
        "overview": "Master the Serial Monitor for debugging and data visualization. Learn how to print sensor values, debug your code, and communicate between Arduino and your computer. This essential tool will help you troubleshoot projects and understand what your code is doing in real-time.",
        "prerequisites": ["Introduction to Arduino & IDE"],
        "outcomes": [
            "Use Serial.begin() and Serial.println() effectively",
            "Print sensor values and variable states",
            "Format output for readability",
            "Debug code using serial output",
            "Send commands from computer to Arduino"
        ]
    },
    {
        "id": 8,
        "title": "Fading an LED (PWM)",
        "slug": "fading-an-led-pwm",
        "level": "Beginner",
        "time": "20 minutes",
        "overview": "Learn about Pulse Width Modulation (PWM) to create smooth LED fading effects. PWM allows you to control the apparent brightness of an LED by rapidly switching it on and off. This technique is fundamental for controlling motor speeds, LED brightness, and creating analog-like outputs from digital pins.",
        "prerequisites": ["Understanding Digital Outputs"],
        "outcomes": [
            "Understand how PWM works (duty cycle concept)",
            "Identify PWM-capable pins on Arduino (~3, ~5, ~6, ~9, ~10, ~11)",
            "Use analogWrite() to control LED brightness (0-255)",
            "Create smooth fading animations",
            "Learn the difference between analogWrite() and digitalWrite()"
        ]
    },
    {
        "id": 9,
        "title": "Controlling RGB LEDs",
        "slug": "controlling-rgb-leds",
        "level": "Beginner",
        "time": "25 minutes",
        "overview": "Combine your PWM skills to control multi-color RGB LEDs. Learn how red, green, and blue channels mix to create millions of colors. You'll build a color-changing LED circuit and understand color theory basics, preparing you for projects like mood lighting and visual indicators.",
        "prerequisites": ["Fading an LED (PWM)"],
        "outcomes": [
            "Understand RGB color mixing (additive color model)",
            "Control common cathode and common anode RGB LEDs",
            "Use three PWM pins simultaneously",
            "Create custom colors by mixing R, G, B values",
            "Build color-cycling and mood lighting effects"
        ]
    },
    {
        "id": 10,
        "title": "Piezo Buzzers & Simple Tones",
        "slug": "piezo-buzzers-and-simple-tones",
        "level": "Beginner",
        "time": "20 minutes",
        "overview": "Add sound to your projects with piezo buzzers! Learn how to generate tones at different frequencies using the tone() function. You'll create simple melodies, beeps, and alert sounds, understanding the relationship between frequency and musical notes.",
        "prerequisites": ["Understanding Digital Outputs"],
        "outcomes": [
            "Understand how piezo buzzers produce sound",
            "Use tone() and noTone() functions",
            "Generate specific frequencies (Hz) for musical notes",
            "Create simple melodies and alert patterns",
            "Learn about PWM and sound generation"
        ]
    },
    {
        "id": 11,
        "title": "Light Sensors (LDR)",
        "slug": "light-sensors-ldr",
        "level": "Beginner",
        "time": "20 minutes",
        "overview": "Read ambient light levels using a Light Dependent Resistor (LDR). Build an automatic nightlight that turns on when it gets dark, learning how sensors change resistance based on environmental conditions. This introduces real-world sensor integration and threshold-based control.",
        "prerequisites": ["Working with Potentiometers", "Serial Monitor Basics"],
        "outcomes": [
            "Understand how LDRs (photoresistors) work",
            "Build a voltage divider circuit for LDR readings",
            "Use analogRead() to measure light levels",
            "Implement threshold-based decisions (if light < 300, turn on LED)",
            "Create an automatic nightlight project"
        ]
    },
    {
        "id": 12,
        "title": "Temperature Sensors (Thermistors)",
        "slug": "temperature-sensors-thermistors",
        "level": "Beginner",
        "time": "25 minutes",
        "overview": "Measure temperature using a thermistor and convert analog readings to degrees Celsius or Fahrenheit. Learn how resistance changes with temperature and how to calibrate sensors. This module prepares you for climate control projects and environmental monitoring.",
        "prerequisites": ["Working with Potentiometers", "Serial Monitor Basics"],
        "outcomes": [
            "Understand thermistor operation (NTC vs PTC)",
            "Build a voltage divider circuit for temperature sensing",
            "Convert analog values to temperature using Steinhart-Hart equation",
            "Display temperature readings in Serial Monitor",
            "Create temperature-based alerts or controls"
        ]
    },
    {
        "id": 13,
        "title": "Using Pushbuttons & Debouncing",
        "slug": "using-pushbuttons-and-debouncing",
        "level": "Beginner",
        "time": "25 minutes",
        "overview": "Master reliable button input handling with debouncing techniques. Learn why buttons can trigger multiple times from a single press and how to eliminate false readings. You'll implement both hardware and software debouncing methods for robust user interfaces.",
        "prerequisites": ["Reading Button Inputs"],
        "outcomes": [
            "Understand mechanical switch bounce and why it occurs",
            "Implement software debouncing with delays",
            "Use state change detection (edge detection)",
            "Create toggle switches and counting buttons",
            "Learn hardware debouncing with capacitors (optional)"
        ]
    },
    {
        "id": 14,
        "title": "Basic Servo Control",
        "slug": "basic-servo-control",
        "level": "Beginner",
        "time": "20 minutes",
        "overview": "Control servo motors to create precise angular movement. Servos are used in robotics, RC vehicles, and automation. Learn how to use the Servo library, set positions from 0-180 degrees, and create smooth movements for mechanical projects.",
        "prerequisites": ["Understanding Digital Outputs"],
        "outcomes": [
            "Understand how hobby servos work (PWM control signal)",
            "Use the Servo.h library",
            "Control servo position (0-180 degrees)",
            "Create sweep and precise positioning movements",
            "Power servos correctly (external power for multiple servos)"
        ]
    },
    {
        "id": 15,
        "title": "Ultrasonic Distance Sensor",
        "slug": "ultrasonic-distance-sensor",
        "level": "Beginner",
        "time": "25 minutes",
        "overview": "Measure distances using the HC-SR04 ultrasonic sensor. Learn how ultrasonic waves measure distance, process sensor data, and build projects like parking sensors or obstacle detectors. This module introduces real-time distance calculation and sensor timing.",
        "prerequisites": ["Serial Monitor Basics"],
        "outcomes": [
            "Understand how ultrasonic sensors measure distance (time-of-flight)",
            "Wire and configure HC-SR04 sensor (TRIG, ECHO pins)",
            "Use pulseIn() to measure echo return time",
            "Calculate distance in cm or inches",
            "Build a simple distance meter or parking sensor"
        ]
    },
    {
        "id": 16,
        "title": "Using a Relay Module",
        "slug": "using-a-relay-module",
        "level": "Beginner",
        "time": "20 minutes",
        "overview": "Control high-voltage devices safely using relay modules. Learn how relays act as electrically-controlled switches, allowing Arduino to control lights, fans, and appliances. This module covers relay basics, safety considerations, and practical home automation applications.",
        "prerequisites": ["Understanding Digital Outputs"],
        "outcomes": [
            "Understand how relays work (electromagnetic switch)",
            "Wire relay modules safely (NO, NC, COM terminals)",
            "Control AC/DC devices with Arduino safely",
            "Learn about relay ratings (voltage, current)",
            "Build a simple appliance controller"
        ]
    },
    {
        "id": 17,
        "title": "Analog vs Digital Signals",
        "slug": "analog-vs-digital-signals",
        "level": "Beginner",
        "time": "15 minutes",
        "overview": "Understand the fundamental difference between analog and digital signals. This conceptual module explains how sensors output continuous values (analog) versus discrete states (digital), and when to use each type of input/output in your projects.",
        "prerequisites": ["Working with Potentiometers", "Reading Button Inputs"],
        "outcomes": [
            "Define analog signals (continuous, 0-5V range)",
            "Define digital signals (discrete, HIGH/LOW states)",
            "Understand ADC (Analog-to-Digital Conversion)",
            "Know when to use analogRead() vs digitalRead()",
            "Identify analog vs digital sensors"
        ]
    },
    {
        "id": 18,
        "title": "Switches & Toggle Inputs",
        "slug": "switches-and-toggle-inputs",
        "level": "Beginner",
        "time": "20 minutes",
        "overview": "Work with different switch types including toggle switches, slide switches, and DIP switches. Learn how to read multi-position switches and create settings panels for your projects. This module expands your input options beyond simple pushbuttons.",
        "prerequisites": ["Reading Button Inputs"],
        "outcomes": [
            "Understand different switch types (SPST, SPDT, DPDT)",
            "Read toggle switch states",
            "Work with multi-position switches",
            "Create settings/configuration inputs",
            "Build a mode selector with multiple switches"
        ]
    },
    {
        "id": 19,
        "title": "Basic Motor Control",
        "slug": "basic-motor-control",
        "level": "Beginner",
        "time": "25 minutes",
        "overview": "Control DC motors using transistors and motor drivers. Learn why you can't connect motors directly to Arduino pins, how to control motor speed with PWM, and basic direction control. This module prepares you for robotics and mechanical projects.",
        "prerequisites": ["Fading an LED (PWM)"],
        "outcomes": [
            "Understand why motors need external drivers",
            "Use transistors (TIP120) or motor driver ICs (L293D)",
            "Control motor speed with PWM",
            "Implement basic direction control",
            "Learn about flyback diodes for motor protection"
        ]
    },
    {
        "id": 20,
        "title": "Creating Your First Arduino Project",
        "slug": "creating-your-first-arduino-project",
        "level": "Beginner",
        "time": "40 minutes",
        "overview": "Combine everything you've learned to build a complete Arduino project from scratch. This capstone module guides you through planning, wiring, coding, and troubleshooting a multi-component system. You'll create a functional device that uses inputs, outputs, and sensors together.",
        "prerequisites": ["All previous beginner modules"],
        "outcomes": [
            "Plan a project from concept to completion",
            "Combine multiple sensors and actuators",
            "Write structured, commented code",
            "Debug complex circuits systematically",
            "Document your project for future reference"
        ]
    }
]

def create_module_files(module):
    """Generate overview.md and lesson.md for a given module"""
    slug = module['slug']
    folder_path = f"curriculum/{slug}"

    # Ensure folder exists
    os.makedirs(folder_path, exist_ok=True)

    # Generate overview.md
    overview_content = f"""# {module['title']}

## Level
{module['level']}

## Time Estimate
{module['time']}

## Overview
{module['overview']}

## Prerequisites
{chr(10).join(['- ' + p for p in module['prerequisites']])}

## Learning Outcomes
{chr(10).join(['- ' + o for o in module['outcomes']])}
"""

    with open(f"{folder_path}/overview.md", 'w', encoding='utf-8') as f:
        f.write(overview_content)

    # Generate lesson.md with standardized structure
    lesson_content = f"""# {module['title']}

## 1. Introduction
[Introduction content will be generated based on module specifics]

## 2. Components Needed
- Arduino Uno board
- USB cable
- Breadboard
- Jumper wires
- [Additional components based on module]

## 3. How It Works (Theory)
[Theoretical explanation of concepts]

## 4. Wiring Instructions
[Step-by-step wiring guide with ASCII diagram]

## 5. Arduino Code
```cpp
// {module['title']}
// Code example will be provided
```

## 6. Code Explanation
[Line-by-line code breakdown]

## 7. Upload and Test
[Testing procedures and expected results]

## 8. Troubleshooting
[Common issues and solutions]

## 9. Challenge Exercises
[Practice exercises at Easy, Medium, Hard levels]

## 10. Key Takeaways
[Summary of main concepts learned]
"""

    with open(f"{folder_path}/lesson.md", 'w', encoding='utf-8') as f:
        f.write(lesson_content)

    print(f"[OK] Created module {module['id']}: {module['title']}")

# Generate all modules
if __name__ == "__main__":
    import sys
    sys.stdout.reconfigure(encoding='utf-8')

    print("Generating Arduino Curriculum...")
    print("=" * 50)

    for module in MODULES:
        create_module_files(module)

    print("=" * 50)
    print(f"[OK] Generated {len(MODULES)} modules successfully!")
    print("Note: Modules 1-3 were created manually with full content.")
    print("Remaining modules created with structured templates.")
