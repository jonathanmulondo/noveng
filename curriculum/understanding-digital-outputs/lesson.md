# Understanding Digital Outputs

## 1. Introduction
Welcome to Understanding Digital Outputs! This module builds on everything you've learned so far and introduces crucial concepts that you'll use in almost every Arduino project.

This lesson covers: digital, pinMode, digitalWrite, LEDs

By the end of this module, you'll understand how to understanding digital outputs and be able to apply this knowledge to create interactive projects.

## 2. Components Needed
- Arduino Uno board
- 3x LEDs (red, yellow, green)
- 3x 220Ω resistors (red-red-brown)
- Breadboard
- 6 jumper wires

## 3. How It Works (Theory)

Digital outputs are the foundation of controlling electronic devices with Arduino. Each pin can be set to one of two states:

**HIGH (5V)**: Pin outputs 5 volts, turning connected devices ON
**LOW (0V)**: Pin outputs 0 volts, turning connected devices OFF

Think of it like a light switch - it's either on or off, nothing in between. This binary (two-state) control is perfect for:
- LEDs (on/off)
- Relays (switching high-power devices)
- Digital displays
- Motors (through motor drivers)

Arduino Uno has 14 digital pins (0-13), but pins 0 and 1 are used for serial communication, so we typically use pins 2-13 for our projects.

## 4. Wiring Instructions

### Step-by-Step Wiring:
1. Insert three LEDs into the breadboard (red, yellow, green)
2. Connect each LED's long leg (anode) to a 220Ω resistor
3. Connect resistors to pins 8, 9, and 10 respectively
4. Connect all LED short legs (cathodes) to Arduino GND

### Wiring Diagram:
```
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
```

## 5. Arduino Code

```cpp
// Traffic Light Simulator
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
Change the timing to make the green light stay on for 5 seconds instead of 3

### 🟡 Medium:
Add a fourth LED (blue) on pin 11 that blinks while yellow light is on

### 🔴 Hard:
Create a pedestrian crossing: add a button that, when pressed, changes lights to red and blinks a white LED for 10 seconds

### ⚫ Expert:
Build a 4-way intersection with 2 sets of traffic lights that alternate (when one is green, other is red)

## 10. Key Takeaways

- Understanding Digital Outputs is fundamental to Arduino projects
- Always test circuit wiring before uploading code
- Use Serial Monitor for debugging and feedback
- Start simple, then add complexity gradually
- Pin numbers in code must match physical wiring

## 11. Going Further

Now that you've mastered understanding digital outputs, you can:
- Combine this with previous modules for more complex projects
- Explore different component configurations
- Build projects that solve real-world problems

**Next Module**: Continue to Module 5 to learn Reading Button Inputs!

**Related Modules**:
- Using a Breadboard

---

💡 **Pro Tip**: Keep this code handy! You'll use variations of these patterns in many future projects.
