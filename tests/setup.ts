import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Three.js (heavy library)
vi.mock('three', () => ({
  Scene: vi.fn(),
  PerspectiveCamera: vi.fn(),
  WebGLRenderer: vi.fn(() => ({
    setSize: vi.fn(),
    render: vi.fn(),
    domElement: document.createElement('canvas'),
  })),
  Vector3: vi.fn(),
  Color: vi.fn(),
  BoxGeometry: vi.fn(),
  MeshBasicMaterial: vi.fn(),
  Mesh: vi.fn(),
}));

// Mock R3F Canvas
vi.mock('@react-three/fiber', () => ({
  Canvas: vi.fn(),
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({
    camera: {},
    gl: {},
    scene: {},
  })),
}));

// Mock Drei components
vi.mock('@react-three/drei', () => ({
  OrbitControls: vi.fn(),
  Billboard: vi.fn(),
  CameraControls: vi.fn(),
  Html: vi.fn(),
}));

// Mock Leva
vi.mock('leva', () => ({
  useControls: vi.fn(() => ({})),
  Leva: vi.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})) as any;

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})) as any;

// Helper to create mock File
export function createMockFile(content: string, filename = 'test.csv', mimeType = 'text/csv'): File {
  const blob = new Blob([content], { type: mimeType });
  return new File([blob], filename, { type: mimeType });
}

// Helper to create mock CSV data
export function createMockCSVData(rows: number = 10) {
  const headers = 'x,y,z,label\n';
  const data = Array.from({ length: rows }, (_, i) => 
    `${i},${i * 2},${i * 3},Label${i}`
  ).join('\n');
  return headers + data;
}
