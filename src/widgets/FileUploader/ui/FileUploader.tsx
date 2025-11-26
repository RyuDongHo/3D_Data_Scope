/**
 * FileUploader Widget UI
 * File drag and drop and selection functionality
 */

import React, { useRef } from 'react';
import { useFileUploader } from '../model/useFileUploader';
import { useDataStore } from '../../../shared/zustand';
import { Spinner } from '../../../shared/ui';

export const FileUploader: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isLoading, error } = useDataStore();
  const {
    isDragging,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileInput,
  } = useFileUploader();

  return (
    <div className="w-full max-w-2xl">
      {/* 드롭 존 */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-4 border-dashed rounded-xl p-12 text-center transition-all
          ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-white hover:border-gray-400'
          }
          ${isLoading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <Spinner size="lg" />
            <p className="text-gray-600">Processing file...</p>
          </div>
        ) : (
          <>
            {/* 아이콘 */}
            <div className="mb-4">
              <svg
                className="w-20 h-20 mx-auto text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>

            {/* Instruction text */}
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              Drag CSV file to upload
            </h3>
            <p className="text-gray-500 mb-6">
              Or click to select a file
            </p>

            {/* File selection button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Select File
            </button>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt"
              onChange={handleFileInput}
              className="hidden"
            />

            {/* Restrictions notice */}
            <div className="mt-6 text-sm text-gray-500">
              <p>Supported formats: CSV, TXT</p>
              <p>Maximum file size: 50MB</p>
            </div>
          </>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
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
            <div>
              <h4 className="text-sm font-semibold text-red-800">
                Upload Error
              </h4>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
