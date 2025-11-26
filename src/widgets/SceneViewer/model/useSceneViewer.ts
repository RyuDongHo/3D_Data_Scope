/**
 * SceneViewer 위젯 로직
 */

import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataStore, useMappingStore, useViewerStore } from '../../../shared/zustand';
import { transformToNormalizedPoints } from '../../../shared/lib';
import type { Point3D } from '../../../shared/types';

export const useSceneViewer = () => {
  const navigate = useNavigate();
  const { rawData } = useDataStore();
  const { axisMapping } = useMappingStore();
  const { sceneSettings } = useViewerStore();
  const [points, setPoints] = useState<Point3D[]>([]);
  const [ranges, setRanges] = useState<{
    x: { min: number; max: number };
    y: { min: number; max: number };
    z: { min: number; max: number };
  } | null>(null);

  useEffect(() => {
    if (!rawData || !axisMapping.x || !axisMapping.y || !axisMapping.z) {
      navigate('/upload');
      return;
    }

    // 데이터를 정규화된 3D 포인트로 변환
    const range = sceneSettings.normalizeRange;
    const { points: transformed, ranges: dataRanges } = transformToNormalizedPoints(
      rawData,
      axisMapping,
      [-range, range]
    );
    setPoints(transformed);
    setRanges(dataRanges);
  }, [rawData, axisMapping, sceneSettings.normalizeRange, navigate]);

  // 색상 매핑
  const colorMap = useMemo(() => {
    if (!axisMapping.color || points.length === 0) {
      return new Map<string, string>();
    }

    const uniqueLabels = Array.from(new Set(points.map((p) => p.label || '')));
    const colors = generateColors(uniqueLabels.length);

    const map = new Map<string, string>();
    uniqueLabels.forEach((label, index) => {
      map.set(label, colors[index]);
    });

    return map;
  }, [points, axisMapping.color]);

  return {
    points,
    colorMap,
    hasColorMapping: !!axisMapping.color,
    ranges,
    axisMapping,
  };
};

// 색상 팔레트 생성 (선명하고 밝은 색상)
const generateColors = (count: number): string[] => {
  const colors: string[] = [];
  const baseColors = [
    '#FF6B6B', // 밝은 빨강
    '#4ECDC4', // 청록색
    '#FFE66D', // 노란색
    '#95E1D3', // 민트색
    '#FF8B94', // 분홍색
    '#A8E6CF', // 연두색
    '#FFD3B6', // 복숭아색
    '#FFAAA5', // 연한 빨강
    '#AA96DA', // 보라색
    '#FCBAD3', // 핑크
  ];
  
  for (let i = 0; i < count; i++) {
    colors.push(baseColors[i % baseColors.length]);
  }
  return colors;
};
