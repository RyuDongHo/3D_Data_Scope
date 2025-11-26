/**
 * 3D 뷰어 관련 타입 정의
 */

// import { Vector3 } from 'three'; // Currently unused

export interface CameraSettings {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  near: number;
  far: number;
  zoom: number;
}

export interface PointSettings {
  size: number;
  color: string;
  opacity: number;
  sizeAttenuation: boolean;
  showLabels: boolean;
}

export interface SceneSettings {
  backgroundColor: string;
  showGrid: boolean;
  showGridYZ: boolean;
  showAxes: boolean;
  gridSize: number;
  gridDivisions: number;
  axisLength: number;
  normalizeRange: number;
}

export interface FilterRange {
  min: number;
  max: number;
}

export interface AxisFilters {
  x: FilterRange;
  y: FilterRange;
  z: FilterRange;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
  color?: string;
  size?: number;
  label?: string;
  originalIndex: number;
  originalX?: number;
  originalY?: number;
  originalZ?: number;
  originalColor?: string;
}

export interface ViewerExportOptions {
  format: 'png' | 'jpeg' | 'webp';
  width: number;
  height: number;
  quality: number;
}
