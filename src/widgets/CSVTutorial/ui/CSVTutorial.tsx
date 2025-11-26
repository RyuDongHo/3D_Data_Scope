/**
 * CSV Tutorial Component
 * Guides users on correct CSV format
 */

import React, { useState } from 'react';
import { Modal } from '../../../shared/ui';

export const CSVTutorial: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
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
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        CSV Format Guide
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="CSV Data Format Guide"
        size="lg"
      >
        <div className="space-y-6">
          {/* Basic requirements */}
          <section>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              📋 Basic Requirements
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>At least <strong>3 numeric columns</strong> are required (X, Y, Z axes)</li>
              <li>Maximum file size is <strong>50MB</strong></li>
              <li>UTF-8 encoding is recommended</li>
            </ul>
          </section>

          {/* Correct format example */}
          <section>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              ✅ Correct Format Example
            </h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <pre className="text-sm font-mono text-gray-800 overflow-x-auto">
{`Name,Age,Height,Weight,Grade
John,25,175.5,70.2,A
Jane,30,162.3,55.8,B
Mike,28,180.1,75.5,A
Sarah,26,168.0,60.1,B`}
              </pre>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              👆 In this example, Age, Height, and Weight can be used as X/Y/Z axes.
            </p>
          </section>

          {/* Formats to avoid */}
          <section>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              ❌ Formats to Avoid
            </h3>
            <div className="space-y-3">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-red-800 mb-2">
                  Insufficient Numeric Columns
                </p>
                <pre className="text-sm font-mono text-gray-800">
{`Name,City
John,Seoul
Jane,Busan`}
                </pre>
                <p className="text-xs text-red-600 mt-1">
                  ⚠️ At least 3 numeric columns are required
                </p>
              </div>
            </div>
          </section>

          {/* Recommendations */}
          <section>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              💡 Recommendations
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                <li>Keep column names short and clear</li>
                <li>Do not include commas (,) or special characters in numeric data</li>
                <li>Avoid empty cells or fill them with 0</li>
                <li>Date format YYYY-MM-DD is recommended</li>
                <li>For optimal performance, 100,000 rows or less is recommended</li>
              </ul>
            </div>
          </section>

          {/* Sample data download */}
          <section>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              📥 Sample Data
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Download a sample CSV file for testing.
            </p>
            <button
              onClick={() => {
                const sampleCSV = `x,y,z,category,value
1.5,2.3,3.1,A,10
2.1,1.8,2.9,B,15
3.2,3.5,1.2,A,20
1.8,2.9,3.5,C,12
2.5,1.5,2.8,B,18
3.0,3.2,1.8,A,22
1.2,2.5,3.8,C,14
2.8,1.2,2.5,B,16
3.5,3.0,1.5,A,25
1.0,2.8,3.2,C,11`;

                const blob = new Blob([sampleCSV], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'sample_data.csv';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Download Sample CSV
            </button>
          </section>
        </div>
      </Modal>
    </>
  );
};
