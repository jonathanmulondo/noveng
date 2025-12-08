# Working with Potentiometers

## 1. Introduction
Welcome to Working with Potentiometers! This module builds on everything you've learned so far and introduces crucial concepts that you'll use in almost every Arduino project.

This lesson covers: analog-input, analogRead, potentiometer, sensors

By the end of this module, you'll understand how to working with potentiometers and be able to apply this knowledge to create interactive projects.

## 2. Components Needed
- Arduino Uno board
- 10kΩ potentiometer (variable resistor)
- LED (any color)
- 220Ω resistor
- Breadboard
- 5 jumper wires

## 3. How It Works (Theory)

A potentiometer is a variable resistor with three terminals. Rotating the knob changes resistance between the middle pin and the two outer pins.

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
```cpp
map(value, fromLow, fromHigh, toLow, toHigh)
map(512, 0, 1023, 0, 255)  // Returns 127
```

This is essential for converting sensor readings to usable values!

## 4. Wiring Instructions

### Step-by-Step Wiring:
1. Place potentiometer on breadboard
2. Connect left pin to Arduino 5V
3. Connect right pin to Arduino GND
4. Connect middle pin (wiper) to Arduino A0
5. Wire LED with resistor to pin 9 (PWM-capable pin)

### Wiring Diagram:
```
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
```

## 5. Arduino Code

```cpp
// Potentiometer LED Brightness Control
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
}
```

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
Change the map() function to make the LED only use 50-100% brightness (never fully off)

### 🟡 Medium:
Add a second LED that gets brighter as the first gets dimmer (inverse relationship)

### 🔴 Hard:
Use the potentiometer to control RGB LED color: rotate through red → green → blue spectrum

### ⚫ Expert:
Create a "snap to preset" feature: divide rotation into 5 zones, each zone sets LED to specific brightness (0%, 25%, 50%, 75%, 100%)

## 10. Key Takeaways

- Working with Potentiometers is fundamental to Arduino projects
- Always test circuit wiring before uploading code
- Use Serial Monitor for debugging and feedback
- Start simple, then add complexity gradually
- Pin numbers in code must match physical wiring

## 11. Going Further

Now that you've mastered working with potentiometers, you can:
- Combine this with previous modules for more complex projects
- Explore different component configurations
- Build projects that solve real-world problems

**Next Module**: Continue to Module 7 to learn Serial Monitor Basics!

**Related Modules**:
- Reading Button Inputs

---

💡 **Pro Tip**: Keep this code handy! You'll use variations of these patterns in many future projects.
