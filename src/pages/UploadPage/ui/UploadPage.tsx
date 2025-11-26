/**
 * UploadPage - File upload page
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUploader } from '../../../widgets/FileUploader/ui/FileUploader';
import { CSVTutorial } from '../../../widgets/CSVTutorial/ui/CSVTutorial';
import { parseCSVFile } from '../../../shared/lib/csvParser';
import { useDataStore } from '../../../shared/zustand';

export const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { setData } = useDataStore();

  const handleLoadSampleData = async () => {
    try {
      const response = await fetch('/sample-data.csv');
      const text = await response.text();
      const blob = new Blob([text], { type: 'text/csv' });
      const file = new File([blob], 'sample-data.csv', { type: 'text/csv' });

      const result = await parseCSVFile(file);
      if (result.success && result.data) {
        setData(result.data, 'sample-data.csv');
        navigate('/mapping');
      }
    } catch (error) {
      console.error('Failed to load sample data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            3D Data Scope
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Analyze CSV data with 3D visualization
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl">
          {/* Progress steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <span className="ml-2 text-sm font-medium text-blue-600">
                  Upload
                </span>
              </div>
              <div className="w-16 h-1 bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <span className="ml-2 text-sm font-medium text-gray-500">
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

          {/* 파일 업로더 */}
          <div className="flex flex-col items-center">
            <FileUploader />

            {/* Sample data button */}
            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={handleLoadSampleData}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg font-medium flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Try with Sample Data
              </button>

              {/* CSV 가이드 링크 */}
              <CSVTutorial />
            </div>
          </div>

          {/* Feature introduction */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Easy Upload
              </h3>
              <p className="text-sm text-gray-600">
                Drag or click to upload CSV files easily.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                3D Visualization
              </h3>
              <p className="text-sm text-gray-600">
                Visualize data as 3D scatter plots to discover patterns.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Interactive Analysis
              </h3>
              <p className="text-sm text-gray-600">
                Explore data freely through filtering, rotation, and zoom.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
