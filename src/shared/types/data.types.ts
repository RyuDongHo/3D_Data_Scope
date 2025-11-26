/**
 * CSV 데이터 관련 타입 정의
 */

export type DataType = 'number' | 'string' | 'date' | 'boolean';

export interface ColumnInfo {
  name: string;
  type: DataType;
  minValue?: number;
  maxValue?: number;
  uniqueCount?: number;
  sampleValues?: any[];
}

export interface CSVData {
  rows: Record<string, any>[];
  columns: ColumnInfo[];
  rowCount: number;
}

export interface DataStatistics {
  mean?: number;
  median?: number;
  stdDev?: number;
  min?: number;
  max?: number;
  q1?: number;
  q3?: number;
}

export interface OutlierResult {
  indices: number[];
  method: 'iqr' | 'zscore';
  threshold?: number;
}

export interface ClusterResult {
  labels: number[];
  centroids?: number[][];
  method: 'kmeans' | 'dbscan';
  k?: number;
  eps?: number;
  minSamples?: number;
}
