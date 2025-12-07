import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, Lightbulb, Code, Cpu, Zap } from 'lucide-react';
import { explainCode } from '../services/geminiService';

interface Message {
  id: string;
  role: 'user' | 'novie';
  content: string;
  timestamp: Date;
}

const QUICK_QUESTIONS = [
  "How do I blink an LED?",
  "What's the difference between digitalWrite and analogWrite?",
  "How do I use a button with Arduino?",
  "Explain pull-up resistors",
  "Help me with servo motors",
  "What pins support PWM?"
];

export const Novie: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'novie',
      content: "Hi! I'm Novie, your Arduino learning assistant! 👋\n\nI'm here to help you with:\n• Arduino code explanations\n• Circuit wiring advice\n• Component troubleshooting\n• Project ideas\n\nWhat would you like to learn today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (customMessage?: string) => {
    const messageText = customMessage || input.trim();
    if (!messageText || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response (replace with actual Gemini/Claude API call)
    setTimeout(async () => {
      let aiResponse = '';

      // Check if it's a code-related question
      if (messageText.toLowerCase().includes('code') || messageText.toLowerCase().includes('sketch')) {
        aiResponse = await explainCode(messageText);
      } else {
        // Generic Arduino help (you can expand this with actual AI)
        aiResponse = getArduinoHelp(messageText);
      }

      const novieMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'novie',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, novieMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const getArduinoHelp = (question: string): string => {
    const q = question.toLowerCase();

    if (q.includes('blink') || q.includes('led')) {
      return "To blink an LED with Arduino:\n\n1. **Wire the LED**: Connect the long leg (anode) to pin 13 through a 220Ω resistor, and short leg (cathode) to GND.\n\n2. **Write the code**:\n```cpp\nvoid setup() {\n  pinMode(13, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(13, HIGH);\n  delay(1000);\n  digitalWrite(13, LOW);\n  delay(1000);\n}\n```\n\nThis turns the LED on for 1 second, then off for 1 second, repeatedly!";
    }

    if (q.includes('digitalwrite') || q.includes('analogwrite')) {
      return "**digitalWrite vs analogWrite:**\n\n• **digitalWrite(pin, HIGH/LOW)**: \n  - Sets a pin completely ON (5V) or OFF (0V)\n  - Use for: LEDs on/off, relays, simple digital signals\n\n• **analogWrite(pin, 0-255)**:\n  - Uses PWM to simulate analog output\n  - Value 0 = 0V, 255 = 5V, 127 = ~2.5V\n  - Use for: LED dimming, motor speed control\n  - Only works on PWM pins (marked with ~)\n\nExample: `analogWrite(9, 128);` sets pin 9 to half brightness!";
    }

    if (q.includes('button')) {
      return "**Using a Button with Arduino:**\n\n1. Wire the button between pin 2 and GND\n2. Enable internal pull-up resistor in code:\n\n```cpp\nvoid setup() {\n  pinMode(2, INPUT_PULLUP); // Pull-up resistor\n  pinMode(13, OUTPUT);\n}\n\nvoid loop() {\n  if (digitalRead(2) == LOW) {  // Button pressed\n    digitalWrite(13, HIGH);      // Turn LED on\n  } else {\n    digitalWrite(13, LOW);       // Turn LED off\n  }\n}\n```\n\nWith INPUT_PULLUP, the button reads HIGH when not pressed, LOW when pressed!";
    }

    if (q.includes('pull-up') || q.includes('pullup')) {
      return "**Pull-up Resistors Explained:**\n\nImagine a button floating between 0V and 5V - it's unstable! A pull-up resistor \"pulls\" the pin HIGH (5V) by default.\n\n**Why use them?**\n• Prevents floating inputs (unreliable readings)\n• Arduino has built-in pull-ups (20kΩ)\n• When button is pressed → connects to GND → reads LOW\n• When released → pulled HIGH by resistor → reads HIGH\n\n**Enable it:** `pinMode(pin, INPUT_PULLUP);`\n\nNo external resistor needed!";
    }

    if (q.includes('servo')) {
      return "**Servo Motor Control:**\n\n1. **Wiring:**\n   - Orange/Yellow wire → Arduino pin 9\n   - Red wire → 5V\n   - Brown/Black wire → GND\n\n2. **Code:**\n```cpp\n#include <Servo.h>\nServo myservo;\n\nvoid setup() {\n  myservo.attach(9);\n}\n\nvoid loop() {\n  myservo.write(0);    // 0 degrees\n  delay(1000);\n  myservo.write(90);   // 90 degrees\n  delay(1000);\n  myservo.write(180);  // 180 degrees\n  delay(1000);\n}\n```\n\nServo moves to specified angle (0-180°)!";
    }

    if (q.includes('pwm')) {
      return "**PWM Pins on Arduino Uno:**\n\n✅ PWM-capable pins: **3, 5, 6, 9, 10, 11**\n(Look for the ~ symbol on the board)\n\n❌ Non-PWM pins: 0, 1, 2, 4, 7, 8, 12, 13, A0-A5\n\n**Why it matters:**\nOnly PWM pins can use `analogWrite()` for:\n• LED dimming\n• Motor speed control\n• Generating analog-like signals\n\nExample: Pin 9 supports PWM ✅\nPin 7 does NOT ❌";
    }

    // Default response
    return "That's a great Arduino question! Here are some helpful tips:\n\n• Check your wiring connections\n• Verify you're using the correct pin numbers\n• Make sure your power supply is adequate\n• Use Serial.println() to debug\n\nCan you provide more details about what you're trying to build? I'm here to help!";
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-white">

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white p-6 shadow-xl">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Bot size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold flex items-center gap-3">
                Novie AI
                <Sparkles size={24} className="fill-white animate-pulse" />
              </h1>
              <p className="text-purple-100">Your personal Arduino learning companion</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'novie' && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                  <Bot size={24} className="text-white" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-3xl p-5 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-purple-600 to-pink-500 text-white'
                    : 'bg-white border-2 border-purple-100 text-neutral-800'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-purple-100' : 'text-neutral-400'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {message.role === 'user' && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-600 to-neutral-700 flex items-center justify-center shrink-0 text-white font-bold">
                  A
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Bot size={24} className="text-white" />
              </div>
              <div className="bg-white border-2 border-purple-100 rounded-3xl p-5">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Questions */}
      <div className="px-6 pb-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-neutral-600 mb-3 font-medium">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="px-4 py-2 bg-white border-2 border-purple-200 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-50 hover:border-purple-300 transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t-2 border-purple-100 p-6 shadow-lg">
        <div className="max-w-4xl mx-auto flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Novie anything about Arduino..."
            className="flex-1 px-6 py-4 bg-neutral-50 border-2 border-neutral-200 rounded-3xl focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all text-neutral-800 placeholder-neutral-400"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-3xl font-bold hover:from-purple-700 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-200 flex items-center gap-2"
          >
            <Send size={20} />
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
