# Blinking an LED

## 1. Introduction
Welcome to your first real Arduino hardware project! Blinking an LED is the "Hello World" of electronics. This simple project teaches you the fundamentals of controlling outputs, understanding circuits, and working with Arduino's digital pins. Once you master this, you can control motors, relays, displays, and countless other devices.

## 2. Components Needed
- Arduino Uno board
- LED (any color, typically red, green, or yellow)
- 220Ω resistor (red-red-brown bands)
- Breadboard
- 2 jumper wires

## 3. How It Works (Theory)

### Understanding LEDs
LED stands for Light Emitting Diode. It's a component that lights up when electricity flows through it in the correct direction. LEDs have two legs:
- **Anode (+)**: The longer leg, connects to positive voltage
- **Cathode (-)**: The shorter leg, connects to ground (GND)

### Why Do We Need a Resistor?
LEDs can only handle a limited amount of current (usually around 20mA). Without a resistor, too much current would flow and burn out the LED instantly. The 220Ω resistor limits the current to a safe level.

### Digital Output
Arduino pins can be set to two states:
- **HIGH**: Outputs 5V (turns LED on)
- **LOW**: Outputs 0V (turns LED off)

By switching between HIGH and LOW with delays in between, we create a blinking effect.

## 4. Wiring Instructions

### Step-by-Step Wiring:
1. Insert the LED into the breadboard
2. Connect the LED's long leg (anode) to one end of the 220Ω resistor
3. Connect the other end of the resistor to Arduino pin 13
4. Connect the LED's short leg (cathode) to Arduino GND

### ASCII Wiring Diagram:
```
Arduino Uno
┌─────────────┐
│             │
│     [13]────┼─────[220Ω]─────[LED+]
│             │                  │
│    [GND]────┼──────────────[LED-]
│             │
└─────────────┘

LED Orientation:
  Long leg (+) ──→ to resistor ──→ to pin 13
  Short leg (-) ──→ to GND
```

## 5. Arduino Code

```cpp
// Blink LED on Pin 13
// This program turns an LED on for one second, then off for one second, repeatedly

// Define the pin number where LED is connected
int ledPin = 13;

void setup() {
  // Set pin 13 as an OUTPUT pin
  pinMode(ledPin, OUTPUT);
}

void loop() {
  // Turn the LED on (HIGH means 5V)
  digitalWrite(ledPin, HIGH);

  // Wait for 1 second (1000 milliseconds)
  delay(1000);

  // Turn the LED off (LOW means 0V)
  digitalWrite(ledPin, LOW);

  // Wait for 1 second
  delay(1000);
}
```

## 6. Code Explanation

- **int ledPin = 13**: Creates a variable to store the pin number. This makes code easier to read and modify.
- **pinMode(ledPin, OUTPUT)**: Configures pin 13 as an output so it can send voltage to the LED.
- **digitalWrite(ledPin, HIGH)**: Sets pin 13 to 5V, turning the LED on.
- **digitalWrite(ledPin, LOW)**: Sets pin 13 to 0V, turning the LED off.
- **delay(1000)**: Pauses the program for 1000 milliseconds (1 second).

## 7. Upload and Test

1. Wire the circuit exactly as shown in the diagram
2. Upload the code to your Arduino
3. The LED should blink on and off every second
4. If it doesn't work, check the wiring and LED orientation

## 8. Troubleshooting

**Problem**: LED doesn't light up
**Solution**:
- Check LED orientation (long leg to resistor)
- Verify resistor is connected to pin 13
- Make sure GND connection is secure

**Problem**: LED is very dim
**Solution**: Resistor value might be too high. Try a lower value (150Ω or 180Ω).

**Problem**: LED stays on constantly
**Solution**: Code might not have uploaded. Re-upload and check for errors.

## 9. Challenge Exercises

Try these variations to deepen your understanding:

**Easy**:
- Make the LED blink faster (change delay to 250ms)
- Make it blink slower (try 2000ms)

**Medium**:
- Create an SOS pattern: three short blinks, three long blinks, three short blinks
- Use different pins (try pin 12, 11, or 10)

**Hard**:
- Connect two LEDs to different pins and make them alternate
- Create a "heartbeat" pattern (two quick blinks, pause, repeat)

## 10. Key Takeaways

- pinMode() must be called in setup() to configure a pin as INPUT or OUTPUT
- digitalWrite(pin, HIGH) turns a pin on (5V)
- digitalWrite(pin, LOW) turns a pin off (0V)
- delay() pauses your program in milliseconds
- LEDs must be connected with correct polarity (long leg to positive)
- Always use a current-limiting resistor with LEDs

## 11. Going Further

Now that you've mastered blinking an LED, you understand the basics of digital output. This same principle applies to controlling:
- Relays (to switch high-power devices)
- Motors (with a driver circuit)
- Buzzers (for sound)
- Seven-segment displays

In the next module, you'll learn about breadboards in depth and build more complex circuits!
