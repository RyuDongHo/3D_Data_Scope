/**
 * 매핑 저장소
 * 축 매핑 설정 관련 전역 상태 관리
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { AxisMapping, ColorMapping } from '../types';

interface MappingState {
  // 상태
  axisMapping: AxisMapping;
  colorMapping: ColorMapping;

  // 액션
  setAxisMapping: (axis: 'x' | 'y' | 'z', column: string | null) => void;
  setColorMapping: (column: string | null) => void;
  setColorScheme: (scheme: ColorMapping['colorScheme']) => void;
  resetMapping: () => void;
}

const initialAxisMapping: AxisMapping = {
  x: null,
  y: null,
  z: null,
  color: null,
};

const initialColorMapping: ColorMapping = {
  column: null,
  colorScheme: 'viridis',
};

export const useMappingStore = create<MappingState>()(
  devtools(
    (set) => ({
      // 초기 상태
      axisMapping: initialAxisMapping,
      colorMapping: initialColorMapping,

      // 액션 구현
      setAxisMapping: (axis, column) =>
        set((state) => ({
          axisMapping: {
            ...state.axisMapping,
            [axis]: column,
          },
        })),

      setColorMapping: (column) =>
        set((state) => ({
          axisMapping: {
            ...state.axisMapping,
            color: column,
          },
          colorMapping: {
            ...state.colorMapping,
            column,
          },
        })),

      setColorScheme: (scheme) =>
        set((state) => ({
          colorMapping: {
            ...state.colorMapping,
            colorScheme: scheme,
          },
        })),

      resetMapping: () =>
        set({
          axisMapping: initialAxisMapping,
          colorMapping: initialColorMapping,
        }),
    }),
    { name: 'MappingStore' }
  )
);
