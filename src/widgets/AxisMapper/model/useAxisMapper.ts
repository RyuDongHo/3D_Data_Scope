/**
 * AxisMapper 위젯 로직
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataStore, useMappingStore } from '../../../shared/zustand';
import { getNumericColumns } from '../../../shared/lib';
import type { ColumnInfo } from '../../../shared/types';

export const useAxisMapper = () => {
  const navigate = useNavigate();
  const { rawData } = useDataStore();
  const { axisMapping, setAxisMapping, setColorMapping } = useMappingStore();
  const [numericColumns, setNumericColumns] = useState<ColumnInfo[]>([]);
  const [allColumns, setAllColumns] = useState<ColumnInfo[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!rawData) {
      navigate('/upload');
      return;
    }

    const numeric = getNumericColumns(rawData.columns);
    setNumericColumns(numeric);
    setAllColumns(rawData.columns);

    // 자동 제안: 처음 3개의 숫자형 컬럼을 X, Y, Z로 설정
    if (numeric.length >= 3 && !axisMapping.x && !axisMapping.y && !axisMapping.z) {
      setAxisMapping('x', numeric[0].name);
      setAxisMapping('y', numeric[1].name);
      setAxisMapping('z', numeric[2].name);
    }
  }, [rawData, navigate, axisMapping, setAxisMapping]);

  const handleAxisChange = (axis: 'x' | 'y' | 'z', column: string) => {
    setAxisMapping(axis, column);
    setValidationError(null);
  };

  const handleColorChange = (column: string | null) => {
    setColorMapping(column);
  };

  const validateAndProceed = () => {
    if (!axisMapping.x || !axisMapping.y || !axisMapping.z) {
      setValidationError('X, Y, Z 축을 모두 선택해야 합니다.');
      return;
    }

    // 중복 체크
    const axes = [axisMapping.x, axisMapping.y, axisMapping.z];
    const uniqueAxes = new Set(axes);
    if (uniqueAxes.size !== 3) {
      setValidationError('각 축은 서로 다른 컬럼을 선택해야 합니다.');
      return;
    }

    // 뷰어로 이동
    navigate('/viewer');
  };

  return {
    numericColumns,
    allColumns,
    axisMapping,
    validationError,
    handleAxisChange,
    handleColorChange,
    validateAndProceed,
  };
};
