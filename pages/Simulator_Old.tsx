import React, { useState, useRef, useCallback } from 'react';
import { ComponentType, SimComponent, Wire, Pin } from '../types';
import { COMPONENT_SPECS } from '../constants';
import { Trash2, Play, RefreshCw, ZapOff } from 'lucide-react';

export const Simulator: React.FC = () => {
  const [components, setComponents] = useState<SimComponent[]>([]);
  const [wires, setWires] = useState<Wire[]>([]);
  const [draggedComp, setDraggedComp] = useState<string | null>(null);
  const [isDrawingWire, setIsDrawingWire] = useState<{ compId: string, pinId: string } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [simState, setSimState] = useState<'idle' | 'running' | 'error'>('idle');
  const [validationMsg, setValidationMsg] = useState('');

  const svgRef = useRef<SVGSVGElement>(null);

  // Helper to get real coordinates relative to SVG
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
    // Random offset to avoid perfect overlap
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
      // Finish wire
      if (isDrawingWire.compId === compId && isDrawingWire.pinId === pinId) {
        // Cancel if clicked same pin
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
      // Start wire
      setIsDrawingWire({ compId, pinId });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const coords = getSVGCoords(e);
    setMousePos(coords);

    if (draggedComp) {
      setComponents(prev => prev.map(c => 
        c.id === draggedComp ? { ...c, x: coords.x - (COMPONENT_SPECS[c.type].width / 2), y: coords.y - (COMPONENT_SPECS[c.type].height / 2) } : c
      ));
    }
  };

  const handleMouseUp = () => {
    setDraggedComp(null);
  };

  // Logic to find absolute pin coordinates
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
    // Phase 1 MVP Logic: Check if LED is connected to Power and Ground
    // Find LED
    const leds = components.filter(c => c.type === ComponentType.LED);
    if (leds.length === 0) {
        setSimState('error');
        setValidationMsg("No LED found! Drag one from the sidebar.");
        return;
    }

    // Simplistic check: Is the LED Anode connected to something digital/power? Is Cathode connected to GND?
    // In a real graph we'd traverse nodes. Here we just look at wire endpoints.
    let powered = false;
    let grounded = false;

    // Check wires attached to LED
    const led = leds[0];
    const connectedWires = wires.filter(w => w.fromCompId === led.id || w.toCompId === led.id);

    connectedWires.forEach(w => {
       // Determine which pin on the LED is connected
       const pinOnLed = w.fromCompId === led.id ? w.fromPinId : w.toPinId;
       
       // Determine the 'other' component's type
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
        setValidationMsg("Circuit Valid! LED is blinking.");
    } else {
        setSimState('error');
        setValidationMsg("Circuit Incomplete. Connect LED Anode (+) to Pin 13/Power and Cathode (-) to GND.");
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar / Palette */}
      <div className="w-full md:w-60 bg-white border-r border-slate-200 p-4 flex flex-col gap-4 shadow-lg z-10">
        <h2 className="font-bold text-slate-700">Components</h2>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
          {Object.keys(COMPONENT_SPECS).map((key) => {
             const type = key as ComponentType;
             return (
              <button
                key={type}
                onClick={() => addComponent(type)}
                className="p-3 border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all text-left flex flex-col items-center"
              >
                <div className="font-semibold text-sm text-slate-700">{COMPONENT_SPECS[type].label}</div>
                <div className="text-xs text-slate-400 mt-1">Click to add</div>
              </button>
             )
          })}
        </div>

        <div className="mt-auto border-t pt-4 space-y-2">
            <button onClick={runSimulation} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2">
                <Play size={18} /> Simulate
            </button>
            <button onClick={clearBoard} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-2 rounded-lg font-medium flex items-center justify-center gap-2">
                <Trash2 size={18} /> Clear
            </button>
        </div>
        
        {validationMsg && (
            <div className={`p-3 rounded-lg text-sm ${simState === 'running' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {validationMsg}
            </div>
        )}
      </div>

      {/* Canvas Area */}
      <div className="flex-1 bg-slate-50 relative overflow-hidden cursor-crosshair" 
        onMouseMove={handleMouseMove} 
        onMouseUp={handleMouseUp}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-20" 
             style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

        <svg 
            ref={svgRef}
            className="w-full h-full"
        >
            {/* Draw Existing Wires */}
            {wires.map(wire => {
                const start = getPinCoords(wire.fromCompId, wire.fromPinId);
                const end = getPinCoords(wire.toCompId, wire.toPinId);
                return (
                    <line 
                        key={wire.id}
                        x1={start.x} y1={start.y}
                        x2={end.x} y2={end.y}
                        stroke={simState === 'running' ? '#22c55e' : '#334155'}
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                );
            })}

            {/* Draw Active Drawing Wire */}
            {isDrawingWire && (
                <line 
                    x1={getPinCoords(isDrawingWire.compId, isDrawingWire.pinId).x}
                    y1={getPinCoords(isDrawingWire.compId, isDrawingWire.pinId).y}
                    x2={mousePos.x}
                    y2={mousePos.y}
                    stroke="#94a3b8"
                    strokeWidth="4"
                    strokeDasharray="5,5"
                    strokeLinecap="round"
                />
            )}

            {/* Draw Components */}
            {components.map(comp => {
                const spec = COMPONENT_SPECS[comp.type];
                const isLedOn = comp.type === ComponentType.LED && simState === 'running';

                return (
                    <g key={comp.id} transform={`translate(${comp.x}, ${comp.y})`}>
                        {/* Component Body */}
                        <rect 
                            width={spec.width} 
                            height={spec.height} 
                            fill={comp.type === ComponentType.ARDUINO_UNO ? '#00878F' : isLedOn ? '#ff5252' : '#e2e8f0'} 
                            stroke="#475569" 
                            strokeWidth="2"
                            rx="4"
                            onMouseDown={(e) => handleMouseDownComp(e, comp.id)}
                            className="cursor-move"
                            style={{ filter: isLedOn ? 'drop-shadow(0 0 10px red)' : 'none' }}
                        />
                        {/* Label */}
                        <text x={spec.width/2} y={spec.height/2 + 5} textAnchor="middle" className="text-xs font-bold pointer-events-none select-none" fill={comp.type === ComponentType.ARDUINO_UNO ? 'white' : '#333'}>
                            {spec.label}
                        </text>

                        {/* Pins */}
                        {spec.pins.map(pin => (
                            <g key={pin.id} 
                               transform={`translate(${pin.x}, ${pin.y})`}
                               onMouseDown={(e) => handleMouseDownPin(e, comp.id, pin.id)}
                               className="cursor-pointer hover:scale-125 transition-transform"
                            >
                                <circle r="6" fill="#fbbf24" stroke="black" strokeWidth="1" />
                                <text y="-10" textAnchor="middle" fontSize="10" fontWeight="bold">{pin.name}</text>
                            </g>
                        ))}
                    </g>
                );
            })}
        </svg>
        
        {/* Helper Text */}
        {components.length === 0 && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-slate-400 text-center pointer-events-none">
                <RefreshCw size={48} className="mx-auto mb-2 opacity-50" />
                <p>Drag components here to start building.</p>
            </div>
        )}
      </div>
    </div>
  );
};