# Widgets 레이어 에이전트 문서

## 1. 레이어 책임
독립적인 UI 블록으로, 여러 페이지에서 재사용 가능한 복합 컴포넌트들입니다. 각 위젯은 특정 기능을 캡슐화하며, 프레젠테이션(ui/)과 비즈니스 로직(model/)을 분리합니다.

---

## 2. 공통 구조

### 아키텍처 패턴
모든 위젯은 FSD 규칙을 따릅니다:
```
widgets/{WidgetName}/
  ├── ui/                    # 프레젠테이션 컴포넌트
  │   ├── {WidgetName}.tsx   # 메인 컴포넌트
  │   └── *.tsx              # 서브 컴포넌트
  └── model/                 # 비즈니스 로직
      └── use{WidgetName}.ts # 커스텀 훅
```

### 공통 의존성
- `shared/ui/*` - 기본 UI 컴포넌트
- `shared/lib/*` - 유틸리티 함수
- `shared/hooks/*` - 공통 커스텀 훅
- `shared/types/*` - 타입 정의
- `shared/zustand/*` - 전역 상태 (필요 시)

### 공통 원칙
- **독립성**: 위젯은 다른 위젯에 의존하지 않음
- **재사용성**: 여러 페이지에서 사용 가능
- **캡슐화**: 내부 상태와 로직을 외부에 노출하지 않음
- **타입 안정성**: Props와 반환값에 명확한 타입 정의

---

## 3. 개별 위젯 상세

### 3.1 FileUploader

#### 책임
드래그 앤 드롭 및 버튼 기반 파일 업로드 인터페이스 제공. 파일 타입(.csv)과 크기(<50MB) 검증, 파일 선택 이벤트 처리, CSV 파싱 트리거.

#### 입출력
**입력**:
- 사용자 드래그 앤 드롭 이벤트
- 버튼 클릭을 통한 파일 선택
- 검증 규칙 (파일 타입, 크기 제한)

**출력**:
- 부모에게 전달된 선택된 파일 객체
- 검증 에러 메시지
- 업로드 상태 표시기 (idle, dragging, uploading, success, error)
- 파싱된 CSV 데이터 트리거

#### 컴포넌트 구조
```typescript
// ui/FileUploader.tsx - 메인 컨테이너
interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  onError: (error: string) => void;
  maxSize?: number; // 기본값: 50MB
  accept?: string;  // 기본값: '.csv'
}

// ui/FileDropZone.tsx - 드래그 앤 드롭 영역
// ui/FileButton.tsx - 대체 파일 선택 버튼

// model/useFileUploader.ts
const useFileUploader = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const validateFile = (file: File): ValidationResult => {
    // 파일 크기 및 타입 검증
  };
  
  const handleDrop = (e: DragEvent) => {
    // 드롭 이벤트 처리
  };
  
  return { isDragging, error, handleDrop, validateFile };
};
```

#### 의존성
- `shared/lib/validation` - 파일 검증 유틸리티
- `shared/lib/csvParser` - CSV 파싱
- `shared/zustand/useDataStore` - 파싱된 데이터 저장
- `react-icons` - 업로드 아이콘
- `clsx` - 조건부 스타일링

#### 구현 체크리스트
- [ ] 파일 크기 검증 (50MB 제한)
- [ ] 파일 타입 검증 (.csv만)
- [ ] 드래그 앤 드롭 인터랙션
- [ ] 에러 메시지 표시
- [ ] 성공 상태 처리
- [ ] 업로드 진행률 표시 (대용량 파일)

#### 구현 예상 시간: **6-8시간**

---

### 3.2 DataPreview

#### 책임
업로드된 CSV 데이터의 테이블 미리보기 표시 (처음 10-20행). 컬럼명, 데이터 타입, 기본 통계 표시. 사용자가 매핑 전 데이터를 확인할 수 있도록 지원.

#### 입출력
**입력**:
- `useDataStore`의 파싱된 CSV 데이터
- 표시할 행 수 (기본값: 10)
- 선택적 강조 표시할 컬럼 (매핑에서)

**출력**:
- 스크롤 가능한 데이터 테이블 뷰
- 데이터 타입이 포함된 컬럼 헤더
- 기본 통계 (개수, 고유값, 숫자형의 경우 min/max)

