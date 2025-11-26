/**
 * AxisMapper Widget UI
 * Axis mapping selection interface
 */

import React from 'react';
import { useAxisMapper } from '../model/useAxisMapper';
import { useDataStore } from '../../../shared/zustand';
import { Button } from '../../../shared/ui';
// import type { ColumnInfo } from '../../../shared/types'; // Currently unused

export const AxisMapper: React.FC = () => {
  const { rawData } = useDataStore();
  const {
    numericColumns,
    allColumns,
    axisMapping,
    validationError,
    handleAxisChange,
    handleColorChange,
    validateAndProceed,
  } = useAxisMapper();

  const renderColumnSelector = (
    label: string,
    axis: 'x' | 'y' | 'z',
    color: string
  ) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border-2 border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}
        >
          <span className="text-white font-bold text-xl">{label}</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{label}축</h3>
          <p className="text-sm text-gray-500">숫자형 컬럼 선택</p>
        </div>
      </div>

      <select
        value={axisMapping[axis] || ''}
        onChange={(e) => handleAxisChange(axis, e.target.value)}
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
      >
        <option value="">컬럼 선택...</option>
        {numericColumns.map((col) => (
          <option key={col.name} value={col.name}>
            {col.name}
            {col.minValue !== undefined &&
              ` (${col.minValue.toFixed(2)} ~ ${col.maxValue!.toFixed(2)})`}
          </option>
        ))}
      </select>

      {axisMapping[axis] && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            {
              numericColumns.find((c) => c.name === axisMapping[axis])
                ?.uniqueCount
            }{' '}
            개의 고유값
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-4xl space-y-8">
      {/* 데이터 정보 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-blue-900">
              데이터 요약
            </h4>
            <p className="text-sm text-blue-800 mt-1">
              총 {rawData?.rowCount.toLocaleString()}행, {numericColumns.length}
              개의 숫자형 컬럼
            </p>
          </div>
        </div>
      </div>

      {/* Axis selection */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Axis Mapping</h2>
        <p className="text-gray-600">
          Select axes to display in 3D space. Each axis must be a different numeric column.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {renderColumnSelector('X', 'x', 'bg-red-500')}
          {renderColumnSelector('Y', 'y', 'bg-green-500')}
          {renderColumnSelector('Z', 'z', 'bg-blue-500')}
        </div>
      </div>

      {/* 색상 매핑 (선택사항) */}
      <div className="bg-white rounded-lg p-6 shadow-sm border-2 border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Color Encoding (Optional)
            </h3>
            <p className="text-sm text-gray-500">
              Select column to differentiate points
            </p>
          </div>
        </div>

        <select
          value={axisMapping.color || ''}
          onChange={(e) => handleColorChange(e.target.value || null)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
        >
          <option value="">No color (single color)</option>
          {allColumns.map((col) => (
            <option key={col.name} value={col.name}>
              {col.name} ({col.type})
            </option>
          ))}
        </select>
      </div>

      {/* 검증 오류 */}
      {validationError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-red-700">{validationError}</p>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="flex-1"
        >
          ← Previous
        </Button>
        <Button
          variant="primary"
          onClick={validateAndProceed}
          className="flex-1"
          disabled={!axisMapping.x || !axisMapping.y || !axisMapping.z}
        >
          Next: Visualization →
        </Button>
      </div>
    </div>
  );
};
