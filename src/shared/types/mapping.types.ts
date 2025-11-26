/**
 * 데이터 매핑 관련 타입 정의
 */

export type AxisType = 'x' | 'y' | 'z';

export interface AxisMapping {
  x: string | null;
  y: string | null;
  z: string | null;
  color: string | null;
}

export interface MappingValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface AxisSuggestion {
  column: string;
  confidence: number;
  reason: string;
}

export interface ColorMapping {
  column: string | null;
  colorScheme: 'viridis' | 'plasma' | 'rainbow' | 'custom';
  customColors?: string[];
}
