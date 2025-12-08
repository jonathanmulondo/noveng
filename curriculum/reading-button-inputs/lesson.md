# Reading Button Inputs

## 1. Introduction
Welcome to Reading Button Inputs! This module builds on everything you've learned so far and introduces crucial concepts that you'll use in almost every Arduino project.

This lesson covers: button, digital-input, digitalRead, pullup

By the end of this module, you'll understand how to reading button inputs and be able to apply this knowledge to create interactive projects.

## 2. Components Needed
- Arduino Uno board
- Pushbutton (tactile switch)
- 10kΩ resistor (brown-black-orange)
- LED (any color)
- 220Ω resistor (red-red-brown)
- Breadboard
- 6 jumper wires

## 3. How It Works (Theory)

Reading button inputs allows Arduino to respond to user actions. When you press a button, you're completing a circuit, allowing current to flow.

**Pull-down Resistor Configuration:**
- Button not pressed: Pin reads LOW (0V through resistor to GND)
- Button pressed: Pin reads HIGH (5V from Arduino)
- Resistor prevents "floating" voltage when button is not pressed

**Why 10kΩ?**
- High enough to prevent excessive current drain
- Low enough to pull pin reliably to GND
- Standard value for digital inputs

**Debouncing:**
When you press a physical button, it doesn't make a clean on/off transition. The metal contacts "bounce" causing multiple rapid on/off signals (lasting 5-50ms). We handle this with software delays or debounce libraries.

## 4. Wiring Instructions

### Step-by-Step Wiring:
1. Place pushbutton on breadboard spanning the center gap
2. Connect one button leg to Arduino 5V
3. Connect opposite button leg to pin 2 AND to 10kΩ resistor
4. Connect other end of 10kΩ resistor to GND (this is the pull-down)
5. Wire LED with 220Ω resistor to pin 13 (like Module 2)

### Wiring Diagram:
```
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
```

## 5. Arduino Code

```cpp
// Button Controlled LED
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
Make the LED turn OFF when button is pressed (inverted logic)

### 🟡 Medium:
Add a second button on pin 3 that controls a second LED - create a two-button game

### 🔴 Hard:
Make the button toggle the LED (press once = on, press again = off) using a state variable

### ⚫ Expert:
Create a morse code sender: short press = dot, long press (>500ms) = dash, display on Serial Monitor

## 10. Key Takeaways

- Reading Button Inputs is fundamental to Arduino projects
- Always test circuit wiring before uploading code
- Use Serial Monitor for debugging and feedback
- Start simple, then add complexity gradually
- Pin numbers in code must match physical wiring

## 11. Going Further

Now that you've mastered reading button inputs, you can:
- Combine this with previous modules for more complex projects
- Explore different component configurations
- Build projects that solve real-world problems

**Next Module**: Continue to Module 6 to learn Working with Potentiometers!

**Related Modules**:
- Understanding Digital Outputs

---

💡 **Pro Tip**: Keep this code handy! You'll use variations of these patterns in many future projects.
