# More on Blinking LEDs

## 📦 What You'll Need
- Arduino Uno board
- 3 LEDs (red, yellow, green - for traffic light)
- 3× 220Ω resistors
- Breadboard
- 6 jumper wires
- USB cable

---

## 🌟 From One LED to Three!

You've mastered controlling one LED. Now let's level up by controlling multiple LEDs at once!

In this lesson, you'll learn two essential programming concepts:
- **Arrays** - Store multiple values in one variable
- **For loops** - Repeat actions efficiently

We'll apply these skills to build a real traffic light system! 🚦

---

## 🧠 Understanding Arrays

Instead of creating separate variables for each LED, we can use an **array** to store multiple pin numbers.

**Without arrays (messy):**
```cpp
int redLight = 9;
int yellowLight = 10;
int greenLight = 11;
```

**With arrays (clean):**
```cpp
int lights[] = {9, 10, 11};
```

**Accessing array values:**
- `lights[0]` = 9 (red LED)
- `lights[1]` = 10 (yellow LED)
- `lights[2]` = 11 (green LED)

**Important:** Arrays start counting at **0**, not 1!

---

## 🔌 Wiring the Traffic Light

Let's wire up 3 LEDs to create a traffic light.

**Connection for each LED:**
1. LED long leg → 220Ω resistor → Arduino pin
2. LED short leg → GND rail

**Pin assignments:**
- Pin 9: Red LED
- Pin 10: Yellow LED
- Pin 11: Green LED

**Wiring diagram:**
```
Pin 9  ──[220Ω]──(Red LED+)──(Red LED-)─┐
Pin 10 ──[220Ω]──(Yellow LED+)──(Yellow LED-)─┼── GND
Pin 11 ──[220Ω]──(Green LED+)──(Green LED-)─┘
```

All three short legs connect to the same GND rail!

---

## 💻 Traffic Light Code

Here's the complete code for a working traffic light:

```cpp
// Traffic Light System

int redLight = 9;
int yellowLight = 10;
int greenLight = 11;

void setup() {
  // Configure all LED pins as OUTPUT
  pinMode(redLight, OUTPUT);
  pinMode(yellowLight, OUTPUT);
  pinMode(greenLight, OUTPUT);

  Serial.begin(9600);
  Serial.println("🚦 Traffic Light Active");
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

---

## 🔍 How It Works

**The Pattern:**
1. **Red** (5 seconds) - Stop
2. **Yellow** (2 seconds) - Prepare to go
3. **Green** (5 seconds) - Go
4. **Yellow** (2 seconds) - Prepare to stop
5. Repeat!

**Key technique:**
- Turn ONE LED on: `digitalWrite(LED, HIGH)`
- Turn ALL others off: `digitalWrite(LED, LOW)`
- Wait with `delay()`

Notice how we explicitly set all three LEDs each time? This ensures only one is on at a time.

---

## 🚀 Using For Loops (Bonus)

Want cleaner code? Use a for loop to set up all pins at once:

```cpp
// Using arrays and for loops

int lights[] = {9, 10, 11};  // Array of LED pins
int numLights = 3;

void setup() {
  // Set all pins as OUTPUT using a for loop
  for (int i = 0; i < numLights; i++) {
    pinMode(lights[i], OUTPUT);
  }

  Serial.begin(9600);
  Serial.println("🚦 Traffic Light Active");
}

// Turn off all LEDs function
void allOff() {
  for (int i = 0; i < numLights; i++) {
    digitalWrite(lights[i], LOW);
  }
}

void loop() {
  // Red
  allOff();
  digitalWrite(lights[0], HIGH);  // lights[0] = pin 9
  Serial.println("🔴 RED");
  delay(5000);

  // Yellow
  allOff();
  digitalWrite(lights[1], HIGH);  // lights[1] = pin 10
  Serial.println("🟡 YELLOW");
  delay(2000);

  // Green
  allOff();
  digitalWrite(lights[2], HIGH);  // lights[2] = pin 11
  Serial.println("🟢 GREEN");
  delay(5000);

  // Yellow
  allOff();
  digitalWrite(lights[1], HIGH);
  Serial.println("🟡 YELLOW");
  delay(2000);
}
```

**What improved:**
- `for` loop sets up all pins in one line
- `allOff()` function turns off all LEDs cleanly
- Code is easier to modify (add more LEDs? Just update the array!)

---

## 🎯 Try This Challenge!

Modify the traffic light to add a "pedestrian crossing" feature:
1. All lights off
2. Red starts blinking (pedestrians can cross)
3. Resume normal sequence

Hint: Use a for loop to make the red LED blink 5 times!

---

## ✅ What You've Learned

Great work! You now understand:
- ✓ How arrays store multiple values: `int lights[] = {9, 10, 11}`
- ✓ Array indexing starts at 0
- ✓ For loops for efficient repetition
- ✓ Controlling multiple LEDs in sequence
- ✓ Creating realistic timing patterns

**Key Concepts:**
- **Arrays** - Group multiple values together
- **For loops** - Repeat code efficiently
- **Sequential control** - One LED at a time
- **Timing** - Different delays create different effects

---

## 🚀 What's Next?

These core concepts (arrays and for loops) are used everywhere in Arduino:
- 🎮 Controlling multiple motors in robots
- 🎹 Reading button arrays (keypads)
- 📊 Managing sensor data
- 💡 RGB LED color control

You've learned the foundation for controlling multiple outputs efficiently!

In future lessons, you'll combine these skills with sensors to create interactive projects.

Keep building! 🎉
