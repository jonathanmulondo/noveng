# More on Blinking LEDs

## 📦 What You'll Need
- Arduino Uno board
- 5 LEDs (mix of colors - red, yellow, green ideal for traffic light)
- 5× 220Ω resistors
- Breadboard
- 10+ jumper wires
- USB cable

---

## 🌟 From One LED to Many!

You've mastered blinking a single LED - now let's control multiple LEDs at once and create mesmerizing patterns!

In this lesson, you'll build:
- Traffic light systems
- LED chasers (like Knight Rider)
- Heartbeat patterns
- Random blinking effects

These patterns form the foundation of:
- 🚦 Smart traffic control systems
- 🎮 Gaming LED effects
- 🚨 Emergency vehicle lights
- 🎄 Holiday light displays

Let's make LEDs dance! 💡

---

## 🧠 Understanding Arrays

To control multiple LEDs efficiently, we need **arrays** - a way to store multiple values in one variable.

**Without arrays (messy):**
```cpp
int led1 = 9;
int led2 = 10;
int led3 = 11;
int led4 = 12;
int led5 = 13;
```

**With arrays (clean):**
```cpp
int leds[] = {9, 10, 11, 12, 13};
```

**Accessing array values:**
- `leds[0]` = 9 (first LED)
- `leds[1]` = 10 (second LED)
- `leds[2]` = 11 (third LED)
- And so on...

**Important:** Arrays start counting at 0, not 1!

---

## 🔌 Wiring 5 LEDs

Let's wire up 5 LEDs to pins 9, 10, 11, 12, and 13.

**For each LED:**
1. Place LED in breadboard
2. Connect long leg → 220Ω resistor → Arduino pin (9-13)
3. Connect short leg → GND rail
4. Connect GND rail → Arduino GND

**Quick Wiring:**
```
Pin 9  ──[220Ω]──(LED1+)──(LED1-)─┐
Pin 10 ──[220Ω]──(LED2+)──(LED2-)─┤
Pin 11 ──[220Ω]──(LED3+)──(LED3-)─┼── GND
Pin 12 ──[220Ω]──(LED4+)──(LED4-)─┤
Pin 13 ──[220Ω]──(LED5+)──(LED5-)─┘
```

All LED short legs connect to the same ground rail!

---

## 💻 Sequential LED Chase

Let's make LEDs light up one by one, like a chaser pattern!

```cpp
// LED Chaser Pattern

int leds[] = {9, 10, 11, 12, 13};  // Array of LED pins
int numLeds = 5;  // Number of LEDs

void setup() {
  // Set all LED pins as OUTPUT using a for loop
  for (int i = 0; i < numLeds; i++) {
    pinMode(leds[i], OUTPUT);
  }

  Serial.begin(9600);
  Serial.println("LED Chaser Started!");
}

void loop() {
  // Turn on LEDs one by one from left to right
  for (int i = 0; i < numLeds; i++) {
    digitalWrite(leds[i], HIGH);
    Serial.print("LED ");
    Serial.print(i + 1);
    Serial.println(" ON");
    delay(200);  // Wait 200ms
  }

  // Turn off all LEDs
  for (int i = 0; i < numLeds; i++) {
    digitalWrite(leds[i], LOW);
  }
  delay(200);  // Pause before repeating
}
```

**How it works:**
- First `for` loop turns LEDs on sequentially
- Second `for` loop turns all LEDs off
- Pattern repeats forever!

---

## 🚦 Traffic Light System

Now let's build a real traffic light with proper timing!

**Wiring:**
- Pin 9: Red LED
- Pin 10: Yellow LED
- Pin 11: Green LED

```cpp
// Traffic Light Controller

int redLight = 9;
int yellowLight = 10;
int greenLight = 11;

void setup() {
  pinMode(redLight, OUTPUT);
  pinMode(yellowLight, OUTPUT);
  pinMode(greenLight, OUTPUT);

  Serial.begin(9600);
  Serial.println("🚦 Traffic Light System Active");
}

void loop() {
  // Red light - STOP
  digitalWrite(redLight, HIGH);
  digitalWrite(yellowLight, LOW);
  digitalWrite(greenLight, LOW);
  Serial.println("🔴 RED - STOP");
  delay(5000);  // Red for 5 seconds

  // Yellow light - GET READY
  digitalWrite(redLight, LOW);
  digitalWrite(yellowLight, HIGH);
  digitalWrite(greenLight, LOW);
  Serial.println("🟡 YELLOW - GET READY");
  delay(2000);  // Yellow for 2 seconds

  // Green light - GO
  digitalWrite(redLight, LOW);
  digitalWrite(yellowLight, LOW);
  digitalWrite(greenLight, HIGH);
  Serial.println("🟢 GREEN - GO");
  delay(5000);  // Green for 5 seconds

  // Yellow again before red
  digitalWrite(redLight, LOW);
  digitalWrite(yellowLight, HIGH);
  digitalWrite(greenLight, LOW);
  Serial.println("🟡 YELLOW - SLOW DOWN");
  delay(2000);  // Yellow for 2 seconds
}
```

**Real Traffic Light Timing:**
- Red: 5 seconds (STOP)
- Yellow: 2 seconds (CAUTION)
- Green: 5 seconds (GO)
- Yellow: 2 seconds (PREPARE TO STOP)

---

## 💓 Heartbeat Pattern

Create a realistic heartbeat effect with two quick pulses!

```cpp
// Heartbeat Pattern

int heartLED = 13;

void setup() {
  pinMode(heartLED, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  // First beat
  digitalWrite(heartLED, HIGH);
  delay(100);
  digitalWrite(heartLED, LOW);
  delay(100);

  // Second beat
  digitalWrite(heartLED, HIGH);
  delay(100);
  digitalWrite(heartLED, LOW);

  // Long pause
  delay(1000);

  Serial.println("💓 Lub-dub");
}
```