#### 컴포넌트 구조
```typescript
// ui/DataPreview.tsx
interface DataPreviewProps {
  data: CSVRow[];
  columns: string[];
  rowsToShow?: number;
  highlightedColumns?: string[];
}

// model/useDataPreview.ts
const useDataPreview = (data: CSVRow[], rowsToShow: number) => {
  const slicedData = useMemo(() => data.slice(0, rowsToShow), [data, rowsToShow]);
  
  const calculateStats = (column: string) => {
    // 컬럼별 통계 계산
  };
  
  return { slicedData, calculateStats };
};
```

#### 의존성
- `shared/zustand/useDataStore` - CSV 데이터 읽기
- `shared/lib/math` - 통계 계산
- `shared/ui/Tooltip` - 호버 시 컬럼 통계 표시
- `react-window` 또는 `@tanstack/react-table` - 가상 스크롤링

#### 구현 체크리스트
- [ ] 올바른 행 수 렌더링
- [ ] 모든 컬럼 표시
- [ ] 통계 정확하게 계산
- [ ] 빈 데이터 처리
- [ ] 가상 스크롤링 원활하게 작동
- [ ] 컬럼 정렬 기능 (선택적)

#### 구현 예상 시간: **4-6시간**

---

### 3.3 AxisMapper

#### 책임
CSV 컬럼을 3D 축(X, Y, Z)과 색상 인코딩에 매핑하는 UI 제공. 컬럼 선택용 드롭다운 표시, 선택 검증, 매핑 설정 저장.

#### 입출력
**입력**:
- `useDataStore`의 사용 가능한 컬럼
- `useMappingStore`의 현재 매핑
- 검증용 데이터 타입 정보

**출력**:
- 선택된 축 매핑 (xAxis, yAxis, zAxis)
- 색상 인코딩 컬럼 선택
- 검증 상태
- 업데이트된 `useMappingStore`

#### 컴포넌트 구조
```typescript
// ui/AxisMapper.tsx - 메인 매퍼 컨테이너
interface AxisMapperProps {
  columns: string[];
  dataTypes: Record<string, 'number' | 'string'>;
  onMappingChange: (mapping: AxisMapping) => void;
}

// ui/AxisSelector.tsx - 개별 축 드롭다운
interface AxisSelectorProps {
  label: string;
  options: string[];
  value: string | null;
  onChange: (value: string) => void;
  disabled?: string[]; // 이미 선택된 컬럼
}

// ui/ColorSelector.tsx - 색상 인코딩 셀렉터

// model/useAxisMapper.ts
const useAxisMapper = () => {
  const columns = useDataStore(state => state.columns);
  const dataTypes = useDataStore(state => state.dataTypes);
  const mapping = useMappingStore(state => state);
  
  const numericColumns = useMemo(() => 
    columns.filter(col => dataTypes[col] === 'number'),
    [columns, dataTypes]
  );
  
  const validateMapping = (): boolean => {
    // 중복 없음, 모두 숫자 검증
  };
  
  return { numericColumns, validateMapping };
};
```

#### 의존성
- `shared/zustand/useDataStore` - 컬럼 읽기
- `shared/zustand/useMappingStore` - 매핑 저장
- `shared/lib/validation` - 선택 검증
- `shared/ui/Select` - 드롭다운 컴포넌트
- `@radix-ui/react-menubar` - 접근 가능한 드롭다운
- `lucide-react` - 아이콘

#### 구현 체크리스트
- [ ] 숫자 컬럼 올바르게 필터링
- [ ] 중복 선택 방지
- [ ] 3개 축 모두 선택 검증
- [ ] 스토어에 올바르게 저장
- [ ] 엣지 케이스 처리 (3개 미만 숫자 컬럼)
- [ ] 컬럼 통계를 드롭다운에 표시

#### 구현 예상 시간: **5-7시간**

---

### 3.4 SceneViewer

#### 책임
핵심 3D 시각화 위젯. Three.js/React Three Fiber를 사용하여 산점도 렌더링, 카메라 컨트롤 관리, 축 및 그리드 헬퍼 표시, 성능을 위해 인스턴스드 메시로 포인트 렌더링 처리.

#### 입출력
**입력**:
- 변환된 3D 포인트 클라우드 데이터
- 포인트용 색상 배열
- `useViewerStore`의 카메라 설정
- 시각적 설정 (포인트 크기, 배경색)
- 필터 가시성 플래그

**출력**:
- 캔버스에 렌더링된 인터랙티브 3D 씬
- OrbitControls를 통한 카메라 조작
- 포인트 피킹 이벤트
- 성능 메트릭 (FPS)

