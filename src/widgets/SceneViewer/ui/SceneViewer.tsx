/**
 * SceneViewer 위젯 UI
 * Three.js 3D 산점도 렌더링
 */

import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraControls, PerspectiveCamera, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { useSceneViewer } from '../model/useSceneViewer';
import { useViewerStore } from '../../../shared/zustand';
import type { Point3D } from '../../../shared/types';

// 포인트 클라우드 컴포넌트
const PointCloud: React.FC<{
  points: Point3D[];
  colorMap: Map<string, string>;
  hasColorMapping: boolean;
}> = ({ points, colorMap, hasColorMapping }) => {
  const { pointSettings } = useViewerStore();

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(points.length * 3);
    const colors = new Float32Array(points.length * 3);

    points.forEach((point, i) => {
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = point.z;

      // 색상 설정
      let color: THREE.Color;
      if (hasColorMapping && point.label) {
        const colorStr = colorMap.get(point.label) || pointSettings.color;
        color = new THREE.Color(colorStr);
      } else {
        color = new THREE.Color(pointSettings.color);
      }

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    });

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    return geo;
  }, [points, colorMap, hasColorMapping, pointSettings.color]);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        size={pointSettings.size}
        vertexColors
        sizeAttenuation={pointSettings.sizeAttenuation}
        transparent
        opacity={pointSettings.opacity}
        toneMapped={false}
      />
    </points>
  );
};

// 포인트 레이블 컴포넌트
const PointLabels: React.FC<{
  points: Point3D[];
  axisLabels: { x: string; y: string; z: string; color?: string };
}> = ({ points, axisLabels }) => {
  const { pointSettings } = useViewerStore();

  if (!pointSettings.showLabels) return null;

  return (
    <>
      {points.map((point, index) => {
        const labelText = [
          `${axisLabels.x}: ${point.originalX?.toFixed(2) ?? point.x.toFixed(2)}`,
          `${axisLabels.y}: ${point.originalY?.toFixed(2) ?? point.y.toFixed(2)}`,
          `${axisLabels.z}: ${point.originalZ?.toFixed(2) ?? point.z.toFixed(2)}`,
          point.originalColor ? `${axisLabels.color || 'Category'}: ${point.originalColor}` : null,
        ]
          .filter(Boolean)
          .join('\n');

        return (
          <Billboard
            key={index}
            position={[point.x, point.y + 0.5, point.z]}
            follow={true}
            lockX={false}
            lockY={false}
            lockZ={false}
          >
            <Text
              fontSize={0.3}
              color="#ffffff"
              anchorX="center"
              anchorY="bottom"
              outlineWidth={0.02}
              outlineColor="#000000"
            >
              {labelText}
            </Text>
          </Billboard>
        );
      })}
    </>
  );
};

// 커스텀 그리드 컴포넌트 (양면 렌더링)
const CustomGrid: React.FC<{
  size: number;
  divisions: number;
  rotation?: [number, number, number];
  position?: [number, number, number];
}> = ({ size, divisions, rotation = [0, 0, 0], position = [0, 0, 0] }) => {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const vertices = [];
    const halfSize = size / 2;
    const step = size / divisions;

    // 수평선
    for (let i = 0; i <= divisions; i++) {
      const pos = -halfSize + i * step;
      vertices.push(-halfSize, 0, pos, halfSize, 0, pos);
    }

    // 수직선
    for (let i = 0; i <= divisions; i++) {
      const pos = -halfSize + i * step;
      vertices.push(pos, 0, -halfSize, pos, 0, halfSize);
    }

    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    return geo;
  }, [size, divisions]);

  return (
    <lineSegments geometry={geometry} rotation={rotation} position={position}>
      <lineBasicMaterial color="#6b7280" transparent opacity={0.3} side={THREE.DoubleSide} />
    </lineSegments>
  );
};

// 축 헬퍼 컴포넌트
const AxisHelper: React.FC<{
  ranges: {
    x: { min: number; max: number };
    y: { min: number; max: number };
    z: { min: number; max: number };
  } | null;
  axisLabels: { x: string; y: string; z: string };
}> = ({ ranges, axisLabels }) => {
  const { sceneSettings } = useViewerStore();

  if (!sceneSettings.showAxes || !ranges) return null;

  const axisLength = sceneSettings.axisLength;

  return (
    <group>
      {/* X축 (빨강) */}
      <arrowHelper args={[new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), axisLength, 0xff0000]} />
      <Text
        position={[axisLength + 1, 0, 0]}
        fontSize={0.8}
        color="#ff0000"
        anchorX="left"
      >
        {axisLabels.x}
      </Text>

      {/* Y축 (초록) */}
      <arrowHelper args={[new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), axisLength, 0x00ff00]} />
      <Text
        position={[0, axisLength + 1, 0]}
        fontSize={0.8}
        color="#00ff00"
        anchorY="bottom"
      >
        {axisLabels.y}
      </Text>

      {/* Z축 (파랑) */}
      <arrowHelper args={[new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), axisLength, 0x0000ff]} />
      <Text
        position={[0, 0, axisLength + 1]}
        fontSize={0.8}
        color="#0000ff"
        anchorX="left"
      >
        {axisLabels.z}
      </Text>
    </group>
  );
};

export const SceneViewer: React.FC = () => {
  const { points, colorMap, hasColorMapping, ranges, axisMapping } = useSceneViewer();
  const { sceneSettings, cameraSettings } = useViewerStore();

  if (points.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <Canvas
        style={{ background: sceneSettings.backgroundColor }}
      >
        {/* 카메라 */}
        <PerspectiveCamera
          makeDefault
          position={cameraSettings.position}
          fov={cameraSettings.fov}
          near={cameraSettings.near}
          far={cameraSettings.far}
        />

        {/* 조명 */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />

        {/* XZ 평면 그리드 (수평) */}
        {sceneSettings.showGrid && (
          <CustomGrid
            size={sceneSettings.gridSize}
            divisions={sceneSettings.gridDivisions}
            rotation={[0, 0, 0]}
            position={[0, 0, 0]}
          />
        )}

        {/* YZ 평면 그리드 (수직) */}
        {sceneSettings.showGridYZ && (
          <CustomGrid
            size={sceneSettings.gridSize}
            divisions={sceneSettings.gridDivisions}
            rotation={[0, 0, Math.PI / 2]}
            position={[0, 0, 0]}
          />
        )}

        {/* 축 */}
        <AxisHelper
          ranges={ranges}
          axisLabels={{
            x: axisMapping?.x || 'X',
            y: axisMapping?.y || 'Y',
            z: axisMapping?.z || 'Z',
          }}
        />

        {/* 포인트 클라우드 */}
        <PointCloud
          points={points}
          colorMap={colorMap}
          hasColorMapping={hasColorMapping}
        />

        {/* 포인트 레이블 */}
        <PointLabels
          points={points}
          axisLabels={{
            x: axisMapping?.x || 'X',
            y: axisMapping?.y || 'Y',
            z: axisMapping?.z || 'Z',
            color: axisMapping?.color || undefined,
          }}
        />

        {/* 카메라 컨트롤 */}
        <CameraControls
          minDistance={0.1}
          maxDistance={1000}
          smoothTime={0.25}
          draggingSmoothTime={0.125}
          maxSpeed={Infinity}
          dollySpeed={2}
          truckSpeed={2}
        />
      </Canvas>
    </div>
  );
};
