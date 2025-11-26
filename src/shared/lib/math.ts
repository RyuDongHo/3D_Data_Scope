/**
 * 수학 및 통계 유틸리티
 */

import type { DataStatistics } from '../types';

/**
 * 평균 계산
 */
export const calculateMean = (values: number[]): number => {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
};

/**
 * 중앙값 계산
 */
export const calculateMedian = (values: number[]): number => {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }

  return sorted[mid];
};

/**
 * 표준편차 계산
 */
export const calculateStdDev = (values: number[]): number => {
  if (values.length === 0) return 0;

  const mean = calculateMean(values);
  const squaredDiffs = values.map((val) => Math.pow(val - mean, 2));
  const variance = calculateMean(squaredDiffs);

  return Math.sqrt(variance);
};

/**
 * 사분위수 계산
 */
export const calculateQuartiles = (
  values: number[]
): { q1: number; q2: number; q3: number } => {
  if (values.length === 0) return { q1: 0, q2: 0, q3: 0 };

  const sorted = [...values].sort((a, b) => a - b);
  const q2 = calculateMedian(sorted);

  const lowerHalf = sorted.slice(0, Math.floor(sorted.length / 2));
  const upperHalf = sorted.slice(Math.ceil(sorted.length / 2));

  const q1 = calculateMedian(lowerHalf);
  const q3 = calculateMedian(upperHalf);

  return { q1, q2, q3 };
};

/**
 * 전체 통계 계산
 */
export const calculateStatistics = (values: number[]): DataStatistics => {
  if (values.length === 0) {
    return {};
  }

  const validValues = values.filter(
    (v) => typeof v === 'number' && !isNaN(v) && isFinite(v)
  );

  if (validValues.length === 0) {
    return {};
  }

  const { q1, q2, q3 } = calculateQuartiles(validValues);

  return {
    mean: calculateMean(validValues),
    median: q2,
    stdDev: calculateStdDev(validValues),
    min: Math.min(...validValues),
    max: Math.max(...validValues),
    q1,
    q3,
  };
};

/**
 * 두 점 사이의 유클리드 거리 계산 (3D)
 */
export const calculateDistance3D = (
  p1: [number, number, number],
  p2: [number, number, number]
): number => {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const dz = p2[2] - p1[2];

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

/**
 * 값 클램핑 (범위 제한)
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * 선형 보간
 */
export const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * clamp(t, 0, 1);
};

/**
 * 값을 특정 범위로 매핑
 */
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => {
  const t = (value - inMin) / (inMax - inMin);
  return lerp(outMin, outMax, t);
};