**Heartbeat timing:**
- Beat 1: 100ms ON, 100ms OFF
- Beat 2: 100ms ON
- Pause: 1000ms (1 second)
- Repeat

---

## 🎯 Bidirectional Chase

LEDs light up left to right, then right to left!

```cpp
// Bidirectional LED Chaser

int leds[] = {9, 10, 11, 12, 13};
int numLeds = 5;

void setup() {
  for (int i = 0; i < numLeds; i++) {
    pinMode(leds[i], OUTPUT);
  }
}

void loop() {
  // Forward direction (left to right)
  for (int i = 0; i < numLeds; i++) {
    digitalWrite(leds[i], HIGH);
    delay(150);
    digitalWrite(leds[i], LOW);
  }

  // Backward direction (right to left)
  for (int i = numLeds - 1; i >= 0; i--) {
    digitalWrite(leds[i], HIGH);
    delay(150);
    digitalWrite(leds[i], LOW);
  }
}
```

**Key trick:** The second loop counts backwards using `i--`!

---

## ⚡ Random Blinking

Make LEDs blink randomly for a dramatic effect!

```cpp
// Random LED Blinker

int leds[] = {9, 10, 11, 12, 13};
int numLeds = 5;

void setup() {
  for (int i = 0; i < numLeds; i++) {
    pinMode(leds[i], OUTPUT);
  }

  // Seed random number generator
  randomSeed(analogRead(0));
}

void loop() {
  // Pick a random LED
  int randomLED = random(0, numLeds);

  // Blink it
  digitalWrite(leds[randomLED], HIGH);
  delay(100);
  digitalWrite(leds[randomLED], LOW);
  delay(200);
}
```

**`random(0, numLeds)`** picks a random number from 0 to 4!

---

## 🎨 Advanced: Binary Counter

Display numbers in binary using 5 LEDs!

```cpp
// Binary Counter (0-31)

int leds[] = {9, 10, 11, 12, 13};
int numLeds = 5;

void setup() {
  for (int i = 0; i < numLeds; i++) {
    pinMode(leds[i], OUTPUT);
  }
  Serial.begin(9600);
}

void loop() {
  // Count from 0 to 31
  for (int number = 0; number < 32; number++) {
    displayBinary(number);
    Serial.print("Number: ");
    Serial.println(number);
    delay(500);
  }
}

void displayBinary(int number) {
  // Display number in binary on LEDs
  for (int i = 0; i < numLeds; i++) {
    // Check if bit i is set in number
    if (number & (1 << i)) {
      digitalWrite(leds[i], HIGH);
    } else {
      digitalWrite(leds[i], LOW);
    }
  }
}
```

**Example:** Number 13 = binary 01101
- LED 0: ON (bit 0 = 1)
- LED 1: OFF (bit 1 = 0)
- LED 2: ON (bit 2 = 1)
- LED 3: ON (bit 3 = 1)
- LED 4: OFF (bit 4 = 0)

---

## 🎯 Try These Challenges!

**Challenge 1: Police Lights**
Alternate two LEDs rapidly (red and blue) like emergency vehicles.

**Challenge 2: Theater Chase**
Light up every other LED, then shift the pattern.

**Challenge 3: Fade Effect**
Can you make LEDs turn on gradually? (Hint: We'll need PWM - coming in future lessons!)

**Challenge 4: Custom Pattern**
Create your own unique pattern - maybe spell out SOS in a sequence?

**Challenge 5: Traffic Intersection**
Control TWO traffic lights for a full intersection (8 LEDs total)!

---

## 🔧 Troubleshooting

**Problem: Only some LEDs work**
- ✓ Check each LED polarity (long leg to resistor)
- ✓ Verify resistors are connected to correct pins
- ✓ Test each LED individually
- ✓ Check for loose connections

**Problem: LEDs blink at wrong times**
- ✓ Review your delay() values
- ✓ Check array indices (remember: start at 0!)
- ✓ Use Serial.println() to debug

**Problem: Pattern doesn't repeat correctly**
- ✓ Make sure you turn all LEDs OFF when needed
- ✓ Check for infinite loops
- ✓ Verify loop conditions

**Problem: Code upload fails**
- ✓ Close Serial Monitor before uploading
- ✓ Check board and port settings
- ✓ Try a simpler sketch first

---

## ✅ What You've Learned

Congratulations! You've mastered:
- ✓ Using arrays to manage multiple pins
- ✓ For loops for efficient LED control
- ✓ Creating sequential patterns
- ✓ Building a traffic light system
- ✓ Timing complex sequences
- ✓ Random number generation
- ✓ Bidirectional loops

**Key Concepts:**
- **Arrays** - Store multiple values: `int leds[] = {9, 10, 11};`
- **For loops** - Repeat actions efficiently
- **Array indexing** - Access values with `leds[0]`, `leds[1]`, etc.
- **Sequential control** - One LED at a time
- **Timing patterns** - Different delays create different effects

---

## 🚀 What's Next?

You now have serious LED control skills! These patterns are used in:
- 🎮 Gaming keyboards with RGB lighting
- 🚗 Car turn signals and brake lights
- 🏢 Building decorative lighting
- 🎭 Stage and theater lighting effects
- 🤖 Robot status indicators

In future lessons, you'll learn:
- PWM for smooth LED fading
- RGB LEDs for millions of colors
- NeoPixel LED strips for advanced effects
- Combining LEDs with sensors for interaction

You're becoming an LED master! 🎉
