/**
 * 데이터 변환 유틸리티
 */

import type { Point3D, AxisMapping, CSVData } from '../types';

/**
 * CSV 데이터를 3D 포인트 배열로 변환
 */
export const transformToPoints = (
  data: CSVData,
  mapping: AxisMapping
): Point3D[] => {
  const { rows } = data;
  const { x, y, z, color } = mapping;

  if (!x || !y || !z) {
    return [];
  }

  return rows
    .map((row, index) => {
      const xVal = Number(row[x]);
      const yVal = Number(row[y]);
      const zVal = Number(row[z]);

      // 유효한 숫자인지 확인
      if (isNaN(xVal) || isNaN(yVal) || isNaN(zVal)) {
        return null;
      }

      const point: Point3D = {
        x: xVal,
        y: yVal,
        z: zVal,
        originalIndex: index,
      };

      // 색상 매핑이 있는 경우
      if (color && row[color] !== undefined) {
        point.label = String(row[color]);
      }

      return point;
    })
    .filter((point): point is Point3D => point !== null);
};

/**
 * 3D 포인트를 정규화하여 변환 (원본 값 보존)
 */
export const transformToNormalizedPoints = (
  data: CSVData,
  mapping: AxisMapping,
  targetRange: [number, number] = [-10, 10]
): {
  points: Point3D[];
  ranges: {
    x: { min: number; max: number };
    y: { min: number; max: number };
    z: { min: number; max: number };
  };
} => {
  const rawPoints = transformToPoints(data, mapping);
  
  if (rawPoints.length === 0) {
    return {
      points: [],
      ranges: {
        x: { min: 0, max: 0 },
        y: { min: 0, max: 0 },
        z: { min: 0, max: 0 },
      },
    };
  }

  // 각 축의 최소/최대값 계산
  const xValues = rawPoints.map((p) => p.x);
  const yValues = rawPoints.map((p) => p.y);
  const zValues = rawPoints.map((p) => p.z);

  const xRange = { min: Math.min(...xValues), max: Math.max(...xValues) };
  const yRange = { min: Math.min(...yValues), max: Math.max(...yValues) };
  const zRange = { min: Math.min(...zValues), max: Math.max(...zValues) };

  // 정규화 함수
  const normalize = (value: number, min: number, max: number): number => {
    if (max === min) return (targetRange[0] + targetRange[1]) / 2;
    return (
      ((value - min) / (max - min)) * (targetRange[1] - targetRange[0]) +
      targetRange[0]
    );
  };

  // 포인트 정규화 (원본 값 저장)
  const normalizedPoints = rawPoints.map((point) => ({
    ...point,
    originalX: point.x,
    originalY: point.y,
    originalZ: point.z,
    originalColor: point.label,
    x: normalize(point.x, xRange.min, xRange.max),
    y: normalize(point.y, yRange.min, yRange.max),
    z: normalize(point.z, zRange.min, zRange.max),
  }));

  return {
    points: normalizedPoints,
    ranges: {
      x: xRange,
      y: yRange,
      z: zRange,
    },
  };
};

/**
 * 데이터 정규화 (0-1 범위로)
 */
export const normalizeData = (
  values: number[]
): { normalized: number[]; min: number; max: number } => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;

  if (range === 0) {
    return {
      normalized: values.map(() => 0.5),
      min,
      max,
    };
  }

  const normalized = values.map((val) => (val - min) / range);

  return { normalized, min, max };
};

/**
 * 데이터 스케일링 (특정 범위로)
 */
export const scaleData = (
  values: number[],
  targetMin: number,
  targetMax: number
): number[] => {
  const { normalized } = normalizeData(values);
  const targetRange = targetMax - targetMin;

  return normalized.map((val) => val * targetRange + targetMin);
};

/**
 * 3D 포인트의 중심점 계산
 */
export const calculateCentroid = (points: Point3D[]): [number, number, number] => {
  if (points.length === 0) return [0, 0, 0];

  const sum = points.reduce(
    (acc, point) => ({
      x: acc.x + point.x,
      y: acc.y + point.y,
      z: acc.z + point.z,
    }),
    { x: 0, y: 0, z: 0 }
  );

  return [
    sum.x / points.length,
    sum.y / points.length,
    sum.z / points.length,
  ];
};

/**
 * 3D 포인트의 바운딩 박스 계산
 */
export const calculateBoundingBox = (
  points: Point3D[]
): {
  min: [number, number, number];
  max: [number, number, number];
  size: [number, number, number];
} => {
  if (points.length === 0) {
    return {
      min: [0, 0, 0],
      max: [0, 0, 0],
      size: [0, 0, 0],
    };
  }

  const min: [number, number, number] = [
    Math.min(...points.map((p) => p.x)),
    Math.min(...points.map((p) => p.y)),
    Math.min(...points.map((p) => p.z)),
  ];

  const max: [number, number, number] = [
    Math.max(...points.map((p) => p.x)),
    Math.max(...points.map((p) => p.y)),
    Math.max(...points.map((p) => p.z)),
  ];

  const size: [number, number, number] = [
    max[0] - min[0],
    max[1] - min[1],
    max[2] - min[2],
  ];

  return { min, max, size };
};

/**
 * 포인트 필터링 (범위 기반)
 */
export const filterPointsByRange = (
  points: Point3D[],
  filters: {
    x?: { min: number; max: number };
    y?: { min: number; max: number };
    z?: { min: number; max: number };
  }
): Point3D[] => {
  return points.filter((point) => {
    if (filters.x) {
      if (point.x < filters.x.min || point.x > filters.x.max) return false;
    }
    if (filters.y) {
      if (point.y < filters.y.min || point.y > filters.y.max) return false;
    }
    if (filters.z) {
      if (point.z < filters.z.min || point.z > filters.z.max) return false;
    }
    return true;
  });
};
