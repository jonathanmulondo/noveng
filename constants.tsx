import React from 'react';
import { ComponentType, Pin } from './types';
import { Zap, BookOpen, Users, Settings, Award } from 'lucide-react';

export const COMPONENT_SPECS: Record<ComponentType, { width: number; height: number; label: string; pins: Pin[] }> = {
  [ComponentType.ARDUINO_UNO]: {
    width: 200,
    height: 140,
    label: "Arduino Uno",
    pins: [
      { id: 'gnd_1', name: 'GND', x: 40, y: 130, type: 'ground' },
      { id: 'pin_13', name: '13', x: 160, y: 10, type: 'digital' },
      { id: '5v', name: '5V', x: 60, y: 130, type: 'power' },
    ]
  },
  [ComponentType.LED]: {
    width: 40,
    height: 60,
    label: "LED",
    pins: [
      { id: 'anode', name: '+', x: 10, y: 55, type: 'digital' },
      { id: 'cathode', name: '-', x: 30, y: 55, type: 'ground' },
    ]
  },
  [ComponentType.RESISTOR]: {
    width: 80,
    height: 30,
    label: "220Ω",
    pins: [
      { id: 't1', name: '', x: 5, y: 15, type: 'digital' },
      { id: 't2', name: '', x: 75, y: 15, type: 'digital' },
    ]
  },
  [ComponentType.BATTERY]: {
    width: 60,
    height: 80,
    label: "9V Battery",
    pins: [
      { id: 'pos', name: '+', x: 15, y: 5, type: 'power' },
      { id: 'neg', name: '-', x: 45, y: 5, type: 'ground' },
    ]
  },
  [ComponentType.BUTTON]: {
    width: 50,
    height: 50,
    label: "Button",
    pins: [
      { id: 'pin1', name: '1', x: 10, y: 10, type: 'digital' },
      { id: 'pin2', name: '2', x: 40, y: 10, type: 'digital' },
      { id: 'pin3', name: '3', x: 10, y: 40, type: 'digital' },
      { id: 'pin4', name: '4', x: 40, y: 40, type: 'digital' },
    ]
  },
  [ComponentType.ULTRASONIC]: {
    width: 80,
    height: 70,
    label: "HC-SR04",
    pins: [
      { id: 'vcc', name: 'VCC', x: 15, y: 60, type: 'power' },
      { id: 'trig', name: 'TRIG', x: 32, y: 60, type: 'digital' },
      { id: 'echo', name: 'ECHO', x: 48, y: 60, type: 'digital' },
      { id: 'gnd', name: 'GND', x: 65, y: 60, type: 'ground' },
    ]
  },
  [ComponentType.SERVO]: {
    width: 90,
    height: 50,
    label: "Servo Motor",
    pins: [
      { id: 'signal', name: 'SIG', x: 25, y: 45, type: 'digital' },
      { id: 'power', name: 'VCC', x: 45, y: 45, type: 'power' },
      { id: 'ground', name: 'GND', x: 65, y: 45, type: 'ground' },
    ]
  }
};

export const NAV_ITEMS = [
  { label: 'Learn', icon: <BookOpen size={24} />, path: '/' },
  { label: 'Feed', icon: <Users size={24} />, path: '/feed' },
  { label: 'Build', icon: <Zap size={24} />, path: '/simulator' },
  { label: 'Profile', icon: <Award size={24} />, path: '/profile' },
];

export const MOCK_USER_ID = "user_123";