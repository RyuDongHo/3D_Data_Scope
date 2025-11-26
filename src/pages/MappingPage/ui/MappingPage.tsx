/**
 * MappingPage - Data mapping page
 */

import React from 'react';
import { AxisMapper } from '../../../widgets/AxisMapper/ui/AxisMapper';

export const MappingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            3D Data Scope
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Map data to 3D space
          </p>
        </div>
      </header>

      {/* Progress steps */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">
                Upload
              </span>
            </div>
            <div className="w-16 h-1 bg-blue-600"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">
                Mapping
              </span>
            </div>
            <div className="w-16 h-1 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">
                Visualization
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 px-4 py-12">
        <div className="max-w-7xl mx-auto flex justify-center">
          <AxisMapper />
        </div>
      </main>
    </div>
  );
};
