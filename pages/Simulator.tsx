import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ComponentType, SimComponent, Wire, Pin, CircuitState } from '../types';
import { COMPONENT_SPECS } from '../constants';
import { Trash2, Play, RefreshCw, ZapOff, Save, Download, Upload, X, RotateCw, Terminal, Code, Cpu, ChevronDown, ChevronUp, Copy, ZoomIn, ZoomOut, Maximize2, Undo, Redo, Search, Info } from 'lucide-react';

export const Simulator: React.FC = () => {
  const [components, setComponents] = useState<SimComponent[]>([]);
  const [wires, setWires] = useState<Wire[]>([]);
  const [draggedComp, setDraggedComp] = useState<string | null>(null);
  const [selectedComp, setSelectedComp] = useState<string | null>(null);
  const [hoveredWire, setHoveredWire] = useState<string | null>(null);
  const [isDrawingWire, setIsDrawingWire] = useState<{ compId: string, pinId: string } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [simState, setSimState] = useState<'idle' | 'running' | 'error'>('idle');
  const [validationMsg, setValidationMsg] = useState('');

  // Phase 3: Simulation Engine state
  const [showSerialMonitor, setShowSerialMonitor] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [showPinStates, setShowPinStates] = useState(true);
  const [serialOutput, setSerialOutput] = useState<string[]>([]);
  const [arduinoCode, setArduinoCode] = useState(`void setup() {
  Serial.begin(9600);
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, HIGH);
  Serial.println("LED ON");
  delay(1000);
  digitalWrite(13, LOW);
  Serial.println("LED OFF");
  delay(1000);
}`);
  const [pinStates, setPinStates] = useState<Record<string, { mode: 'INPUT' | 'OUTPUT' | 'PWM', value: number }>>({
    '13': { mode: 'OUTPUT', value: 0 },
    'A0': { mode: 'INPUT', value: 512 },
  });

  // Phase 4: UX Enhancements state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState<{ components: SimComponent[], wires: Wire[] }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showShortcuts, setShowShortcuts] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Auto-save to localStorage
  useEffect(() => {
    const interval = setInterval(() => {
      if (components.length > 0 || wires.length > 0) {
        saveToLocalStorage();
      }
    }, 30000); // Auto-save every 30 seconds
    return () => clearInterval(interval);
  }, [components, wires]);

  // Load from localStorage on mount
  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete selected component
      if (e.key === 'Delete' && selectedComp) {
        deleteComponent(selectedComp);
      }
      // Escape to cancel wire drawing
      if (e.key === 'Escape' && isDrawingWire) {
        setIsDrawingWire(null);
      }
      // Ctrl+S to save
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        exportCircuit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedComp, isDrawingWire]);

  const getSVGCoords = (e: React.MouseEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const CTM = svgRef.current.getScreenCTM();
    if (!CTM) return { x: 0, y: 0 };
    return {
      x: (e.clientX - CTM.e) / CTM.a - pan.x,
      y: (e.clientY - CTM.f) / CTM.d - pan.y
    };
  };

  // Phase 4: Zoom & Pan functions
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3)); // Max 3x zoom
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5)); // Min 0.5x zoom
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
    }
  };

  const handlePanStart = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) { // Middle mouse or Ctrl + Left mouse
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handlePanMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  };

  const handlePanEnd = () => {
    setIsPanning(false);
  };

  // Phase 4: Undo/Redo functions
  const saveToHistory = () => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ components: JSON.parse(JSON.stringify(components)), wires: JSON.parse(JSON.stringify(wires)) });
    setHistory(newHistory.slice(-20)); // Keep last 20 states
    setHistoryIndex(Math.min(newHistory.length - 1, 19));
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setComponents(prevState.components);
      setWires(prevState.wires);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setComponents(nextState.components);
      setWires(nextState.wires);
      setHistoryIndex(historyIndex + 1);
    }
  };

  // Save to history when components or wires change
  useEffect(() => {
    if (components.length > 0 || wires.length > 0) {
      const timeoutId = setTimeout(() => {
        saveToHistory();
      }, 500); // Debounce to avoid too many history states
      return () => clearTimeout(timeoutId);
    }
  }, [components, wires]);

  // Add keyboard shortcuts for undo/redo and zoom
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if (e.ctrlKey && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
      if (e.ctrlKey && e.key === '0') {
        e.preventDefault();
        handleResetView();
      }
      if (e.ctrlKey && e.key === '=') {
        e.preventDefault();
        handleZoomIn();
      }
      if (e.ctrlKey && e.key === '-') {
        e.preventDefault();
        handleZoomOut();
      }
      if (e.key === '?') {
        setShowShortcuts(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history, zoom]);

  const addComponent = (type: ComponentType) => {
    const id = `${type}_${Date.now()}`;
    const offset = components.length * 20;

    // Initialize component state based on type
    let initialState = undefined;
    if (type === ComponentType.BUTTON) {
      initialState = { isPressed: false };
    } else if (type === ComponentType.POTENTIOMETER) {
      initialState = { angle: 135, resistance: 5000 }; // Middle position
    } else if (type === ComponentType.RGB_LED) {
      initialState = { red: 0, green: 0, blue: 0 };
    } else if (type === ComponentType.BUZZER) {
      initialState = { isActive: false, frequency: 0 };
    } else if (type === ComponentType.LCD_16X2) {
      initialState = { displayText: ['Hello World!', 'LCD 16x2'] };
    }

    setComponents(prev => [...prev, {
      id,
      type,
      x: 100 + offset,
      y: 100 + offset,
      state: initialState
    }]);
  };

  const deleteComponent = (compId: string) => {
    setComponents(prev => prev.filter(c => c.id !== compId));
    // Remove all wires connected to this component
    setWires(prev => prev.filter(w => w.fromCompId !== compId && w.toCompId !== compId));
    setSelectedComp(null);
  };

  const deleteWire = (wireId: string) => {
    setWires(prev => prev.filter(w => w.id !== wireId));
    setHoveredWire(null);
  };

  const rotateComponent = (compId: string) => {
    setComponents(prev => prev.map(c => {
      if (c.id === compId) {
        const currentRotation = c.rotation || 0;
        const newRotation = ((currentRotation + 90) % 360) as 0 | 90 | 180 | 270;
        return { ...c, rotation: newRotation };
      }
      return c;
    }));
  };

  const handleMouseDownComp = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDraggedComp(id);
    setSelectedComp(id);
  };

  const handleMouseDownPin = (e: React.MouseEvent, compId: string, pinId: string) => {
    e.stopPropagation();
    if (isDrawingWire) {
      // Completing a wire
      if (isDrawingWire.compId === compId && isDrawingWire.pinId === pinId) {
        // Clicked same pin, cancel
        setIsDrawingWire(null);
        return;
      }

      // Validate connection
      const fromComp = components.find(c => c.id === isDrawingWire.compId);
      const toComp = components.find(c => c.id === compId);
      const fromPin = fromComp && COMPONENT_SPECS[fromComp.type].pins.find(p => p.id === isDrawingWire.pinId);
      const toPin = toComp && COMPONENT_SPECS[toComp.type].pins.find(p => p.id === pinId);

      if (fromPin && toPin) {
        // Check for invalid connections
        if (fromPin.type === 'power' && toPin.type === 'power') {
          setValidationMsg('⚠️ Cannot connect power to power!');
          setSimState('error');
          setIsDrawingWire(null);
          return;
        }
        if (fromPin.type === 'ground' && toPin.type === 'ground') {
          setValidationMsg('⚠️ Connecting ground to ground is redundant');
          setSimState('error');
          setIsDrawingWire(null);
          return;
        }
      }

      const newWire: Wire = {
        id: `wire_${Date.now()}`,
        fromCompId: isDrawingWire.compId,
        fromPinId: isDrawingWire.pinId,
        toCompId: compId,
        toPinId: pinId
      };
      setWires(prev => [...prev, newWire]);
      setIsDrawingWire(null);
      setValidationMsg('');
      setSimState('idle');
    } else {
      // Starting a new wire
      setIsDrawingWire({ compId, pinId });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const coords = getSVGCoords(e);
    setMousePos(coords);

    if (draggedComp) {
      setComponents(prev => prev.map(c =>
        c.id === draggedComp ? {
          ...c,
          x: Math.max(0, coords.x - (COMPONENT_SPECS[c.type].width / 2)),
          y: Math.max(0, coords.y - (COMPONENT_SPECS[c.type].height / 2))
        } : c
      ));
    }
  };

  const handleMouseUp = () => {
    setDraggedComp(null);
  };

  const getPinCoords = (compId: string, pinId: string) => {
    const comp = components.find(c => c.id === compId);
    if (!comp) return { x: 0, y: 0 };
    const spec = COMPONENT_SPECS[comp.type];
    const pin = spec.pins.find(p => p.id === pinId);
    if (!pin) return { x: 0, y: 0 };
    return { x: comp.x + pin.x, y: comp.y + pin.y };
  };

  const clearBoard = () => {
    if (components.length > 0 || wires.length > 0) {
      if (confirm('Clear all components and wires?')) {
        setComponents([]);
        setWires([]);
        setSimState('idle');
        setValidationMsg('');
        setSelectedComp(null);
        localStorage.removeItem('noveng_circuit');
      }
    }
  };

  const saveToLocalStorage = () => {
    const circuit: CircuitState = {
      components,
      wires,
      version: '1.0',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('noveng_circuit', JSON.stringify(circuit));
  };

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('noveng_circuit');
    if (saved) {
      try {
        const circuit: CircuitState = JSON.parse(saved);
        setComponents(circuit.components);
        setWires(circuit.wires);
      } catch (error) {
        console.error('Failed to load circuit:', error);
      }
    }
  };

  const exportCircuit = () => {
    const circuit: CircuitState = {
      components,
      wires,
      version: '1.0',
      createdAt: new Date().toISOString(),
      name: 'My Circuit'
    };
    const blob = new Blob([JSON.stringify(circuit, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `circuit_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importCircuit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const circuit: CircuitState = JSON.parse(event.target?.result as string);
          setComponents(circuit.components);
          setWires(circuit.wires);
          setValidationMsg('✅ Circuit loaded successfully!');
          setSimState('idle');
        } catch (error) {
          setValidationMsg('⚠️ Failed to load circuit file');
          setSimState('error');
        }
      };
      reader.readAsText(file);
    }
  };

  const runSimulation = () => {
    // Check if there's an Arduino
    const arduino = components.find(c => c.type === ComponentType.ARDUINO_UNO);
    if (!arduino) {
      setSimState('error');
      setValidationMsg("⚠️ Add an Arduino Uno to start building circuits!");
      return;
    }

    // Check for LED circuit with resistor
    const leds = components.filter(c => c.type === ComponentType.LED);
    if (leds.length > 0) {
      const led = leds[0];
      const connectedWires = wires.filter(w => w.fromCompId === led.id || w.toCompId === led.id);

      // Check if LED is in a circuit with a resistor
      const resistors = components.filter(c => c.type === ComponentType.RESISTOR);
      const hasResistor = resistors.some(resistor => {
        return wires.some(w =>
          (w.fromCompId === resistor.id || w.toCompId === resistor.id)
        );
      });

      let powered = false;
      let grounded = false;

      connectedWires.forEach(w => {
        const pinOnLed = w.fromCompId === led.id ? w.fromPinId : w.toPinId;
        const otherCompId = w.fromCompId === led.id ? w.toCompId : w.fromCompId;
        const otherPinId = w.fromCompId === led.id ? w.toPinId : w.fromPinId;
        const otherComp = components.find(c => c.id === otherCompId);
        const otherPin = otherComp && COMPONENT_SPECS[otherComp.type].pins.find(p => p.id === otherPinId);

        if (pinOnLed === 'anode') {
          if (otherPin && (otherPin.type === 'power' || otherPin.type === 'digital')) powered = true;
        }
        if (pinOnLed === 'cathode') {
          if (otherPin && otherPin.type === 'ground') grounded = true;
        }
      });

      if (!hasResistor && powered && grounded) {
        setSimState('error');
        setValidationMsg("⚠️ Add a resistor to protect your LED! LEDs need current-limiting resistors.");
        return;
      }

      if (powered && grounded && hasResistor) {
        setSimState('running');
        setValidationMsg("✅ Perfect! Your LED circuit is complete with resistor protection!");

        // Add serial output
        setSerialOutput(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] Sketch uploaded successfully`,
          `[${new Date().toLocaleTimeString()}] Serial Monitor initialized at 9600 baud`,
          `[${new Date().toLocaleTimeString()}] LED connected to pin 13`,
          `[${new Date().toLocaleTimeString()}] LED ON`,
        ]);

        // Update pin states
        setPinStates(prev => ({
          ...prev,
          '13': { mode: 'OUTPUT', value: 1 }
        }));

        return;
      } else if (powered && grounded) {
        setSimState('running');
        setValidationMsg("✅ LED circuit working (but add a resistor for safety!)");

        // Add serial output
        setSerialOutput(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] Sketch uploaded successfully`,
          `[${new Date().toLocaleTimeString()}] LED ON`,
        ]);

        // Update pin states
        setPinStates(prev => ({
          ...prev,
          '13': { mode: 'OUTPUT', value: 1 }
        }));

        return;
      } else {
        setSimState('error');
        setValidationMsg("⚠️ LED circuit incomplete. Connect LED (+) to power pin and (-) to GND.");
        return;
      }
    }

    // Check for button circuit
    const buttons = components.filter(c => c.type === ComponentType.BUTTON);
    if (buttons.length > 0) {
      const button = buttons[0];
      const buttonWires = wires.filter(w => w.fromCompId === button.id || w.toCompId === button.id);

      if (buttonWires.length >= 2) {
        setSimState('running');
        setValidationMsg("✅ Button circuit ready! Click button to toggle input.");

        // Add serial output
        setSerialOutput(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] Button connected to pin 2`,
          `[${new Date().toLocaleTimeString()}] Button state: ${button.state?.isPressed ? 'PRESSED' : 'RELEASED'}`,
        ]);

        // Update pin states
        setPinStates(prev => ({
          ...prev,
          '2': { mode: 'INPUT', value: button.state?.isPressed ? 1 : 0 }
        }));

        return;
      } else {
        setSimState('error');
        setValidationMsg("⚠️ Connect button pins to Arduino digital pins and GND.");
        return;
      }
    }

    // Check for servo circuit
    const servos = components.filter(c => c.type === ComponentType.SERVO);
    if (servos.length > 0) {
      const servo = servos[0];
      const servoWires = wires.filter(w => w.fromCompId === servo.id || w.toCompId === servo.id);

      let hasPower = false;
      let hasGround = false;
      let hasSignal = false;

      servoWires.forEach(w => {
        const pinOnServo = w.fromCompId === servo.id ? w.fromPinId : w.toPinId;
        const otherCompId = w.fromCompId === servo.id ? w.toCompId : w.fromCompId;
        const otherPinId = w.fromCompId === servo.id ? w.toPinId : w.fromPinId;
        const otherComp = components.find(c => c.id === otherCompId);
        const otherPin = otherComp && COMPONENT_SPECS[otherComp.type].pins.find(p => p.id === otherPinId);

        if (pinOnServo === 'power' && otherPin?.type === 'power') hasPower = true;
        if (pinOnServo === 'ground' && otherPin?.type === 'ground') hasGround = true;
        if (pinOnServo === 'signal' && otherPin?.type === 'digital') hasSignal = true;
      });

      if (hasPower && hasGround && hasSignal) {
        setSimState('running');
        setValidationMsg("✅ Servo connected! Ready to control angle (0-180°).");
        return;
      } else {
        setSimState('error');
        setValidationMsg("⚠️ Servo needs 3 connections: Signal (PWM), VCC (5V), GND.");
        return;
      }
    }

    // Check for ultrasonic sensor
    const ultrasonics = components.filter(c => c.type === ComponentType.ULTRASONIC);
    if (ultrasonics.length > 0) {
      const sensor = ultrasonics[0];
      const sensorWires = wires.filter(w => w.fromCompId === sensor.id || w.toCompId === sensor.id);

      if (sensorWires.length >= 4) {
        setSimState('running');
        setValidationMsg("✅ HC-SR04 connected! Measuring distance...");
        return;
      } else {
        setSimState('error');
        setValidationMsg("⚠️ HC-SR04 needs 4 connections: VCC, TRIG, ECHO, GND.");
        return;
      }
    }

    // Check for buzzer circuit
    const buzzers = components.filter(c => c.type === ComponentType.BUZZER);
    if (buzzers.length > 0) {
      const buzzer = buzzers[0];
      const buzzerWires = wires.filter(w => w.fromCompId === buzzer.id || w.toCompId === buzzer.id);

      if (buzzerWires.length >= 2) {
        // Set buzzer to active
        setComponents(prev => prev.map(c =>
          c.id === buzzer.id ? { ...c, state: { ...c.state, isActive: true } } : c
        ));
        setSimState('running');
        setValidationMsg("✅ Buzzer connected! Making sound...");
        return;
      } else {
        setSimState('error');
        setValidationMsg("⚠️ Connect buzzer (+) to digital pin and (-) to GND.");
        return;
      }
    }

    // Check for RGB LED circuit
    const rgbLeds = components.filter(c => c.type === ComponentType.RGB_LED);
    if (rgbLeds.length > 0) {
      const rgbLed = rgbLeds[0];
      const rgbWires = wires.filter(w => w.fromCompId === rgbLed.id || w.toCompId === rgbLed.id);

      if (rgbWires.length >= 3) {
        // Set random RGB values for demo
        setComponents(prev => prev.map(c =>
          c.id === rgbLed.id ? { ...c, state: { red: 255, green: 100, blue: 200 } } : c
        ));
        setSimState('running');
        setValidationMsg("✅ RGB LED circuit complete! Colors mixing...");
        return;
      } else {
        setSimState('error');
        setValidationMsg("⚠️ RGB LED needs R, G, B pins connected to PWM pins and cathode to GND.");
        return;
      }
    }

    // Check for LCD Display circuit
    const lcds = components.filter(c => c.type === ComponentType.LCD_16X2);
    if (lcds.length > 0) {
      const lcd = lcds[0];
      const lcdWires = wires.filter(w => w.fromCompId === lcd.id || w.toCompId === lcd.id);

      if (lcdWires.length >= 6) {
        setSimState('running');
        setValidationMsg("✅ LCD connected! Displaying text...");
        return;
      } else {
        setSimState('error');
        setValidationMsg("⚠️ LCD needs at least 6 connections: VSS, VDD, RS, E, D4-D7.");
        return;
      }
    }

    // Check for Potentiometer circuit
    const pots = components.filter(c => c.type === ComponentType.POTENTIOMETER);
    if (pots.length > 0) {
      const pot = pots[0];
      const potWires = wires.filter(w => w.fromCompId === pot.id || w.toCompId === pot.id);

      if (potWires.length >= 3) {
        setSimState('running');
        setValidationMsg("✅ Potentiometer connected! Reading analog value...");

        // Calculate analog value from resistance
        const analogValue = Math.round((pot.state?.resistance || 5000) / 10000 * 1023);

        // Add serial output
        setSerialOutput(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] Potentiometer connected to A0`,
          `[${new Date().toLocaleTimeString()}] Analog reading: ${analogValue} (${pot.state?.angle || 135}°)`,
          `[${new Date().toLocaleTimeString()}] Resistance: ${pot.state?.resistance || 5000}Ω`,
        ]);

        // Update pin states
        setPinStates(prev => ({
          ...prev,
          'A0': { mode: 'INPUT', value: analogValue }
        }));

        return;
      } else {
        setSimState('error');
        setValidationMsg("⚠️ Potentiometer needs 3 connections: VCC, OUT (to analog pin), GND.");
        return;
      }
    }

    setSimState('error');
    setValidationMsg("⚠️ Add components to your breadboard to start testing!");
  };

  const toggleButton = (compId: string) => {
    setComponents(prev => prev.map(c => {
      if (c.id === compId && c.type === ComponentType.BUTTON) {
        return {
          ...c,
          state: { ...c.state, isPressed: !c.state?.isPressed }
        };
      }
      return c;
    }));
  };

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-gradient-to-br from-purple-950 via-neutral-900 to-black relative">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Component Palette - Futuristic Dark Theme */}
      <div className="relative w-full md:w-72 bg-gradient-to-b from-neutral-900/95 via-purple-950/95 to-neutral-900/95 backdrop-blur-xl border-r border-purple-500/20 p-4 md:p-6 flex flex-col gap-4 md:gap-6 shadow-2xl z-10 pt-16 md:pt-6">
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
            Components
          </h2>
          <p className="text-sm text-purple-300">Click to add to canvas</p>
        </div>

        {/* Component Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search components..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 focus:border-purple-400/50 rounded-xl text-white placeholder-purple-300/50 text-sm focus:outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-1 gap-3 overflow-y-auto max-h-96">
          {Object.keys(COMPONENT_SPECS)
            .filter((key) => {
              const type = key as ComponentType;
              const label = COMPONENT_SPECS[type].label.toLowerCase();
              return label.includes(searchQuery.toLowerCase());
            })
            .map((key) => {
              const type = key as ComponentType;
              return (
                <button
                  key={type}
                  onClick={() => addComponent(type)}
                  className="group relative p-4 border border-white/10 rounded-2xl hover:border-purple-400/50 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all text-left flex flex-col items-center gap-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 rounded-2xl transition-all" />
                  <div className="relative font-semibold text-sm text-white text-center">
                    {COMPONENT_SPECS[type].label}
                  </div>
                </button>
              );
            })}
          {Object.keys(COMPONENT_SPECS).filter((key) => {
            const type = key as ComponentType;
            const label = COMPONENT_SPECS[type].label.toLowerCase();
            return label.includes(searchQuery.toLowerCase());
          }).length === 0 && (
            <div className="col-span-2 md:col-span-1 text-center text-purple-300/50 py-8">
              No components found
            </div>
          )}
        </div>

        <div className="mt-auto space-y-3 border-t border-purple-500/20 pt-6">
          <button
            onClick={runSimulation}
            className="relative group w-full"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all">
              <Play size={18} fill="white" /> Test Circuit
            </div>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={exportCircuit}
              className="bg-white/5 border border-white/10 hover:border-purple-400/50 backdrop-blur-sm text-purple-200 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all text-sm"
              title="Save circuit"
            >
              <Download size={16} /> Save
            </button>
            <label className="bg-white/5 border border-white/10 hover:border-purple-400/50 backdrop-blur-sm text-purple-200 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all cursor-pointer text-sm">
              <Upload size={16} /> Load
              <input type="file" accept=".json" onChange={importCircuit} className="hidden" />
            </label>
          </div>

          <button
            onClick={clearBoard}
            className="w-full bg-red-500/20 border border-red-400/30 hover:border-red-400/50 backdrop-blur-sm text-red-300 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
          >
            <Trash2 size={16} /> Clear Board
          </button>
        </div>

        {validationMsg && (
          <div className={`p-4 rounded-2xl text-sm font-medium backdrop-blur-sm ${
            simState === 'running'
              ? 'bg-green-500/20 border border-green-400/30 text-green-300'
              : 'bg-orange-500/20 border border-orange-400/30 text-orange-300'
          }`}>
            {validationMsg}
          </div>
        )}
      </div>

      {/* Canvas - Dark futuristic breadboard */}
      <div
        ref={canvasRef}
        className="flex-1 relative overflow-hidden bg-gradient-to-br from-neutral-900 via-purple-950/30 to-neutral-900"
        onMouseMove={(e) => {
          handleMouseMove(e);
          handlePanMove(e);
        }}
        onMouseUp={(e) => {
          handleMouseUp(e);
          handlePanEnd();
        }}
        onMouseDown={handlePanStart}
        onWheel={handleWheel}
        onClick={() => setSelectedComp(null)}
      >
        {/* Circuit grid pattern */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #a855f7 1px, transparent 0)',
            backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
            transform: `translate(${pan.x}px, ${pan.y}px)`
          }}
        />

        <svg
          ref={svgRef}
          className="w-full h-full"
          style={{
            cursor: isPanning ? 'grabbing' : (isDrawingWire ? 'crosshair' : 'default'),
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0'
          }}
        >
          {/* Power rails (futuristic glow) */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <rect x="20" y="20" width="8" height="95%" fill="#ef4444" opacity="0.6" rx="4" filter="url(#glow)" />
          <rect x="36" y="20" width="8" height="95%" fill="#3b82f6" opacity="0.6" rx="4" filter="url(#glow)" />

          {/* Draw wires */}
          {wires.map((wire, idx) => {
            const start = getPinCoords(wire.fromCompId, wire.fromPinId);
            const end = getPinCoords(wire.toCompId, wire.toPinId);
            const colors = ['#ef4444', '#22c55e', '#3b82f6', '#eab308', '#f97316', '#a855f7'];
            const wireColor = colors[idx % colors.length];
            const isHovered = hoveredWire === wire.id;

            return (
              <g key={wire.id}>
                {/* Invisible wider line for easier hovering */}
                <line
                  x1={start.x} y1={start.y}
                  x2={end.x} y2={end.y}
                  stroke="transparent"
                  strokeWidth="20"
                  strokeLinecap="round"
                  onMouseEnter={() => setHoveredWire(wire.id)}
                  onMouseLeave={() => setHoveredWire(null)}
                  className="cursor-pointer"
                  style={{ pointerEvents: 'stroke' }}
                />
                {/* Wire glow */}
                <line
                  x1={start.x} y1={start.y}
                  x2={end.x} y2={end.y}
                  stroke={simState === 'running' ? '#22c55e' : wireColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  opacity="0.3"
                  filter="url(#glow)"
                  className="pointer-events-none"
                />
                {/* Actual wire */}
                <line
                  x1={start.x} y1={start.y}
                  x2={end.x} y2={end.y}
                  stroke={simState === 'running' ? '#22c55e' : wireColor}
                  strokeWidth={isHovered ? "6" : "4"}
                  strokeLinecap="round"
                  className={`pointer-events-none ${simState === 'running' ? 'animate-pulse' : ''}`}
                />
                {/* Delete button on hover */}
                {isHovered && (
                  <g
                    transform={`translate(${(start.x + end.x) / 2}, ${(start.y + end.y) / 2})`}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      deleteWire(wire.id);
                    }}
                    className="cursor-pointer"
                  >
                    {/* Larger invisible clickable area */}
                    <circle r="18" fill="transparent" className="cursor-pointer" />
                    {/* Visible delete button */}
                    <circle r="14" fill="#ef4444" opacity="0.95" />
                    <circle r="14" fill="#ef4444" opacity="0.3" filter="url(#glow)" />
                    <text y="5" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" className="pointer-events-none select-none">×</text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Active wire being drawn */}
          {isDrawingWire && (
            <line
              x1={getPinCoords(isDrawingWire.compId, isDrawingWire.pinId).x}
              y1={getPinCoords(isDrawingWire.compId, isDrawingWire.pinId).y}
              x2={mousePos.x}
              y2={mousePos.y}
              stroke="#a855f7"
              strokeWidth="5"
              strokeDasharray="8,4"
              strokeLinecap="round"
              opacity="0.8"
              filter="url(#glow)"
            />
          )}

          {/* Components */}
          {components.map(comp => {
            const spec = COMPONENT_SPECS[comp.type];
            const isLedOn = comp.type === ComponentType.LED && simState === 'running';
            const isSelected = selectedComp === comp.id;
            const isButtonPressed = comp.type === ComponentType.BUTTON && comp.state?.isPressed;

            return (
              <g key={comp.id} transform={`translate(${comp.x}, ${comp.y})`}>
                {/* Selection highlight */}
                {isSelected && (
                  <rect
                    width={spec.width + 10}
                    height={spec.height + 10}
                    x={-5}
                    y={-5}
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="3"
                    strokeDasharray="8,4"
                    rx="8"
                    filter="url(#glow)"
                    className="pointer-events-none animate-pulse"
                  />
                )}

                {/* Component shadow */}
                <rect
                  width={spec.width}
                  height={spec.height}
                  fill="rgba(0,0,0,0.3)"
                  rx="4"
                  transform="translate(3, 3)"
                  className="pointer-events-none"
                />

                {/* ARDUINO UNO */}
                {comp.type === ComponentType.ARDUINO_UNO && (
                  <>
                    <rect
                      width={spec.width}
                      height={spec.height}
                      fill="#00878F"
                      stroke="#a855f7"
                      strokeWidth="2"
                      rx="6"
                      onMouseDown={(e) => handleMouseDownComp(e, comp.id)}
                      className="cursor-move"
                      filter="url(#glow)"
                    />
                    <rect x="5" y="50" width="20" height="15" fill="#c0c0c0" stroke="#888" strokeWidth="1" rx="2" className="pointer-events-none" />
                    <circle cx="15" cy="20" r="8" fill="#1a1a1a" stroke="#000" strokeWidth="1" className="pointer-events-none" />
                    <rect x="80" y="50" width="40" height="40" fill="#1a1a1a" stroke="#000" strokeWidth="1" rx="2" className="pointer-events-none" />
                    <text x={spec.width / 2} y={spec.height - 10} textAnchor="middle" className="text-xs font-bold pointer-events-none select-none" fill="white">
                      Arduino Uno
                    </text>
                  </>
                )}

                {/* LED */}
                {comp.type === ComponentType.LED && (
                  <>
                    <rect
                      x="5" y="10" width="30" height="35"
                      fill="#2c3e50"
                      stroke="#1a252f"
                      strokeWidth="2"
                      rx="3"
                      onMouseDown={(e) => handleMouseDownComp(e, comp.id)}
                      className="cursor-move"
                    />
                    <ellipse
                      cx="20" cy="15" rx="12" ry="10"
                      fill={isLedOn ? '#ff5252' : '#e74c3c'}
                      stroke={isLedOn ? '#ff1744' : '#c62828'}
                      strokeWidth="2"
                      onMouseDown={(e) => handleMouseDownComp(e, comp.id)}
                      className="cursor-move"
                      style={{
                        filter: isLedOn ? 'drop-shadow(0 0 20px rgba(255, 82, 82, 1))' : 'none',
                        opacity: isLedOn ? 1 : 0.7
                      }}
                    />
                    <ellipse cx="17" cy="12" rx="4" ry="3" fill="rgba(255,255,255,0.4)" className="pointer-events-none" />
                    <text x="20" y="52" textAnchor="middle" className="text-xs font-bold pointer-events-none select-none" fill="#a855f7">
                      LED
                    </text>
                  </>
                )}

                {/* RESISTOR */}
                {comp.type === ComponentType.RESISTOR && (
                  <>
                    <rect
                      x="10" y="8" width="60" height="14"
                      fill="#f4e4c1"
                      stroke="#a855f7"
                      strokeWidth="2"
                      rx="3"
                      onMouseDown={(e) => handleMouseDownComp(e, comp.id)}
                      className="cursor-move"
                    />
                    <rect x="20" y="8" width="4" height="14" fill="#ff0000" className="pointer-events-none" />
                    <rect x="30" y="8" width="4" height="14" fill="#ff0000" className="pointer-events-none" />
                    <rect x="40" y="8" width="4" height="14" fill="#8b4513" className="pointer-events-none" />
                    <rect x="55" y="8" width="4" height="14" fill="#ffd700" className="pointer-events-none" />
                    <line x1="5" y1="15" x2="10" y2="15" stroke="#c0c0c0" strokeWidth="2" className="pointer-events-none" />
                    <line x1="70" y1="15" x2="75" y2="15" stroke="#c0c0c0" strokeWidth="2" className="pointer-events-none" />
                    <text x="40" y="25" textAnchor="middle" className="text-[9px] font-bold pointer-events-none select-none" fill="#a855f7">
                      220Ω
                    </text>
                  </>
                )}

                {/* BATTERY */}
                {comp.type === ComponentType.BATTERY && (
                  <>
                    <rect
                      width={spec.width}
                      height={spec.height}
                      fill="#1a1a1a"
                      stroke="#a855f7"
                      strokeWidth="2"
                      rx="4"
                      onMouseDown={(e) => handleMouseDownComp(e, comp.id)}
                      className="cursor-move"
                      filter="url(#glow)"
                    />
                    <circle cx="15" cy="8" r="4" fill="#c0c0c0" stroke="#888" strokeWidth="1" className="pointer-events-none" />
                    <circle cx="45" cy="8" r="4" fill="#c0c0c0" stroke="#888" strokeWidth="1" className="pointer-events-none" />
                    <text x="30" y="45" textAnchor="middle" className="text-xs font-bold pointer-events-none select-none" fill="white">
                      9V
                    </text>
                  </>
                )}

                {/* BUTTON */}
                {comp.type === ComponentType.BUTTON && (
                  <>
                    <rect
                      width={spec.width}
                      height={spec.height}
                      fill="#1f2937"
                      stroke="#a855f7"
                      strokeWidth="2"
                      rx="4"
                      onMouseDown={(e) => handleMouseDownComp(e, comp.id)}
                      className="cursor-move"
                      filter="url(#glow)"
                    />
                    <circle
                      cx="25" cy={isButtonPressed ? "27" : "25"} r="12"
                      fill={isButtonPressed ? "#dc2626" : "#ef4444"}
                      stroke={isButtonPressed ? "#b91c1c" : "#dc2626"}
                      strokeWidth="2"
                      onClick={(e) => { e.stopPropagation(); toggleButton(comp.id); }}
                      className="cursor-pointer"
                      filter={isButtonPressed ? "url(#glow)" : "none"}
                    />
                    <circle cx="22" cy="22" r="4" fill="rgba(255,255,255,0.3)" className="pointer-events-none" />
                  </>
                )}

                {/* ULTRASONIC */}
                {comp.type === ComponentType.ULTRASONIC && (
                  <>
                    <rect
                      width={spec.width}
                      height={spec.height}
                      fill="#3b82f6"
                      stroke="#a855f7"
                      strokeWidth="2"
                      rx="4"
                      onMouseDown={(e) => handleMouseDownComp(e, comp.id)}
                      className="cursor-move"
                      filter="url(#glow)"
                    />
                    <circle cx="20" cy="25" r="12" fill="#c0c0c0" stroke="#888" strokeWidth="2" className="pointer-events-none" />
                    <circle cx="20" cy="25" r="8" fill="#1a1a1a" className="pointer-events-none" />
                    <circle cx="60" cy="25" r="12" fill="#c0c0c0" stroke="#888" strokeWidth="2" className="pointer-events-none" />
                    <circle cx="60" cy="25" r="8" fill="#1a1a1a" className="pointer-events-none" />
                    <text x="40" y="52" textAnchor="middle" className="text-[8px] font-bold pointer-events-none select-none" fill="white">
                      HC-SR04
                    </text>
                  </>
                )}

                {/* SERVO */}
                {comp.type === ComponentType.SERVO && (
                  <>
                    <rect
                      width={spec.width}
                      height={spec.height - 15}
                      fill="#1e3a8a"
                      stroke="#a855f7"
                      strokeWidth="2"
                      rx="4"
                      onMouseDown={(e) => handleMouseDownComp(e, comp.id)}
                      className="cursor-move"
                      filter="url(#glow)"
                    />
                    <circle cx="45" cy="15" r="6" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" className="pointer-events-none" />
                    <circle cx="45" cy="15" r="3" fill="#78350f" className="pointer-events-none" />
                    <text x="45" y="28" textAnchor="middle" className="text-[9px] font-bold pointer-events-none select-none" fill="white">
                      SERVO
                    </text>
                    <rect x="20" y="35" width="50" height="8" fill="#2c3e50" stroke="#1a252f" strokeWidth="1" rx="2" className="pointer-events-none" />
                  </>
                )}

                {/* POTENTIOMETER */}
                {comp.type === ComponentType.POTENTIOMETER && (
                  <>
                    {/* Pot body */}
                    <rect
                      width={spec.width}
                      height={spec.height - 15}
                      fill="#1f2937"
                      stroke="#a855f7"
                      strokeWidth="2"
                      rx="4"
                      onMouseDown={(e) => handleMouseDownComp(e, comp.id)}
                      className="cursor-move"
                      filter="url(#glow)"
                    />
                    {/* Dial */}
                    <circle cx="35" cy="30" r="18" fill="#374151" stroke="#4b5563" strokeWidth="2" className="pointer-events-none" />
                    <circle cx="35" cy="30" r="12" fill="#1f2937" stroke="#6b7280" strokeWidth="1" className="pointer-events-none" />
                    {/* Indicator line */}
                    <line
                      x1="35" y1="30"
                      x2={35 + 10 * Math.cos((comp.state?.angle || 0) * Math.PI / 180)}
                      y2={30 + 10 * Math.sin((comp.state?.angle || 0) * Math.PI / 180)}
                      stroke="#fbbf24"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="pointer-events-none"
                    />
                    <text x="35" y="60" textAnchor="middle" className="text-[8px] font-bold pointer-events-none select-none" fill="#a855f7">
                      POT
                    </text>
                  </>
                )}

                {/* LCD 16x2 */}
                {comp.type === ComponentType.LCD_16X2 && (
                  <>
                    {/* LCD body */}
                    <rect
                      width={spec.width}
                      height={spec.height - 15}
                      fill="#22c55e"
                      stroke="#a855f7"
                      strokeWidth="2"
                      rx="4"
                      onMouseDown={(e) => handleMouseDownComp(e, comp.id)}
                      className="cursor-move"
                      filter="url(#glow)"
                    />
                    {/* LCD screen */}
                    <rect
                      x="10" y="10" width="140" height="45"
                      fill="#1e3a1e"
                      stroke="#16a34a"
                      strokeWidth="2"
                      rx="2"
                      className="pointer-events-none"
                    />
                    {/* Display text */}
                    <text x="15" y="25" className="text-[10px] font-mono pointer-events-none select-none" fill="#22c55e">
                      {comp.state?.displayText?.[0] || 'Hello World!'}
                    </text>
                    <text x="15" y="45" className="text-[10px] font-mono pointer-events-none select-none" fill="#22c55e">
                      {comp.state?.displayText?.[1] || 'LCD 16x2'}
                    </text>
                  </>
                )}

                {/* BREADBOARD */}
                {comp.type === ComponentType.BREADBOARD && (
                  <>
                    <rect
                      width={spec.width}
                      height={spec.height}
                      fill="#f5e6d3"
                      stroke="#a855f7"
                      strokeWidth="2"
                      rx="6"
                      onMouseDown={(e) => handleMouseDownComp(e, comp.id)}
                      className="cursor-move"
                      filter="url(#glow)"
                    />
                    {/* Power rails */}
                    <line x1="15" y1="20" x2="15" y2="180" stroke="#dc2626" strokeWidth="4" className="pointer-events-none" />
                    <line x1="30" y1="20" x2="30" y2="180" stroke="#2563eb" strokeWidth="4" className="pointer-events-none" />
                    <line x1="270" y1="20" x2="270" y2="180" stroke="#dc2626" strokeWidth="4" className="pointer-events-none" />
                    <line x1="285" y1="20" x2="285" y2="180" stroke="#2563eb" strokeWidth="4" className="pointer-events-none" />
                    {/* Holes pattern */}
                    {[...Array(10)].map((_, row) => (
                      <g key={row}>
                        {[...Array(30)].map((_, col) => (
                          <circle
                            key={col}
                            cx={50 + col * 7}
                            cy={30 + row * 16}
                            r="2"
                            fill="#8b7355"
                            className="pointer-events-none"
                          />
                        ))}
                      </g>
                    ))}
                  </>
                )}

                {/* BUZZER */}
                {comp.type === ComponentType.BUZZER && (
                  <>
                    {/* Buzzer body */}
                    <rect
                      x="5" y="10" width="40" height="35"
                      fill="#1f2937"
                      stroke="#a855f7"
                      strokeWidth="2"
                      rx="3"
                      onMouseDown={(e) => handleMouseDownComp(e, comp.id)}
                      className="cursor-move"
                      filter="url(#glow)"
                    />
                    {/* Buzzer top */}
                    <circle
                      cx="25" cy="20" r="12"
                      fill="#374151"
                      stroke="#4b5563"
                      strokeWidth="2"
                      onMouseDown={(e) => handleMouseDownComp(e, comp.id)}
                      className="cursor-move"
                    />
                    {/* Sound waves when active */}
                    {comp.state?.isActive && (
                      <>
                        <circle cx="25" cy="20" r="16" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.6" className="animate-ping" />
                        <circle cx="25" cy="20" r="20" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.4" className="animate-ping" style={{ animationDelay: '0.2s' }} />
                      </>
                    )}
                    <text x="25" y="55" textAnchor="middle" className="text-[9px] font-bold pointer-events-none select-none" fill="#a855f7">
                      BUZZER
                    </text>
                  </>
                )}

                {/* RGB LED */}
                {comp.type === ComponentType.RGB_LED && (
                  <>
                    {/* RGB LED body */}
                    <rect
                      x="5" y="10" width="40" height="40"
                      fill="#2c3e50"
                      stroke="#1a252f"
                      strokeWidth="2"
                      rx="3"
                      onMouseDown={(e) => handleMouseDownComp(e, comp.id)}
                      className="cursor-move"
                    />
                    {/* LED dome with mixed color */}
                    <ellipse
                      cx="25" cy="20" rx="14" ry="12"
                      fill={`rgb(${comp.state?.red || 0}, ${comp.state?.green || 0}, ${comp.state?.blue || 0})`}
                      stroke={simState === 'running' ? '#a855f7' : '#6b7280'}
                      strokeWidth="2"
                      onMouseDown={(e) => handleMouseDownComp(e, comp.id)}
                      className="cursor-move"
                      style={{
                        filter: simState === 'running' ? 'drop-shadow(0 0 15px rgba(168, 85, 247, 0.8))' : 'none',
                        opacity: simState === 'running' ? 1 : 0.6
                      }}
                    />
                    {/* Highlight */}
                    <ellipse cx="22" cy="17" rx="4" ry="3" fill="rgba(255,255,255,0.3)" className="pointer-events-none" />
                    <text x="25" y="63" textAnchor="middle" className="text-[8px] font-bold pointer-events-none select-none" fill="#a855f7">
                      RGB LED
                    </text>
                  </>
                )}

                {/* Delete & Rotate buttons for selected component */}
                {isSelected && (
                  <g>
                    <g transform={`translate(${spec.width + 15}, 0)`} onClick={(e) => { e.stopPropagation(); deleteComponent(comp.id); }} className="cursor-pointer">
                      <circle r="12" fill="#ef4444" opacity="0.9" />
                      <text y="5" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" className="pointer-events-none select-none">
                        <Trash2 size={14} />
                      </text>
                    </g>
                    <g transform={`translate(${spec.width + 15}, 30)`} onClick={(e) => { e.stopPropagation(); rotateComponent(comp.id); }} className="cursor-pointer">
                      <circle r="12" fill="#3b82f6" opacity="0.9" />
                      <text y="5" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" className="pointer-events-none select-none">
                        ↻
                      </text>
                    </g>
                  </g>
                )}

                {/* Pins */}
                {spec.pins.map(pin => (
                  <g
                    key={pin.id}
                    transform={`translate(${pin.x}, ${pin.y})`}
                    onMouseDown={(e) => handleMouseDownPin(e, comp.id, pin.id)}
                    className="cursor-pointer hover:scale-125 transition-transform"
                  >
                    <circle r="7" fill="rgba(0,0,0,0.3)" transform="translate(1, 1)" />
                    <circle r="7" fill="#6b21a8" />
                    <circle r="5" fill="#d4af37" stroke="#b8941f" strokeWidth="1" filter="url(#glow)" />
                    <text
                      y="-12"
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="bold"
                      fill="#a855f7"
                      className="pointer-events-none"
                    >
                      {pin.name}
                    </text>
                  </g>
                ))}
              </g>
            );
          })}
        </svg>

        {/* Helper text */}
        {components.length === 0 && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur opacity-40" />
              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10">
                <ZapOff size={64} className="mx-auto mb-6 text-purple-400 opacity-50" />
                <p className="text-2xl font-bold text-white mb-3">Empty Canvas</p>
                <p className="text-lg text-purple-300">Add components from the sidebar to start building</p>
              </div>
            </div>
          </div>
        )}

        {/* Instructions overlay */}
        {components.length > 0 && wires.length === 0 && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-none">
            <div className="bg-purple-500/20 backdrop-blur-sm border border-purple-400/30 px-6 py-3 rounded-full text-purple-200 text-sm font-medium">
              Click component pins to start wiring
            </div>
          </div>
        )}

        {/* Pin State Visualization - Floating Panel */}
        {showPinStates && components.some(c => c.type === ComponentType.ARDUINO_UNO) && (
          <div className="absolute top-4 right-4 w-80 max-h-96 overflow-y-auto">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-50" />
              <div className="relative bg-neutral-900/95 backdrop-blur-xl rounded-2xl border border-purple-500/20 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
                  <div className="flex items-center gap-2">
                    <Cpu size={20} className="text-purple-400" />
                    <h3 className="font-bold text-white">Pin States</h3>
                  </div>
                  <button
                    onClick={() => setShowPinStates(false)}
                    className="text-purple-300 hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Pin Grid */}
                <div className="p-4 space-y-3">
                  {/* Digital Pins */}
                  <div>
                    <h4 className="text-xs font-semibold text-purple-300 mb-2">Digital Pins</h4>
                    <div className="grid grid-cols-7 gap-2">
                      {[...Array(14)].map((_, i) => {
                        const pinState = pinStates[i.toString()];
                        const isHigh = pinState?.value === 1;
                        const isPWM = [3, 5, 6, 9, 10, 11].includes(i);
                        return (
                          <div key={i} className="text-center">
                            <div className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-xs font-bold transition-all ${
                              isHigh
                                ? 'bg-green-500/20 border-green-400 text-green-300'
                                : 'bg-white/5 border-white/10 text-purple-300'
                            }`}>
                              {i}{isPWM && '~'}
                            </div>
                            <div className="text-[10px] mt-1 text-purple-300/70">
                              {pinState?.mode || 'N/A'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Analog Pins */}
                  <div>
                    <h4 className="text-xs font-semibold text-purple-300 mb-2">Analog Pins</h4>
                    <div className="space-y-2">
                      {[...Array(6)].map((_, i) => {
                        const pinName = `A${i}`;
                        const pinState = pinStates[pinName];
                        const value = pinState?.value || 0;
                        const percentage = (value / 1023) * 100;
                        return (
                          <div key={pinName} className="flex items-center gap-2">
                            <div className="w-8 text-xs font-bold text-purple-300">{pinName}</div>
                            <div className="flex-1 h-6 bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <div className="w-12 text-xs font-mono text-cyan-300">{value}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Code Editor Panel - Floating Side Panel */}
        {showCodeEditor && (
          <div className="absolute top-4 left-4 w-96 max-h-[600px] flex flex-col">
            <div className="relative group flex-1 flex flex-col">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-50" />
              <div className="relative bg-neutral-900/95 backdrop-blur-xl rounded-2xl border border-purple-500/20 shadow-2xl flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
                  <div className="flex items-center gap-2">
                    <Code size={20} className="text-purple-400" />
                    <h3 className="font-bold text-white">Arduino Code</h3>
                  </div>
                  <button
                    onClick={() => setShowCodeEditor(false)}
                    className="text-purple-300 hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Code Editor */}
                <div className="flex-1 overflow-hidden">
                  <textarea
                    value={arduinoCode}
                    onChange={(e) => setArduinoCode(e.target.value)}
                    className="w-full h-full p-4 bg-black/50 text-green-300 font-mono text-sm resize-none focus:outline-none"
                    style={{ lineHeight: '1.5' }}
                    spellCheck={false}
                  />
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-purple-500/20 flex gap-2">
                  <button
                    onClick={() => {
                      // Upload/compile code logic
                      setSerialOutput(prev => [...prev, `[${new Date().toLocaleTimeString()}] Compiling sketch...`]);
                      setTimeout(() => {
                        setSerialOutput(prev => [...prev, `[${new Date().toLocaleTimeString()}] Upload complete!`]);
                      }, 500);
                    }}
                    className="relative group flex-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div className="relative bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 rounded-xl font-bold flex items-center justify-center gap-2 text-sm">
                      <Upload size={16} /> Upload
                    </div>
                  </button>
                  <button
                    onClick={() => setArduinoCode(`void setup() {\n  Serial.begin(9600);\n  pinMode(13, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(13, HIGH);\n  Serial.println("LED ON");\n  delay(1000);\n  digitalWrite(13, LOW);\n  Serial.println("LED OFF");\n  delay(1000);\n}`)}
                    className="bg-white/5 border border-white/10 hover:border-purple-400/50 text-purple-300 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Serial Monitor - Bottom Collapsible Panel */}
      <div className={`absolute bottom-0 left-0 right-0 transition-all duration-300 z-20 ${
        showSerialMonitor ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent blur" />
          <div className="relative bg-neutral-900/98 backdrop-blur-xl border-t border-purple-500/30 shadow-2xl">
            {/* Toggle Button */}
            <button
              onClick={() => setShowSerialMonitor(!showSerialMonitor)}
              className="absolute -top-10 right-4 bg-neutral-900/95 backdrop-blur-xl border border-purple-500/30 rounded-t-xl px-4 py-2 flex items-center gap-2 text-purple-300 hover:text-white transition-colors shadow-lg"
            >
              <Terminal size={18} />
              <span className="text-sm font-medium">Serial Monitor</span>
              {showSerialMonitor ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>

            {/* Serial Monitor Content */}
            <div className="p-4 max-h-64 overflow-y-auto">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-purple-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm font-semibold text-white">COM3 - 9600 baud</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const text = serialOutput.join('\n');
                      navigator.clipboard.writeText(text);
                    }}
                    className="bg-white/5 border border-white/10 hover:border-purple-400/50 text-purple-300 px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-all"
                  >
                    <Copy size={12} /> Copy
                  </button>
                  <button
                    onClick={() => setSerialOutput([])}
                    className="bg-red-500/20 border border-red-400/30 hover:border-red-400/50 text-red-300 px-3 py-1 rounded-lg text-xs font-medium transition-all"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Serial Output */}
              <div className="font-mono text-sm space-y-1">
                {serialOutput.length === 0 ? (
                  <div className="text-purple-300/50 italic">No serial output yet...</div>
                ) : (
                  serialOutput.map((line, i) => (
                    <div key={i} className="text-green-300">
                      {line}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar for toggling panels */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
        <button
          onClick={() => setShowCodeEditor(!showCodeEditor)}
          className={`relative group ${showCodeEditor ? 'opacity-100' : 'opacity-70'}`}
        >
          <div className="absolute inset-0 bg-purple-500 rounded-xl blur opacity-0 group-hover:opacity-40 transition-opacity" />
          <div className={`relative px-4 py-2 backdrop-blur-sm border rounded-xl flex items-center gap-2 font-medium text-sm transition-all ${
            showCodeEditor
              ? 'bg-purple-500/30 border-purple-400/50 text-purple-200'
              : 'bg-white/5 border-white/10 text-purple-300 hover:border-purple-400/30'
          }`}>
            <Code size={16} />
            <span className="hidden md:inline">Code Editor</span>
          </div>
        </button>

        <button
          onClick={() => setShowSerialMonitor(!showSerialMonitor)}
          className={`relative group ${showSerialMonitor ? 'opacity-100' : 'opacity-70'}`}
        >
          <div className="absolute inset-0 bg-purple-500 rounded-xl blur opacity-0 group-hover:opacity-40 transition-opacity" />
          <div className={`relative px-4 py-2 backdrop-blur-sm border rounded-xl flex items-center gap-2 font-medium text-sm transition-all ${
            showSerialMonitor
              ? 'bg-purple-500/30 border-purple-400/50 text-purple-200'
              : 'bg-white/5 border-white/10 text-purple-300 hover:border-purple-400/30'
          }`}>
            <Terminal size={16} />
            <span className="hidden md:inline">Serial Monitor</span>
          </div>
        </button>

        <button
          onClick={() => setShowPinStates(!showPinStates)}
          className={`relative group ${showPinStates ? 'opacity-100' : 'opacity-70'}`}
        >
          <div className="absolute inset-0 bg-purple-500 rounded-xl blur opacity-0 group-hover:opacity-40 transition-opacity" />
          <div className={`relative px-4 py-2 backdrop-blur-sm border rounded-xl flex items-center gap-2 font-medium text-sm transition-all ${
            showPinStates
              ? 'bg-purple-500/30 border-purple-400/50 text-purple-200'
              : 'bg-white/5 border-white/10 text-purple-300 hover:border-purple-400/30'
          }`}>
            <Cpu size={16} />
            <span className="hidden md:inline">Pin States</span>
          </div>
        </button>
      </div>

      {/* Zoom & Navigation Controls - Bottom Left */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-2 z-30">
        {/* Zoom Controls */}
        <div className="flex flex-col gap-1 bg-neutral-900/95 backdrop-blur-xl rounded-xl border border-purple-500/20 p-2">
          <button
            onClick={handleZoomIn}
            title="Zoom In (Ctrl + =)"
            className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors text-purple-300 hover:text-white"
          >
            <ZoomIn size={20} />
          </button>
          <div className="text-xs text-center text-purple-300 font-mono py-1">
            {(zoom * 100).toFixed(0)}%
          </div>
          <button
            onClick={handleZoomOut}
            title="Zoom Out (Ctrl + -)"
            className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors text-purple-300 hover:text-white"
          >
            <ZoomOut size={20} />
          </button>
          <button
            onClick={handleResetView}
            title="Reset View (Ctrl + 0)"
            className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors text-purple-300 hover:text-white border-t border-purple-500/20"
          >
            <Maximize2 size={20} />
          </button>
        </div>

        {/* Undo/Redo Controls */}
        <div className="flex gap-1 bg-neutral-900/95 backdrop-blur-xl rounded-xl border border-purple-500/20 p-2">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            title="Undo (Ctrl + Z)"
            className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors text-purple-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Undo size={20} />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            title="Redo (Ctrl + Y)"
            className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors text-purple-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Redo size={20} />
          </button>
        </div>

        {/* Help Button */}
        <button
          onClick={() => setShowShortcuts(!showShortcuts)}
          title="Keyboard Shortcuts (?)"
          className="bg-neutral-900/95 backdrop-blur-xl rounded-xl border border-purple-500/20 p-2 hover:bg-purple-500/20 transition-colors text-purple-300 hover:text-white"
        >
          <Info size={20} />
        </button>
      </div>

      {/* Keyboard Shortcuts Panel */}
      {showShortcuts && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center" onClick={() => setShowShortcuts(false)}>
          <div className="relative max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur opacity-50" />
            <div className="relative bg-neutral-900 rounded-3xl border border-purple-500/20 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Keyboard Shortcuts</h2>
                <button
                  onClick={() => setShowShortcuts(false)}
                  className="text-purple-300 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Navigation */}
                <div>
                  <h3 className="text-purple-400 font-semibold mb-3">Navigation</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-200">Zoom In</span>
                      <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-purple-300">Ctrl + =</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200">Zoom Out</span>
                      <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-purple-300">Ctrl + -</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200">Reset View</span>
                      <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-purple-300">Ctrl + 0</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200">Pan Canvas</span>
                      <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-purple-300">Ctrl + Drag</kbd>
                    </div>
                  </div>
                </div>

                {/* Editing */}
                <div>
                  <h3 className="text-purple-400 font-semibold mb-3">Editing</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-200">Undo</span>
                      <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-purple-300">Ctrl + Z</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200">Redo</span>
                      <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-purple-300">Ctrl + Y</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200">Delete Component</span>
                      <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-purple-300">Del</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200">Cancel Wire</span>
                      <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-purple-300">Esc</kbd>
                    </div>
                  </div>
                </div>

                {/* File Operations */}
                <div>
                  <h3 className="text-purple-400 font-semibold mb-3">File Operations</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-200">Save Circuit</span>
                      <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-purple-300">Ctrl + S</kbd>
                    </div>
                  </div>
                </div>

                {/* Help */}
                <div>
                  <h3 className="text-purple-400 font-semibold mb-3">Help</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-200">Show Shortcuts</span>
                      <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-purple-300">?</kbd>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Component Controls - Potentiometer */}
      {selectedComp && components.find(c => c.id === selectedComp)?.type === ComponentType.POTENTIOMETER && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-80">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-50" />
            <div className="relative bg-neutral-900/95 backdrop-blur-xl rounded-2xl border border-purple-500/20 shadow-2xl p-4">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                <RotateCw size={18} className="text-purple-400" />
                Potentiometer Control
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-purple-300">Angle</span>
                    <span className="text-white font-mono">{components.find(c => c.id === selectedComp)?.state?.angle || 0}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="270"
                    value={components.find(c => c.id === selectedComp)?.state?.angle || 0}
                    onChange={(e) => {
                      const angle = parseInt(e.target.value);
                      const resistance = Math.round((angle / 270) * 10000);
                      setComponents(prev => prev.map(c =>
                        c.id === selectedComp
                          ? { ...c, state: { ...c.state, angle, resistance } }
                          : c
                      ));
                    }}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #a855f7 0%, #ec4899 ${((components.find(c => c.id === selectedComp)?.state?.angle || 0) / 270) * 100}%, rgba(255,255,255,0.1) ${((components.find(c => c.id === selectedComp)?.state?.angle || 0) / 270) * 100}%)`
                    }}
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-purple-300">Resistance</span>
                    <span className="text-white font-mono">{components.find(c => c.id === selectedComp)?.state?.resistance || 0}Ω</span>
                  </div>
                  <div className="text-xs text-purple-300/70">{((components.find(c => c.id === selectedComp)?.state?.resistance || 0) / 1000).toFixed(2)}kΩ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Component Controls - RGB LED */}
      {selectedComp && components.find(c => c.id === selectedComp)?.type === ComponentType.RGB_LED && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-80">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-50" />
            <div className="relative bg-neutral-900/95 backdrop-blur-xl rounded-2xl border border-purple-500/20 shadow-2xl p-4">
              <h3 className="font-bold text-white mb-3">RGB LED Control</h3>
              <div className="space-y-3">
                {/* Red Channel */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-red-400">Red</span>
                    <span className="text-white font-mono">{components.find(c => c.id === selectedComp)?.state?.red || 0}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={components.find(c => c.id === selectedComp)?.state?.red || 0}
                    onChange={(e) => {
                      setComponents(prev => prev.map(c =>
                        c.id === selectedComp
                          ? { ...c, state: { ...c.state, red: parseInt(e.target.value) } }
                          : c
                      ));
                    }}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${((components.find(c => c.id === selectedComp)?.state?.red || 0) / 255) * 100}%, rgba(255,255,255,0.1) ${((components.find(c => c.id === selectedComp)?.state?.red || 0) / 255) * 100}%)`
                    }}
                  />
                </div>

                {/* Green Channel */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-green-400">Green</span>
                    <span className="text-white font-mono">{components.find(c => c.id === selectedComp)?.state?.green || 0}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={components.find(c => c.id === selectedComp)?.state?.green || 0}
                    onChange={(e) => {
                      setComponents(prev => prev.map(c =>
                        c.id === selectedComp
                          ? { ...c, state: { ...c.state, green: parseInt(e.target.value) } }
                          : c
                      ));
                    }}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #22c55e 0%, #22c55e ${((components.find(c => c.id === selectedComp)?.state?.green || 0) / 255) * 100}%, rgba(255,255,255,0.1) ${((components.find(c => c.id === selectedComp)?.state?.green || 0) / 255) * 100}%)`
                    }}
                  />
                </div>

                {/* Blue Channel */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-blue-400">Blue</span>
                    <span className="text-white font-mono">{components.find(c => c.id === selectedComp)?.state?.blue || 0}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={components.find(c => c.id === selectedComp)?.state?.blue || 0}
                    onChange={(e) => {
                      setComponents(prev => prev.map(c =>
                        c.id === selectedComp
                          ? { ...c, state: { ...c.state, blue: parseInt(e.target.value) } }
                          : c
                      ));
                    }}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((components.find(c => c.id === selectedComp)?.state?.blue || 0) / 255) * 100}%, rgba(255,255,255,0.1) ${((components.find(c => c.id === selectedComp)?.state?.blue || 0) / 255) * 100}%)`
                    }}
                  />
                </div>

                {/* Color Preview */}
                <div className="mt-4 p-3 rounded-xl border border-white/10 flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg border-2 border-white/20"
                    style={{
                      backgroundColor: `rgb(${components.find(c => c.id === selectedComp)?.state?.red || 0}, ${components.find(c => c.id === selectedComp)?.state?.green || 0}, ${components.find(c => c.id === selectedComp)?.state?.blue || 0})`
                    }}
                  />
                  <div className="text-xs text-purple-300">
                    <div>Preview</div>
                    <div className="font-mono text-white">
                      rgb({components.find(c => c.id === selectedComp)?.state?.red || 0}, {components.find(c => c.id === selectedComp)?.state?.green || 0}, {components.find(c => c.id === selectedComp)?.state?.blue || 0})
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
