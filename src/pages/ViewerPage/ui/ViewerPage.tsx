/**
 * ViewerPage - 3D visualization page
 */

import React from 'react';
import { useControls } from 'leva';
import { SceneViewer } from '../../../widgets/SceneViewer/ui/SceneViewer';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/ui';
import { useDataStore, useMappingStore, useViewerStore } from '../../../shared/zustand';

export const ViewerPage: React.FC = () => {
  const navigate = useNavigate();
  const { fileName, rawData } = useDataStore();
  const { axisMapping } = useMappingStore();
  const { 
    sceneSettings, 
    pointSettings,
    setPointSize,
    setPointOpacity,
    setShowLabels,
    setShowGrid,
    setShowGridYZ,
    setShowAxes,
    setGridSize,
    setAxisLength,
    setNormalizeRange,
  } = useViewerStore();

  // Leva controls
  useControls('Point', {
    'Point Size': {
      value: pointSettings.size,
      min: 0.1,
      max: 2,
      step: 0.1,
      onChange: (value) => setPointSize(value),
    },
    'Opacity': {
      value: pointSettings.opacity,
      min: 0.1,
      max: 1,
      step: 0.1,
      onChange: (value) => setPointOpacity(value),
    },
    'Show Values': {
      value: pointSettings.showLabels,
      onChange: (value) => setShowLabels(value),
    },
    'Point Spacing': {
      value: sceneSettings.normalizeRange,
      min: 5,
      max: 50,
      step: 1,
      onChange: (value) => setNormalizeRange(value),
    },
  });

  useControls('Grid', {
    'XZ Plane': {
      value: sceneSettings.showGrid,
      onChange: (value) => setShowGrid(value),
    },
    'YZ Plane': {
      value: sceneSettings.showGridYZ,
      onChange: (value) => setShowGridYZ(value),
    },
    'Grid Size': {
      value: sceneSettings.gridSize,
      min: 10,
      max: 100,
      step: 5,
      onChange: (value) => setGridSize(value),
    },
  });

  useControls('Axis', {
    'Show Axes': {
      value: sceneSettings.showAxes,
      onChange: (value) => setShowAxes(value),
    },
    'Axis Length': {
      value: sceneSettings.axisLength,
      min: 5,
      max: 30,
      step: 1,
      onChange: (value) => setAxisLength(value),
    },
  });

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg z-10">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                3D Data Scope
              </h1>
              <p className="mt-1 text-sm text-gray-300">
                {fileName || 'Data'} - {rawData?.rowCount.toLocaleString()} rows
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Previous button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/mapping')}
                className="text-white border-gray-600 hover:bg-gray-700"
              >
                ← Edit Mapping
              </Button>

              {/* New data */}
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/upload')}
              >
                Upload New Data
              </Button>
            </div>
          </div>

          {/* Mapping info */}
          <div className="mt-4 flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-red-400 font-semibold">X Axis:</span>
              <span className="text-gray-300">{axisMapping.x}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400 font-semibold">Y Axis:</span>
              <span className="text-gray-300">{axisMapping.y}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400 font-semibold">Z Axis:</span>
              <span className="text-gray-300">{axisMapping.z}</span>
            </div>
            {axisMapping.color && (
              <div className="flex items-center gap-2">
                <span className="text-purple-400 font-semibold">Color:</span>
                <span className="text-gray-300">{axisMapping.color}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 3D Viewer */}
      <main className="flex-1 relative">
        <SceneViewer />
      </main>
    </div>
  );
};