#### 컴포넌트 구조
```typescript
// ui/SceneViewer.tsx - Canvas 및 씬 설정
interface SceneViewerProps {
  points: Point3D[];
  colors: string[];
  cameraPosition?: [number, number, number];
  onPointClick?: (point: Point3D) => void;
}

// ui/ScatterPlot.tsx - 인스턴스드 메시로 포인트 클라우드 렌더러
const ScatterPlot = ({ points, colors }: ScatterPlotProps) => {
  const meshRef = useRef<InstancedMesh>();
  
  useEffect(() => {
    // 인스턴스드 메시 업데이트
  }, [points, colors]);
  
  return <instancedMesh ref={meshRef} args={[...]} />;
};

// ui/AxisHelper.tsx - 라벨이 있는 3D 축 선
// ui/GridHelper.tsx - 바닥 그리드

// model/useSceneViewer.ts
const useSceneViewer = () => {
  const viewerSettings = useViewerStore();
  
  const updateCamera = (position: Vector3) => {
    // GSAP 애니메이션으로 카메라 업데이트
  };
  
  return { updateCamera };
};
```

#### 의존성
- `shared/zustand/useViewerStore` - 카메라 및 시각적 설정
- `shared/lib/dataTransform` - 3D 좌표 생성
- `shared/types/viewer.types` - 타입 정의
- `three` ^0.179.1 - 핵심 3D 엔진
- `@react-three/fiber` ^9.3.0 - React 렌더러
- `@react-three/drei` ^10.7.4 - OrbitControls, Stats, Html
- `gsap` ^3.13.0 - 애니메이션
- `leva` ^0.10.0 - 디버그 컨트롤

#### 성능 최적화
- 인스턴스드 메시 사용 (단일 드로우 콜)
- 프러스텀 컬링 구현
- LOD (Level of Detail) 추가
- 색상 업데이트 메모이제이션
- requestAnimationFrame 최적화

#### 구현 체크리스트
- [ ] 포인트 올바르게 렌더링
- [ ] OrbitControls 입력에 반응
- [ ] 50K 포인트에서 60 FPS 유지
- [ ] 색상 업데이트 즉시 반영
- [ ] 필터 변경 시 포인트 표시/숨김
- [ ] 축 및 그리드 올바르게 표시
- [ ] 카메라 애니메이션 부드럽게 작동

#### 구현 예상 시간: **12-16시간**

---

### 3.5 FilterPanel

#### 책임
X, Y, Z 축에 대한 범위 기반 필터링 컨트롤 제공. min/max 범위 슬라이더 표시, 실시간 필터 상태 업데이트, 시각화 업데이트 트리거. 필터 프리셋 및 리셋 지원.

#### 입출력
**입력**:
- `useViewerStore`의 데이터 범위 (xRange, yRange, zRange)
- 현재 필터 값
- 매핑의 축 레이블

**출력**:
- 업데이트된 필터 범위
- 범위 밖 포인트에 대한 가시성 플래그
- 필터 통계 (표시되는 포인트 %)

#### 컴포넌트 구조
```typescript
// ui/FilterPanel.tsx - 접을 수 있는 패널 컨테이너
interface FilterPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

// ui/RangeSlider.tsx - 각 축에 대한 듀얼 핸들 범위 슬라이더
interface RangeSliderProps {
  label: string;
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
}

// model/useFilterPanel.ts
const useFilterPanel = () => {
  const filters = useViewerStore(state => state.filters);
  const setFilter = useViewerStore(state => state.setFilter);
  const rawData = useDataStore(state => state.rawData);
  
  // 디바운스된 필터 업데이트
  const debouncedSetFilter = useDebounce(setFilter, 100);
  
  const calculateVisiblePoints = () => {
    // 필터 내 포인트 수 계산
  };
  
  return { filters, debouncedSetFilter, calculateVisiblePoints };
};
```

#### 의존성
- `shared/zustand/useViewerStore` - 필터 읽기/쓰기
- `shared/ui/Slider` - 범위 슬라이더 컴포넌트
- `shared/hooks/useDebounce` - 슬라이더 업데이트 디바운스
- `lucide-react` - 필터 아이콘
- `@radix-ui/react-slider` - 접근 가능한 범위 슬라이더

