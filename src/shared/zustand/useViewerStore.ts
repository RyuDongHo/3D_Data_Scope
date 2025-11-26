/**
 * 뷰어 저장소
 * 3D 뷰어 설정 및 상태 관리
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  CameraSettings,
  PointSettings,
  SceneSettings,
  AxisFilters,
  FilterRange,
} from '../types';

interface ViewerState {
  // 상태
  cameraSettings: CameraSettings;
  pointSettings: PointSettings;
  sceneSettings: SceneSettings;
  filters: AxisFilters;

  // 액션
  setCameraPosition: (position: [number, number, number]) => void;
  setCameraZoom: (zoom: number) => void;
  setPointSize: (size: number) => void;
  setPointColor: (color: string) => void;
  setPointOpacity: (opacity: number) => void;
  setShowLabels: (show: boolean) => void;
  setBackgroundColor: (color: string) => void;
  setShowGrid: (show: boolean) => void;
  setShowGridYZ: (show: boolean) => void;
  setShowAxes: (show: boolean) => void;
  setGridSize: (size: number) => void;
  setAxisLength: (length: number) => void;
  setNormalizeRange: (range: number) => void;
  setFilter: (axis: 'x' | 'y' | 'z', range: FilterRange) => void;
  resetFilters: () => void;
  resetView: () => void;
}

const initialCameraSettings: CameraSettings = {
  position: [10, 10, 10],
  target: [0, 0, 0],
  fov: 75,
  near: 0.1,
  far: 1000,
  zoom: 1,
};

const initialPointSettings: PointSettings = {
  size: 0.1,
  color: '#3498db',
  opacity: 0.8,
  sizeAttenuation: true,
  showLabels: false,
};

const initialSceneSettings: SceneSettings = {
  backgroundColor: '#1a1a2e',
  showGrid: true,
  showGridYZ: false,
  showAxes: true,
  gridSize: 20,
  gridDivisions: 20,
  axisLength: 10,
  normalizeRange: 10,
};

const initialFilters: AxisFilters = {
  x: { min: -Infinity, max: Infinity },
  y: { min: -Infinity, max: Infinity },
  z: { min: -Infinity, max: Infinity },
};

export const useViewerStore = create<ViewerState>()(
  devtools(
    (set) => ({
      // 초기 상태
      cameraSettings: initialCameraSettings,
      pointSettings: initialPointSettings,
      sceneSettings: initialSceneSettings,
      filters: initialFilters,

      // 액션 구현
      setCameraPosition: (position) =>
        set((state) => ({
          cameraSettings: { ...state.cameraSettings, position },
        })),

      setCameraZoom: (zoom) =>
        set((state) => ({
          cameraSettings: { ...state.cameraSettings, zoom },
        })),

      setPointSize: (size) =>
        set((state) => ({
          pointSettings: { ...state.pointSettings, size },
        })),

      setPointColor: (color) =>
        set((state) => ({
          pointSettings: { ...state.pointSettings, color },
        })),

      setPointOpacity: (opacity) =>
        set((state) => ({
          pointSettings: { ...state.pointSettings, opacity },
        })),

      setShowLabels: (show) =>
        set((state) => ({
          pointSettings: { ...state.pointSettings, showLabels: show },
        })),

      setBackgroundColor: (color) =>
        set((state) => ({
          sceneSettings: { ...state.sceneSettings, backgroundColor: color },
        })),

      setShowGrid: (show) =>
        set((state) => ({
          sceneSettings: {
            ...state.sceneSettings,
            showGrid: show,
          },
        })),

      setShowGridYZ: (show) =>
        set((state) => ({
          sceneSettings: {
            ...state.sceneSettings,
            showGridYZ: show,
          },
        })),

      setShowAxes: (show) =>
        set((state) => ({
          sceneSettings: {
            ...state.sceneSettings,
            showAxes: show,
          },
        })),

      setGridSize: (size) =>
        set((state) => ({
          sceneSettings: {
            ...state.sceneSettings,
            gridSize: size,
          },
        })),

      setAxisLength: (length) =>
        set((state) => ({
          sceneSettings: {
            ...state.sceneSettings,
            axisLength: length,
          },
        })),

      setNormalizeRange: (range) =>
        set((state) => ({
          sceneSettings: {
            ...state.sceneSettings,
            normalizeRange: range,
          },
        })),

      setFilter: (axis, range) =>
        set((state) => ({
          filters: {
            ...state.filters,
            [axis]: range,
          },
        })),

      resetFilters: () => set({ filters: initialFilters }),

      resetView: () =>
        set({
          cameraSettings: initialCameraSettings,
          pointSettings: initialPointSettings,
          sceneSettings: initialSceneSettings,
          filters: initialFilters,
        }),
    }),
    { name: 'ViewerStore' }
  )
);
