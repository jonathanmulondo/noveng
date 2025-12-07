# Reading Button Inputs

## 1. Introduction
Introduction to this Arduino concept.

## 2. Components Needed
- Arduino Uno
- Breadboard
- Pushbutton (tactile switch)
- LED
- 220Ω resistor
- 10kΩ resistor (optional)
- Jumper wires

## 3. How It Works (Theory)
Digital inputs read the state of a pin as either HIGH or LOW. Buttons and switches are the simplest digital inputs. When a button is pressed, it creates or breaks an electrical connection.

Arduino pins have internal pull-up resistors that can be enabled with INPUT_PULLUP. This eliminates the need for external resistors and simplifies circuits. When using INPUT_PULLUP, the pin reads HIGH when the button is not pressed, and LOW when pressed (inverted logic).

digitalRead() returns either HIGH or LOW, allowing your code to respond to user input and make decisions based on external conditions.

## 4. Wiring Instructions

### Step-by-Step:
1. Connect Arduino to breadboard power rails
2. Place components on breadboard
3. Wire connections according to diagram
4. Double-check all connections

### ASCII Wiring Diagram:
```
Arduino Uno          Breadboard
┌─────────────┐
│             │      [Components]
│    [PIN]────┼──────[Component]
│             │            │
│   [GND]─────┼────────────┘
│             │
└─────────────┘
```

## 5. Arduino Code

```cpp
// Button-controlled LED
// Button on pin 2, LED on pin 13

const int buttonPin = 2;
const int ledPin = 13;

int buttonState = 0;  // Variable to store button state

void setup() {
  pinMode(buttonPin, INPUT_PULLUP);  // Button with internal pull-up
  pinMode(ledPin, OUTPUT);

  Serial.begin(9600);
  Serial.println("Button Control Ready!");
}

void loop() {
  // Read the button state
  buttonState = digitalRead(buttonPin);

  // If button is pressed (LOW because of INPUT_PULLUP)
  if (buttonState == LOW) {
    digitalWrite(ledPin, HIGH);  // Turn LED on
    Serial.println("Button PRESSED - LED ON");
  } else {
    digitalWrite(ledPin, LOW);   // Turn LED off
    Serial.println("Button RELEASED - LED OFF");
  }

  delay(100);  // Small delay for stability
}
```

## 6. Code Explanation

The code demonstrates reading button inputs using standard Arduino functions:
- `pinMode()` configures pins
- `digitalWrite()` / `digitalRead()` for digital control
- `analogWrite()` / `analogRead()` for analog values
- `Serial.println()` for debugging output

## 7. Upload and Test

1. Connect your Arduino via USB
2. Select correct Board and Port in Arduino IDE
3. Upload the code (Ctrl+U or click Upload button)
4. Observe the behavior and check Serial Monitor (9600 baud)

## 8. Troubleshooting

**Problem**: Code uploads but nothing happens
**Solution**: Check wiring connections, verify component orientation

**Problem**: Serial Monitor shows no output
**Solution**: Ensure baud rate is set to 9600

**Problem**: Unexpected behavior
**Solution**: Add Serial.println() statements to debug

## 9. Challenge Exercises

**Easy**: Modify delay values to change timing
**Medium**: Add additional components or change pin assignments
**Hard**: Combine this module with previous concepts for a new project

## 10. Key Takeaways

- Reading Button Inputs is essential for [application area]
- Proper wiring and component orientation are critical
- Test incrementally and use Serial Monitor for debugging
- This technique can be expanded to more complex projects

Congratulations! You've mastered reading button inputs. Continue to the next module to build on these skills.