#### 구현 체크리스트
- [ ] 슬라이더가 필터 범위 업데이트
- [ ] 디바운싱으로 과도한 업데이트 방지
- [ ] 리셋 버튼으로 전체 범위 복원
- [ ] 통계 올바르게 표시
- [ ] 필터링된 데이터셋과 작동
- [ ] 프리셋 기능 (사분위수, 이상치)

#### 구현 예상 시간: **5-7시간**

---

### 3.6 CustomizationPanel

#### 책임
시각적 커스터마이징을 위한 UI 컨트롤 제공: 포인트 크기, 색상(포인트, 배경), 축 가시성, 그리드 토글, 색상 스킴. 실시간으로 뷰어 설정 업데이트.

#### 입출력
**입력**:
- `useViewerStore`의 현재 설정
- 사용 가능한 색상 스킴

**출력**:
- 업데이트된 포인트 크기
- 배경색
- 포인트 색상/스킴
- 그리드 및 축 가시성 플래그
- `useViewerStore`에 저장된 설정

#### 컴포넌트 구조
```typescript
// ui/CustomizationPanel.tsx
interface CustomizationPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

// 섹션별로 구성:
// - 포인트 설정 (크기, 색상)
// - 배경 설정 (색상, 그라데이션)
// - 그리드/축 토글
// - 테마 프리셋

// model/useCustomizationPanel.ts
const useCustomizationPanel = () => {
  const settings = useViewerStore();
  const updateSettings = useViewerStore(state => state.updateSettings);
  
  const applyPreset = (preset: ThemePreset) => {
    // 프리셋 테마 적용
  };
  
  const resetToDefaults = () => {
    // 기본 설정으로 리셋
  };
  
  return { settings, updateSettings, applyPreset, resetToDefaults };
};
```

#### 의존성
- `shared/zustand/useViewerStore` - 설정 읽기/쓰기
- `shared/ui/ColorPicker` - 색상 선택
- `shared/ui/Slider` - 포인트 크기 컨트롤
- `shared/ui/Toggle` - 그리드/축 토글
- `lucide-react` - 설정 아이콘
- `@radix-ui/react-slot` - 조합 가능한 UI

#### 구현 체크리스트
- [ ] 포인트 크기가 씬 업데이트
- [ ] 배경색 변경
- [ ] 그리드 토글 작동
- [ ] 설정이 스토어에 지속
- [ ] 여러 빠른 변경이 UI 깨지지 않음
- [ ] 프리셋 테마 (다크, 라이트, 색맹 친화적)

#### 구현 예상 시간: **4-6시간**

---

## 4. 위젯 간 통신

### 통신 패턴
위젯은 직접 통신하지 않고 Zustand 스토어를 통해 통신합니다:

```typescript
// SceneViewer는 필터를 읽음
const filters = useViewerStore(state => state.filters);

// FilterPanel은 필터를 씀
const setFilter = useViewerStore(state => state.setFilter);

// CustomizationPanel은 시각적 설정을 씀
const updateSettings = useViewerStore(state => state.updateSettings);
```

### 이벤트 흐름 예시
1. 사용자가 FilterPanel에서 슬라이더 조정
2. `useViewerStore.setFilter()` 호출
3. SceneViewer가 필터 변경 감지 (Zustand 구독)
4. SceneViewer가 포인트 가시성 업데이트
5. UI가 즉시 반영

---

## 5. 통합 테스트 전략

### 위젯 격리 테스트
```typescript
describe('FileUploader', () => {
  it('유효한 CSV 파일 수락', () => {
    const file = new File(['data'], 'test.csv', { type: 'text/csv' });
    const onFileSelect = jest.fn();
    render(<FileUploader onFileSelect={onFileSelect} />);
    
    // 파일 드롭 시뮬레이션
    fireEvent.drop(screen.getByTestId('drop-zone'), { dataTransfer: { files: [file] }});
    expect(onFileSelect).toHaveBeenCalledWith(file);
  });
});
```

### 위젯 조합 테스트
```typescript
describe('ViewerPage 위젯 통합', () => {
  it('FilterPanel 변경이 SceneViewer 업데이트', () => {
    render(<ViewerPageWithWidgets />);
    
    // 필터 조정
    const slider = screen.getByRole('slider', { name: 'X축' });
    fireEvent.change(slider, { target: { value: 50 }});
    
    // SceneViewer가 업데이트되었는지 확인
    expect(screen.getByTestId('visible-points')).toHaveTextContent('50%');
  });
});
```

---

## 6. 성능 고려사항

