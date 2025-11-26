/**
 * 파일 및 데이터 검증 유틸리티
 */

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_EXTENSIONS = ['.csv', '.txt'];

interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * 파일 검증
 */
export const validateFile = (file: File): ValidationResult => {
  // 파일 크기 체크
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `파일 크기는 ${MAX_FILE_SIZE / 1024 / 1024}MB를 초과할 수 없습니다. (현재: ${(file.size / 1024 / 1024).toFixed(2)}MB)`,
    };
  }

  // 파일 확장자 체크
  const fileName = file.name.toLowerCase();
  const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) =>
    fileName.endsWith(ext)
  );

  if (!hasValidExtension) {
    return {
      valid: false,
      error: `지원되는 파일 형식이 아닙니다. (허용: ${ALLOWED_EXTENSIONS.join(', ')})`,
    };
  }

  // MIME 타입 체크 (선택적)
  if (file.type && !file.type.includes('text') && !file.type.includes('csv')) {
    return {
      valid: false,
      error: '올바른 CSV 파일이 아닙니다.',
    };
  }

  return { valid: true };
};

/**
 * 컬럼명 검증
 */
export const validateColumnName = (columnName: string): ValidationResult => {
  if (!columnName || columnName.trim() === '') {
    return { valid: false, error: '컬럼명이 비어있습니다.' };
  }

  if (columnName.length > 100) {
    return { valid: false, error: '컬럼명이 너무 깁니다. (최대 100자)' };
  }

  return { valid: true };
};

/**
 * 숫자 범위 검증
 */
export const validateNumericRange = (
  min: number,
  max: number
): ValidationResult => {
  if (isNaN(min) || isNaN(max)) {
    return { valid: false, error: '유효한 숫자가 아닙니다.' };
  }

  if (min > max) {
    return { valid: false, error: '최소값이 최대값보다 큽니다.' };
  }

  if (!isFinite(min) || !isFinite(max)) {
    return { valid: false, error: '무한대 값은 사용할 수 없습니다.' };
  }

  return { valid: true };
};

/**
 * 브라우저 WebGL 지원 체크
 */
export const checkWebGLSupport = (): ValidationResult => {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!gl) {
      return {
        valid: false,
        error: '브라우저가 WebGL을 지원하지 않습니다. 3D 시각화를 사용할 수 없습니다.',
      };
    }

    return { valid: true };
  } catch (e) {
    return {
      valid: false,
      error: 'WebGL 확인 중 오류가 발생했습니다.',
    };
  }
};

/**
 * 파일 크기를 읽기 쉬운 형식으로 변환
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};
