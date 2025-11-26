/**
 * CSV 파일 파싱 유틸리티
 * PapaParse 라이브러리를 사용한 CSV 파싱
 */

import Papa from 'papaparse';
import type { CSVData, ColumnInfo, DataType } from '../types';

interface ParseResult {
  success: boolean;
  data?: CSVData;
  error?: string;
}

/**
 * CSV 파일을 파싱하여 구조화된 데이터로 변환
 */
export const parseCSVFile = async (file: File): Promise<ParseResult> => {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          if (results.errors.length > 0) {
            const errorMsg = results.errors
              .map((e) => e.message)
              .join(', ');
            resolve({ success: false, error: `파싱 오류: ${errorMsg}` });
            return;
          }

          const rows = results.data as Record<string, any>[];
          
          if (rows.length === 0) {
            resolve({ success: false, error: '데이터가 비어있습니다.' });
            return;
          }

          const columns = inferColumnTypes(rows);

          const csvData: CSVData = {
            rows,
            columns,
            rowCount: rows.length,
          };

          resolve({ success: true, data: csvData });
        } catch (error) {
          resolve({
            success: false,
            error: `처리 중 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
          });
        }
      },
      error: (error) => {
        resolve({ success: false, error: `파일 읽기 오류: ${error.message}` });
      },
    });
  });
};

/**
 * 컬럼 타입 자동 추론
 */
const inferColumnTypes = (rows: Record<string, any>[]): ColumnInfo[] => {
  if (rows.length === 0) return [];

  const columnNames = Object.keys(rows[0]);
  const sampleSize = Math.min(100, rows.length);

  return columnNames.map((name) => {
    const samples = rows.slice(0, sampleSize).map((row) => row[name]);
    const type = inferDataType(samples);

    const info: ColumnInfo = {
      name,
      type,
      sampleValues: samples.slice(0, 5),
    };

    if (type === 'number') {
      const numericValues = rows
        .map((row) => row[name])
        .filter((val) => typeof val === 'number' && !isNaN(val));

      if (numericValues.length > 0) {
        info.minValue = Math.min(...numericValues);
        info.maxValue = Math.max(...numericValues);
      }
    }

    // 고유값 개수 계산
    const uniqueValues = new Set(rows.map((row) => row[name]));
    info.uniqueCount = uniqueValues.size;

    return info;
  });
};

/**
 * 데이터 타입 추론
 */
const inferDataType = (values: any[]): DataType => {
  const validValues = values.filter((v) => v !== null && v !== undefined && v !== '');

  if (validValues.length === 0) return 'string';

  // 숫자 타입 체크
  const numericCount = validValues.filter(
    (v) => typeof v === 'number' || (!isNaN(Number(v)) && v !== '')
  ).length;

  if (numericCount / validValues.length > 0.8) return 'number';

  // 날짜 타입 체크 (간단한 버전)
  const dateCount = validValues.filter((v) => {
    const date = new Date(v);
    return !isNaN(date.getTime());
  }).length;

  if (dateCount / validValues.length > 0.8) return 'date';

  // 불리언 타입 체크
  const booleanCount = validValues.filter(
    (v) =>
      v === true ||
      v === false ||
      v === 'true' ||
      v === 'false' ||
      v === 'TRUE' ||
      v === 'FALSE'
  ).length;

  if (booleanCount / validValues.length > 0.8) return 'boolean';

  return 'string';
};

/**
 * CSV 데이터에서 숫자형 컬럼만 필터링
 */
export const getNumericColumns = (columns: ColumnInfo[]): ColumnInfo[] => {
  return columns.filter((col) => col.type === 'number');
};

/**
 * CSV 데이터 검증
 */
export const validateCSVData = (data: CSVData): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (data.rowCount === 0) {
    errors.push('데이터가 비어있습니다.');
  }

  if (data.columns.length === 0) {
    errors.push('컬럼이 없습니다.');
  }

  const numericColumns = getNumericColumns(data.columns);
  if (numericColumns.length < 3) {
    errors.push('최소 3개의 숫자형 컬럼이 필요합니다.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
