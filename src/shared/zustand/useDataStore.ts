/**
 * 데이터 저장소
 * CSV 데이터와 관련된 전역 상태 관리
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { CSVData } from '../types';

interface DataState {
  // 상태
  rawData: CSVData | null;
  fileName: string | null;
  isLoading: boolean;
  error: string | null;

  // 액션
  setData: (data: CSVData, fileName: string) => void;
  clearData: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDataStore = create<DataState>()(
  devtools(
    (set) => ({
      // 초기 상태
      rawData: null,
      fileName: null,
      isLoading: false,
      error: null,

      // 액션 구현
      setData: (data, fileName) =>
        set({ rawData: data, fileName, error: null, isLoading: false }),

      clearData: () =>
        set({ rawData: null, fileName: null, error: null, isLoading: false }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error, isLoading: false }),
    }),
    { name: 'DataStore' }
  )
);
