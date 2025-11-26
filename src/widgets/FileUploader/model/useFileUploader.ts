/**
 * FileUploader 위젯 로직
 */

import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../../../shared/zustand';
import { parseCSVFile, validateFile } from '../../../shared/lib';

export const useFileUploader = () => {
  const navigate = useNavigate();
  const { setData, setLoading, setError } = useDataStore();
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      // 파일 검증
      const validation = validateFile(file);
      if (!validation.valid) {
        setError(validation.error!);
        return;
      }

      // 파싱 시작
      setLoading(true);
      setError(null);

      try {
        const result = await parseCSVFile(file);

        if (!result.success || !result.data) {
          setError(result.error || '파일 파싱에 실패했습니다.');
          setLoading(false);
          return;
        }

        // 데이터 저장
        setData(result.data, file.name);

        // 매핑 페이지로 이동
        navigate('/mapping');
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : '알 수 없는 오류가 발생했습니다.'
        );
        setLoading(false);
      }
    },
    [setData, setLoading, setError, navigate]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  return {
    isDragging,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileInput,
  };
};