### 렌더링 최적화
- `React.memo()` 사용하여 불필요한 리렌더링 방지
- `useMemo()`로 비싼 계산 메모이제이션
- `useCallback()`으로 이벤트 핸들러 안정화
- 가상 스크롤링 (DataPreview)
- 디바운싱/쓰로틀링 (FilterPanel)

### SceneViewer 특별 최적화
```typescript
// 인스턴스드 메시로 50K+ 포인트 렌더링
const geometry = useMemo(() => new SphereGeometry(0.01, 8, 8), []);
const material = useMemo(() => new MeshBasicMaterial(), []);

<instancedMesh args={[geometry, material, points.length]}>
  {/* 단일 드로우 콜로 모든 포인트 렌더링 */}
</instancedMesh>
```

---

## 7. 접근성 (A11y)

### WCAG AA 준수
- [ ] 모든 인터랙티브 요소에 키보드 접근 가능
- [ ] ARIA 레이블 및 역할 적절히 사용
- [ ] 색상 대비 비율 4.5:1 이상
- [ ] 스크린 리더 지원
- [ ] 포커스 표시기 명확하게 표시
- [ ] 에러 메시지 명확하고 읽기 쉬움

### Radix UI 활용
Radix UI 프리미티브는 기본적으로 접근 가능하므로 활용:
- `@radix-ui/react-slider` - 슬라이더
- `@radix-ui/react-menubar` - 드롭다운
- 기타 Radix 컴포넌트

---

## 8. 구현 우선순위

### Phase 1: 기본 위젯 (주 2-3)
1. **FileUploader** (6-8시간) - UploadPage 차단 해제
2. **DataPreview** (4-6시간) - UploadPage 완성
3. **AxisMapper** (5-7시간) - MappingPage 차단 해제

### Phase 2: 3D 렌더링 (주 4-5)
4. **SceneViewer** (12-16시간) - ViewerPage 핵심 기능

### Phase 3: 인터랙티비티 (주 6)
5. **FilterPanel** (5-7시간) - 필터링 기능
6. **CustomizationPanel** (4-6시간) - 시각적 제어

---

## 9. 현재 상태 및 차단 요소

### 구현 상태
- **코드 완성**: 0% (구현 안 됨)
- **구조 정의**: 100% (폴더 생성 완료)
- **문서화**: 100% (사양 정의 완료)

### 차단 요소
모든 위젯은 다음에 의존:
- ✅ `shared/ui/*` (기본 UI 컴포넌트)
- ✅ `shared/lib/*` (유틸리티)
- ✅ `shared/hooks/*` (커스텀 훅)
- ✅ `shared/types/*` (타입)
- ✅ `shared/zustand/*` (스토어)

**결론**: Shared 레이어가 먼저 구현되어야 함 (차단 중)

---

## 10. 역추적된 요구사항

### 기능 요구사항
- **REQ-WID-001**: FileUploader는 50MB까지 CSV 파일 처리
- **REQ-WID-002**: DataPreview는 100K+ 행 테이블 가상 스크롤링
- **REQ-WID-003**: AxisMapper는 중복 방지 및 숫자 검증
- **REQ-WID-004**: SceneViewer는 50K 포인트에서 60 FPS 유지
- **REQ-WID-005**: FilterPanel은 100ms 내 필터 업데이트
- **REQ-WID-006**: CustomizationPanel은 실시간 설정 변경

### 비기능 요구사항
- **REQ-WID-NFR-001**: 모든 위젯 WCAG AA 준수
- **REQ-WID-NFR-002**: 위젯은 독립적이고 재사용 가능
- **REQ-WID-NFR-003**: Props 및 반환값에 대한 타입 안정성 100%

---

## 11. 다음 액션 아이템

### 즉시 (이번 주)
- [ ] `shared/ui/` 기본 컴포넌트 구현
- [ ] `shared/lib/validation` 구현
- [ ] `shared/lib/csvParser` 구현

### 단기 (다음 2주)
- [ ] FileUploader 구현 시작
- [ ] DataPreview 구현
- [ ] AxisMapper 구현

### 중기 (주 4-6)
- [ ] SceneViewer 구현 (최우선)
- [ ] FilterPanel 구현
- [ ] CustomizationPanel 구현

---

**문서 최종 업데이트**: 2025-11-27  
**구현 상태**: 0% (계획 단계)  
**예상 총 소요 시간**: 36-50시간 (전체 Widgets 레이어)
