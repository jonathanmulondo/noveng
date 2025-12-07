import React, { useState, useRef, useCallback } from 'react';
import { ComponentType, SimComponent, Wire, Pin } from '../types';
import { COMPONENT_SPECS } from '../constants';
import { Trash2, Play, RefreshCw, ZapOff, Save, Download } from 'lucide-react';

export const Simulator: React.FC = () => {
  const [components, setComponents] = useState<SimComponent[]>([]);
  const [wires, setWires] = useState<Wire[]>([]);
  const [draggedComp, setDraggedComp] = useState<string | null>(null);
  const [isDrawingWire, setIsDrawingWire] = useState<{ compId: string, pinId: string } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [simState, setSimState] = useState<'idle' | 'running' | 'error'>('idle');
  const [validationMsg, setValidationMsg] = useState('');

  const svgRef = useRef<SVGSVGElement>(null);

  const getSVGCoords = (e: React.MouseEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const CTM = svgRef.current.getScreenCTM();
    if (!CTM) return { x: 0, y: 0 };
    return {
      x: (e.clientX - CTM.e) / CTM.a,
      y: (e.clientY - CTM.f) / CTM.d
    };
  };

  const addComponent = (type: ComponentType) => {
    const id = `${type}_${Date.now()}`;
    const offset = components.length * 20;
    setComponents(prev => [...prev, { id, type, x: 100 + offset, y: 100 + offset }]);
  };

  const handleMouseDownComp = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDraggedComp(id);
  };

  const handleMouseDownPin = (e: React.MouseEvent, compId: string, pinId: string) => {
    e.stopPropagation();
    if (isDrawingWire) {
      if (isDrawingWire.compId === compId && isDrawingWire.pinId === pinId) {
        setIsDrawingWire(null);
        return;
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
    } else {
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
          x: coords.x - (COMPONENT_SPECS[c.type].width / 2),
          y: coords.y - (COMPONENT_SPECS[c.type].height / 2)
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
    setComponents([]);
    setWires([]);
    setSimState('idle');
    setValidationMsg('');
  };

  const runSimulation = () => {
    // Check if there's an Arduino
    const arduino = components.find(c => c.type === ComponentType.ARDUINO_UNO);
    if (!arduino) {
      setSimState('error');
      setValidationMsg("⚠️ Add an Arduino Uno to start building circuits!");
      return;
    }

    // Check for LED circuit
    const leds = components.filter(c => c.type === ComponentType.LED);
    if (leds.length > 0) {
      let powered = false;
      let grounded = false;
      const led = leds[0];
      const connectedWires = wires.filter(w => w.fromCompId === led.id || w.toCompId === led.id);

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

      if (powered && grounded) {
        setSimState('running');
        setValidationMsg("✅ Perfect! Your LED circuit is complete and glowing!");
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
        setValidationMsg("✅ Button circuit ready! Press to read digital input.");
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
        setValidationMsg("✅ HC-SR04 connected! Ready to measure distance.");
        return;
      } else {
        setSimState('error');
        setValidationMsg("⚠️ HC-SR04 needs 4 connections: VCC, TRIG, ECHO, GND.");
        return;
      }
    }

    setSimState('error');
    setValidationMsg("⚠️ Add components to your breadboard to start testing!");
  };

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-white">

      {/* Component Palette - Purple Theme */}
      <div className="w-full md:w-64 bg-white border-r border-purple-100 p-6 flex flex-col gap-6 shadow-xl z-10">
        <div>
          <h2 className="font-display text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-2">
            Components
          </h2>
          <p className="text-sm text-neutral-500">Drag onto breadboard</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
          {Object.keys(COMPONENT_SPECS).map((key) => {
            const type = key as ComponentType;
            return (
              <button
                key={type}
                onClick={() => addComponent(type)}
                className="group relative p-4 border-2 border-purple-100 rounded-2xl hover:border-purple-300 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 transition-all text-left flex flex-col items-center gap-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 rounded-2xl transition-all" />
                <div className="relative font-semibold text-sm text-neutral-800">
                  {COMPONENT_SPECS[type].label}
                </div>
                <div className="relative text-xs text-neutral-500">Click to add</div>
              </button>
            );
          })}
        </div>

        <div className="mt-auto space-y-3 border-t border-purple-100 pt-6">
          <button
            onClick={runSimulation}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-200 transition-all"
          >
            <Play size={18} fill="white" /> Test Circuit
          </button>
          <button
            onClick={clearBoard}
            className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 py-3 rounded-2xl font-medium flex items-center justify-center gap-2 transition-all"
          >
            <Trash2 size={18} /> Clear Board
          </button>
        </div>

        {validationMsg && (
          <div className={`p-4 rounded-2xl text-sm font-medium ${
            simState === 'running'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-orange-50 text-orange-800 border border-orange-200'
          }`}>
            {validationMsg}
          </div>
        )}
      </div>

      {/* Breadboard Canvas - Realistic Style */}
      <div
        className="flex-1 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #f5e6d3 0%, #e8d7bd 100%)',
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Breadboard texture/pattern */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 10px 10px, #8b7355 2px, transparent 0)',
            backgroundSize: '20px 20px'
          }}
        />

        <svg
          ref={svgRef}
          className="w-full h-full"
          style={{ cursor: isDrawingWire ? 'crosshair' : 'default' }}
        >
          {/* Power rails (red and blue lines) */}
          <rect x="20" y="20" width="8" height="95%" fill="#dc2626" opacity="0.7" rx="4" />
          <rect x="36" y="20" width="8" height="95%" fill="#1e40af" opacity="0.7" rx="4" />

          {/* Draw wires with realistic colors */}
          {wires.map((wire, idx) => {
            const start = getPinCoords(wire.fromCompId, wire.fromPinId);
            const end = getPinCoords(wire.toCompId, wire.toPinId);
            const colors = ['#ef4444', '#1f2937', '#22c55e', '#3b82f6', '#eab308', '#f97316'];
            const wireColor = colors[idx % colors.length];

            return (
              <g key={wire.id}>
                {/* Wire shadow for depth */}
                <line
                  x1={start.x} y1={start.y}
                  x2={end.x} y2={end.y}
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  transform="translate(2, 2)"
                />
                {/* Actual wire */}
                <line
                  x1={start.x} y1={start.y}
                  x2={end.x} y2={end.y}
                  stroke={simState === 'running' ? '#22c55e' : wireColor}
                  strokeWidth="5"
                  strokeLinecap="round"
                  className={simState === 'running' ? 'animate-pulse' : ''}
                />
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
              opacity="0.7"
            />
          )}

          {/* Components with realistic styling */}
          {components.map(comp => {
            const spec = COMPONENT_SPECS[comp.type];
            const isLedOn = comp.type === ComponentType.LED && simState === 'running';

            return (
              <g key={comp.id} transform={`translate(${comp.x}, ${comp.y})`}>
                {/* Component shadow */}
                <rect
                  width={spec.width}
                  height={spec.height}
                  fill="rgba(0,0,0,0.15)"
                  rx="4"
                  transform="translate(3, 3)"
                  className="pointer-events-none"
                />

                {/* ARDUINO UNO - Realistic teal board */}
                {comp.type === ComponentType.ARDUINO_UNO && (
                  <>
                    <rect
                      width={spec.width}
                      height={spec.height}
                      fill="#00878F"
                      stroke="#006064"
                      strokeWidth="2"
                      rx="6"
                      onMouseDown={(e) => handleMouseDownComp(e, comp.id)}
                      className="cursor-move"
                    />
                    {/* USB port */}
                    <rect x="5" y="50" width="20" height="15" fill="#c0c0c0" stroke="#888" strokeWidth="1" rx="2" className="pointer-events-none" />
                    {/* Power jack */}
                    <circle cx="15" cy="20" r="8" fill="#1a1a1a" stroke="#000" strokeWidth="1" className="pointer-events-none" />
                    {/* ATmega chip */}
                    <rect x="80" y="50" width="40" height="40" fill="#1a1a1a" stroke="#000" strokeWidth="1" rx="2" className="pointer-events-none" />
                    <text x={spec.width / 2} y={spec.height - 10} textAnchor="middle" className="text-xs font-bold pointer-events-none select-none" fill="white">
                      Arduino Uno
                    </text>
                  </>
                )}

                {/* LED - Realistic with dome */}
                {comp.type === ComponentType.LED && (
                  <>
                    {/* LED body */}
                    <rect
                      x="5" y="10" width="30" height="35"
                      fill="#2c3e50"
                      stroke="#1a252f"
                      strokeWidth="2"
                      rx="3"
                      onMouseDown={(e) => handleMouseDownComp(e, comp.id)}
                      className="cursor-move"
                    />
                    {/* LED dome (top) */}
                    <ellipse
                      cx="20" cy="15" rx="12" ry="10"
                      fill={isLedOn ? '#ff5252' : '#e74c3c'}
                      stroke={isLedOn ? '#ff1744' : '#c62828'}
                      strokeWidth="2"
                      onMouseDown={(e) => handleMouseDownComp(e, comp.id)}
                      className="cursor-move"
                      style={{
                        filter: isLedOn ? 'drop-shadow(0 0 15px rgba(255, 82, 82, 0.9))' : 'none',
                        opacity: isLedOn ? 1 : 0.7
                      }}
                    />
                    {/* LED highlight for 3D effect */}
                    <ellipse cx="17" cy="12" rx="4" ry="3" fill="rgba(255,255,255,0.4)" className="pointer-events-none" />
                    <text x="20" y="52" textAnchor="middle" className="text-xs font-bold pointer-events-none select-none" fill="#1f2937">
                      LED
                    </text>
                  </>
                )}

                {/* RESISTOR - Realistic with color bands */}
                {comp.type === ComponentType.RESISTOR && (
                  <>
                    {/* Resistor body */}
                    <rect
                      x="10" y="8" width="60" height="14"
                      fill="#f4e4c1"
                      stroke="#8b7355"
                      strokeWidth="2"
                      rx="3"
                      onMouseDown={(e) => handleMouseDownComp(e, comp.id)}
                      className="cursor-move"
                    />
                    {/* Color bands (220Ω: Red, Red, Brown, Gold) */}
                    <rect x="20" y="8" width="4" height="14" fill="#ff0000" className="pointer-events-none" />
                    <rect x="30" y="8" width="4" height="14" fill="#ff0000" className="pointer-events-none" />
                    <rect x="40" y="8" width="4" height="14" fill="#8b4513" className="pointer-events-none" />
                    <rect x="55" y="8" width="4" height="14" fill="#ffd700" className="pointer-events-none" />
                    {/* Leads */}
                    <line x1="5" y1="15" x2="10" y2="15" stroke="#c0c0c0" strokeWidth="2" className="pointer-events-none" />
                    <line x1="70" y1="15" x2="75" y2="15" stroke="#c0c0c0" strokeWidth="2" className="pointer-events-none" />
                    <text x="40" y="25" textAnchor="middle" className="text-[9px] font-bold pointer-events-none select-none" fill="#3e2723">
                      220Ω
                    </text>
                  </>
                )}

                {/* BATTERY - Realistic 9V */}
                {comp.type === ComponentType.BATTERY && (
                  <>
                    <rect
                      width={spec.width}
                      height={spec.height}
                      fill="#1a1a1a"
                      stroke="#000"
                      strokeWidth="2"
                      rx="4"
                      onMouseDown={(e) => handleMouseDownComp(e, comp.id)}
                      className="cursor-move"
                    />
                    {/* Battery terminals */}
                    <circle cx="15" cy="8" r="4" fill="#c0c0c0" stroke="#888" strokeWidth="1" className="pointer-events-none" />
                    <circle cx="45" cy="8" r="4" fill="#c0c0c0" stroke="#888" strokeWidth="1" className="pointer-events-none" />
                    <text x="30" y="45" textAnchor="middle" className="text-xs font-bold pointer-events-none select-none" fill="white">
                      9V
                    </text>
                  </>
                )}

                {/* BUTTON - Tactile switch */}
                {comp.type === ComponentType.BUTTON && (
                  <>
                    {/* Button base */}
                    <rect
                      width={spec.width}
                      height={spec.height}
                      fill="#1f2937"
                      stroke="#111827"
                      strokeWidth="2"
                      rx="4"
                      onMouseDown={(e) => handleMouseDownComp(e, comp.id)}
                      className="cursor-move"
                    />
                    {/* Button cap */}
                    <circle
                      cx="25" cy="25" r="12"
                      fill="#ef4444"
                      stroke="#dc2626"
                      strokeWidth="2"
                      onMouseDown={(e) => handleMouseDownComp(e, comp.id)}
                      className="cursor-move"
                    />
                    {/* Button highlight */}
                    <circle cx="22" cy="22" r="4" fill="rgba(255,255,255,0.3)" className="pointer-events-none" />
                  </>
                )}

                {/* ULTRASONIC - HC-SR04 sensor */}
                {comp.type === ComponentType.ULTRASONIC && (
                  <>
                    {/* Sensor body */}
                    <rect
                      width={spec.width}
                      height={spec.height}
                      fill="#3b82f6"
                      stroke="#1e40af"
                      strokeWidth="2"
                      rx="4"
                      onMouseDown={(e) => handleMouseDownComp(e, comp.id)}
                      className="cursor-move"
                    />
                    {/* Left ultrasonic sensor (transmitter) */}
                    <circle cx="20" cy="25" r="12" fill="#c0c0c0" stroke="#888" strokeWidth="2" className="pointer-events-none" />
                    <circle cx="20" cy="25" r="8" fill="#1a1a1a" className="pointer-events-none" />
                    {/* Right ultrasonic sensor (receiver) */}
                    <circle cx="60" cy="25" r="12" fill="#c0c0c0" stroke="#888" strokeWidth="2" className="pointer-events-none" />
                    <circle cx="60" cy="25" r="8" fill="#1a1a1a" className="pointer-events-none" />
                    <text x="40" y="52" textAnchor="middle" className="text-[8px] font-bold pointer-events-none select-none" fill="white">
                      HC-SR04
                    </text>
                  </>
                )}

                {/* SERVO - Motor with connector */}
                {comp.type === ComponentType.SERVO && (
                  <>
                    {/* Servo body */}
                    <rect
                      width={spec.width}
                      height={spec.height - 15}
                      fill="#1e3a8a"
                      stroke="#1e40af"
                      strokeWidth="2"
                      rx="4"
                      onMouseDown={(e) => handleMouseDownComp(e, comp.id)}
                      className="cursor-move"
                    />
                    {/* Servo output shaft */}
                    <circle cx="45" cy="15" r="6" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" className="pointer-events-none" />
                    <circle cx="45" cy="15" r="3" fill="#78350f" className="pointer-events-none" />
                    {/* Servo label */}
                    <text x="45" y="28" textAnchor="middle" className="text-[9px] font-bold pointer-events-none select-none" fill="white">
                      SERVO
                    </text>
                    {/* Wire connector visual */}
                    <rect x="20" y="35" width="50" height="8" fill="#2c3e50" stroke="#1a252f" strokeWidth="1" rx="2" className="pointer-events-none" />
                  </>
                )}

                {/* Pins - realistic style */}
                {spec.pins.map(pin => (
                  <g
                    key={pin.id}
                    transform={`translate(${pin.x}, ${pin.y})`}
                    onMouseDown={(e) => handleMouseDownPin(e, comp.id, pin.id)}
                    className="cursor-pointer hover:scale-125 transition-transform"
                  >
                    {/* Pin hole shadow */}
                    <circle r="7" fill="rgba(0,0,0,0.3)" transform="translate(1, 1)" />
                    {/* Pin hole */}
                    <circle r="7" fill="#8b7355" />
                    {/* Pin metal contact */}
                    <circle r="5" fill="#d4af37" stroke="#b8941f" strokeWidth="1" />
                    {/* Pin label */}
                    <text
                      y="-12"
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="bold"
                      fill="#3e2723"
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
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-neutral-700 text-center pointer-events-none">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border-2 border-dashed border-neutral-300">
              <ZapOff size={48} className="mx-auto mb-4 text-purple-400 opacity-50" />
              <p className="text-lg font-semibold mb-2">Empty Breadboard</p>
              <p className="text-sm text-neutral-500">Add components from the sidebar to start building</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
