# 3D Data Scope - 프로젝트 아키텍처 및 개발 가이드

> **생성일**: 2025-11-27  
> **최종 업데이트**: 2025-11-27  
> **구현 상태**: Phase 2 진행 중 (40% 완료)  
> **아키텍처**: Feature-Sliced Design (FSD)

---

## 📌 프로젝트 개요

**3D Data Scope**는 CSV 데이터를 업로드하여 실시간으로 3D 공간에서 시각화하고 탐색할 수 있는 웹 기반 데이터 분석 플랫폼입니다. 다차원 데이터를 이해하기 위한 직관적인 공간 표현을 제공하여 사용자가 다음을 수행할 수 있습니다:

### 핵심 기능
1. **업로드**: 드래그 앤 드롭 또는 파일 선택을 통한 CSV 파일 업로드 (최대 50MB)
2. **매핑**: 3개의 숫자 컬럼을 X, Y, Z 축에 매핑 (선택적 색상 인코딩)
3. **탐색**: 카메라 컨트롤, 필터링, 통계 분석을 통한 실시간 3D 공간 탐색
4. **분석**: 이상치 탐지 및 클러스터링 알고리즘을 통한 패턴 분석
5. **커스터마이징**: 시각화 외관 (색상, 포인트 크기, 배경) 사용자 정의

### 대상 사용자
데이터 분석가, 연구원, 표 형식 데이터로 작업하며 공간 관계를 발견하고 클러스터를 식별하며 3D 시각화를 통해 이상 징후를 감지해야 하는 모든 사람.

**현재 상태**: 프로젝트 구조가 완전히 구현되었으며, 업로드 → 매핑 → 시각화 파이프라인이 작동 중입니다. MVP 기능 완료.

---

## 🏗️ 아키텍처 구조

### FSD (Feature-Sliced Design) 아키텍처

이 프로젝트는 **FSD 아키텍처**를 채용하여 계층적으로 구성됩니다.

```
src/
├── app/              # 앱 초기화, 글로벌 설정, 라우터
├── pages/            # 페이지 단위 컴포넌트
├── widgets/          # 독립적인 UI 블록 (여러 features 조합)
├── features/         # 사용자 시나리오 기능 (업로드, 필터링 등)
└── shared/           # 재사용 가능한 공통 모듈
    ├── ui/           # 공통 UI 컴포넌트
    ├── lib/          # 유틸리티 함수, 헬퍼
    ├── api/          # API 통신 (현재는 로컬 파일 처리)
    ├── hooks/        # 범용 커스텀 훅
    ├── types/        # TypeScript 타입 정의
    └── zustand/      # 전역 상태 관리 스토어
```

#### Layer 규칙
1. **App** → **Pages** → **Widgets** → **Features** → **Shared** 순서로 의존성 흐름
2. 상위 레이어는 하위 레이어를 import 가능, 역방향은 불가
3. 같은 레벨의 레이어끼리는 import 금지

---

## 🔧 기술 스택

### 주요 라이브러리

#### 라우팅 & 상태관리
- **React Router DOM**: 페이지 라우팅 및 내비게이션
- **Zustand**: 전역 상태 관리

#### 3D 렌더링
- **Three.js**: WebGL 기반 3D 렌더링 엔진
- **R3F (React Three Fiber)**: Three.js의 React 래퍼
- **Drei**: R3F를 위한 유용한 헬퍼 컴포넌트 모음
- **Leva**: 실시간 GUI 컨트롤 패널 (디버깅 및 파라미터 조정)

#### 애니메이션
- **GSAP**: 고급 애니메이션 및 타임라인 관리

#### 데이터 처리
- **PapaParse**: CSV 파일 파싱
- **D3.js**: 색상 스킴, 통계 계산

#### UI
- **Tailwind CSS**: 유틸리티 기반 스타일링

### 추가 가능 라이브러리
프로젝트 진행 중 필요에 따라 다른 패키지 추가 가능성을 열어둠

---

## 🎯 디렉토리 구조 (FSD 기반)

### App Layer
```
app/
├── providers/        # Context Providers, Router
└── App.tsx          # 앱 엔트리 포인트
```

**역할**: 애플리케이션 초기화, 라우터 설정

---

### Pages Layer
```
pages/
├── UploadPage/
│   ├── ui/
│   │   └── UploadPage.tsx      # 파일 업로드 페이지
│   └── model/
│       └── useUploadPage.ts    # 페이지 로직
├── MappingPage/
│   ├── ui/
│   │   └── MappingPage.tsx     # 데이터 매핑 설정 페이지
│   └── model/
│       └── useMappingPage.ts   # 페이지 로직
└── ViewerPage/
    ├── ui/
    │   └── ViewerPage.tsx      # 3D 뷰어 페이지
    └── model/
        └── useViewerPage.ts    # 페이지 로직
```

**역할**: 라우트별 페이지 컴포넌트, 페이지 레벨 상태 및 로직

---

### Widgets Layer
```
widgets/
├── FileUploader/
│   ├── ui/
│   │   ├── FileUploader.tsx
│   │   ├── FileDropZone.tsx
│   │   └── FileButton.tsx
│   └── model/
│       └── useFileUploader.ts
├── DataPreview/
│   ├── ui/
│   │   └── DataPreview.tsx
│   └── model/
│       └── useDataPreview.ts
├── AxisMapper/
│   ├── ui/
│   │   ├── AxisMapper.tsx
│   │   ├── AxisSelector.tsx
│   │   └── ColorSelector.tsx
│   └── model/
│       └── useAxisMapper.ts
├── SceneViewer/
│   ├── ui/
│   │   ├── SceneViewer.tsx
│   │   ├── ScatterPlot.tsx
│   │   ├── AxisHelper.tsx
│   │   └── GridHelper.tsx
│   └── model/
│       └── useSceneViewer.ts
├── FilterPanel/
│   ├── ui/
│   │   ├── FilterPanel.tsx
│   │   └── RangeSlider.tsx
│   └── model/
│       └── useFilterPanel.ts
└── CustomizationPanel/
    ├── ui/
    │   └── CustomizationPanel.tsx
    └── model/
        └── useCustomizationPanel.ts
```

**역할**: 독립적인 UI 블록, 복잡한 기능을 가진 복합 컴포넌트

---

### Shared Layer
```
shared/
├── ui/
│   ├── Button/
│   │   └── Button.tsx
│   ├── Slider/
│   │   └── Slider.tsx
│   ├── ColorPicker/
│   │   └── ColorPicker.tsx
│   ├── Tooltip/
│   │   └── Tooltip.tsx
│   ├── Modal/
│   │   └── Modal.tsx
│   └── Spinner/
│       └── Spinner.tsx
├── lib/
│   ├── validation.ts       # 파일 검증, 데이터 검증
│   ├── csvParser.ts        # CSV 파싱 로직
│   ├── dataTransform.ts    # 데이터 변환 유틸
│   ├── math.ts             # 수학 계산 (통계, 거리 등)
│   ├── outlierDetector.ts  # 이상치 탐지 알고리즘
│   └── clustering.ts       # 클러스터링 알고리즘
├── hooks/
│   ├── useDebounce.ts
│   ├── useThrottle.ts
│   └── useLocalStorage.ts
├── types/
│   ├── data.types.ts      # CSV 데이터 관련 타입
│   ├── mapping.types.ts   # 매핑 설정 타입
│   └── viewer.types.ts    # 3D 뷰어 관련 타입
└── zustand/
    ├── useDataStore.ts    # CSV 데이터 상태
    ├── useMappingStore.ts # 매핑 설정 상태
    ├── useViewerStore.ts  # 3D 뷰어 상태
    └── useUIStore.ts      # UI 상태 (모달, 패널 등)
```

**역할**: 프로젝트 전역에서 재사용 가능한 모듈

---

## 🧩 커스텀 훅 분리 패턴

### 원칙
1. **각 레이어의 슬라이스는 `ui/`와 `model/` 세그먼트로 분리**
   - `ui/`: 프레젠테이션 컴포넌트 (JSX, 마크업)
   - `model/`: 비즈니스 로직, 커스텀 훅

2. **재사용 가능한 로직은 Shared로 이동**
   - 범용적이고 도메인에 독립적인 로직 → `shared/hooks/` 또는 `shared/lib/`
   - 특정 feature에 종속된 로직 → 해당 feature의 `model/`

### 예시

#### ❌ Before (로직이 컴포넌트 내에 혼재)
```tsx
// widgets/FileUploader/ui/FileDropZone.tsx
export const FileDropZone = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0];
    if (!file) return;
    
    if (file.size > 50 * 1024 * 1024) {
      setError('파일 크기는 50MB를 초과할 수 없습니다.');
      return;
    }
    // ... 기타 로직
  };

  return (
    <div onDrop={handleDrop}>
      {/* UI */}
    </div>
  );
};
```

#### ✅ After (로직을 model로 분리)
```tsx
// widgets/FileUploader/model/useFileUploader.ts
export const useFileUploader = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setData = useDataStore(state => state.setData);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0];
    if (!file) return;
    
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }
    
    parseFile(file).then(setData);
  }, [setData]);

  return { isDragging, setIsDragging, error, handleDrop };
};

// widgets/FileUploader/ui/FileDropZone.tsx
export const FileDropZone = () => {
  const { isDragging, setIsDragging, error, handleDrop } = useFileUploader();

  return (
    <div onDrop={handleDrop}>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {/* UI */}
    </div>
  );
};
```

---

## 📦 전역 상태 관리 (Zustand)

### 구조
모든 전역 상태는 `shared/zustand/` 디렉토리에 store 파일로 관리됩니다.

### Store 종류

#### 1. useDataStore.ts
```typescript
interface DataState {
  rawData: any[] | null;         // 파싱된 원본 CSV 데이터
  columns: string[];             // 컬럼명 목록
  dataTypes: Record<string, 'number' | 'string'>; // 컬럼별 데이터 타입
  setData: (data: any[], columns: string[]) => void;
  clearData: () => void;
}
```

#### 2. useMappingStore.ts
```typescript
interface MappingState {
  xAxis: string | null;          // X축에 매핑된 컬럼
  yAxis: string | null;          // Y축에 매핑된 컬럼
  zAxis: string | null;          // Z축에 매핑된 컬럼
  colorBy: string | null;        // 색상 매핑 컬럼
  setAxis: (axis: 'x' | 'y' | 'z', column: string) => void;
  setColorBy: (column: string | null) => void;
  resetMapping: () => void;
}
```

#### 3. useViewerStore.ts
```typescript
interface ViewerState {
  cameraPosition: [number, number, number];
  pointSize: number;             // 포인트 크기
  backgroundColor: string;       // 배경색
  pointColor: string;            // 기본 포인트 색상
  showGrid: boolean;             // 그리드 표시 여부
  showAxes: boolean;             // 축 표시 여부
  filters: {
    xRange: [number, number];
    yRange: [number, number];
    zRange: [number, number];
  };
  setPointSize: (size: number) => void;
  setBackgroundColor: (color: string) => void;
  setFilter: (axis: 'x' | 'y' | 'z', range: [number, number]) => void;
  resetView: () => void;
}
```

#### 4. useUIStore.ts
```typescript
interface UIState {
  isFilterPanelOpen: boolean;
  isCustomizationPanelOpen: boolean;
  activeModal: string | null;
  toggleFilterPanel: () => void;
  toggleCustomizationPanel: () => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
}
```

### 사용 예시
```typescript
// 컴포넌트에서 사용
import { useDataStore } from '@/shared/zustand/useDataStore';
import { useMappingStore } from '@/shared/zustand/useMappingStore';

const MyComponent = () => {
  const rawData = useDataStore(state => state.rawData);
  const setAxis = useMappingStore(state => state.setAxis);
  
  // ...
};
```

---

## 🎨 스타일링 가이드

### Tailwind CSS 사용
- 모든 스타일링은 Tailwind 유틸리티 클래스 우선
- 복잡한 스타일은 컴포넌트 수준에서 `@apply` 사용 가능

### 색상 팔레트
```css
/* 다크 모드 기본 */
--background: #1a1a2e;
--surface: #16213e;
--primary: #3498db;
--secondary: #2ecc71;
--accent: #e74c3c;
--text: #ffffff;
--text-secondary: #b0b0b0;

/* 라이트 모드 */
--background-light: #ffffff;
--surface-light: #f5f5f5;
--text-light: #333333;
```

---

---

## 📋 구현 상태 및 요구사항

### 기능 요구사항 (Functional Requirements)
- **FR-01**: 최대 50MB CSV 파일 업로드 지원
- **FR-02**: 드래그 앤 드롭 파일 선택
- **FR-03**: CSV 파싱 및 컬럼 타입 자동 추론
- **FR-04**: 3개의 숫자형 컬럼을 X/Y/Z 축에 매핑
- **FR-05**: 선택적 4번째 컬럼으로 색상 인코딩
- **FR-06**: 실시간 3D 산점도 렌더링
- **FR-07**: 인터랙티브 카메라 컨트롤 (회전, 줌, 패닝)
- **FR-08**: 각 축별 범위 기반 필터링
- **FR-09**: 이상치 탐지 (IQR, Z-score 방법)
- **FR-10**: 클러스터링 (K-means, DBSCAN)
- **FR-11**: 시각적 커스터마이징 (색상, 크기, 그리드, 축)
- **FR-12**: PNG 내보내기
- **FR-13**: 필터링된 데이터 CSV 내보내기

### 비기능 요구사항 (Non-Functional Requirements)
- **NFR-01**: 50K 포인트에서 60 FPS 유지
- **NFR-02**: 10K 포인트 초기 로딩 2초 이내
- **NFR-03**: 필터 업데이트 100ms 이내
- **NFR-04**: 모바일 반응형 디자인
- **NFR-05**: WCAG AA 접근성 준수
- **NFR-06**: 다크/라이트 테마 지원

### 구현 상태 매트릭스

| 컴포넌트 | 계획됨 | 설계됨 | 구현됨 | 테스트됨 | 문서화됨 |
|-----------|---------|----------|-------------|--------|------------|
| **App Layer** | ✅ | ✅ | ✅ (100%) | ⚠️ | ✅ |
| **UploadPage** | ✅ | ✅ | ✅ (100%) | ⚠️ | ✅ |
| **MappingPage** | ✅ | ✅ | ✅ (100%) | ⚠️ | ✅ |
| **ViewerPage** | ✅ | ✅ | ✅ (100%) | ⚠️ | ✅ |
| **FileUploader** | ✅ | ✅ | ✅ (100%) | ⚠️ | ✅ |
| **DataPreview** | ✅ | ✅ | ✅ (100%) | ⚠️ | ✅ |
| **AxisMapper** | ✅ | ✅ | ✅ (100%) | ⚠️ | ✅ |
| **SceneViewer** | ✅ | ✅ | ✅ (100%) | ⚠️ | ✅ |
| **FilterPanel** | ✅ | ✅ | ❌ (0%) | ❌ | ✅ |
| **CustomizationPanel** | ✅ | ✅ | ❌ (0%) | ❌ | ✅ |
| **CSVTutorial** | ✅ | ✅ | ✅ (100%) | ⚠️ | ✅ |
| **Shared/UI** | ✅ | ✅ | ⚠️ (60%) | ❌ | ✅ |
| **Shared/Lib** | ✅ | ✅ | ⚠️ (70%) | ❌ | ✅ |
| **Shared/Hooks** | ✅ | ✅ | ❌ (0%) | ❌ | ✅ |
| **Shared/Types** | ✅ | ✅ | ✅ (100%) | ⚠️ | ✅ |
| **Shared/Zustand** | ✅ | ✅ | ✅ (100%) | ⚠️ | ✅ |

**범례**:
- ✅ 완료
- ⚠️ 부분적 (상위 수준만)
- ❌ 미완료

### 현재 프로젝트 상태
- **코드베이스**: MVP 기능 완전 구현 (Upload → Mapping → Viewer 파이프라인)
- **FSD 구조**: App, Pages, Widgets, Shared 레이어 구현 완료
- **의존성**: 모든 필수 패키지 설치 및 통합 완료
- **구성**: Vite, TypeScript, ESLint, Tailwind CSS 구성 완료
- **문서화**: 아키텍처 문서 + 구현 상태 업데이트 완성

🟢 **작동 중인 MVP**: 
- CSV 업로드 (파일 선택 + 샘플 데이터 체험)
- 데이터 파싱 및 미리보기
- 축 매핑 (X/Y/Z + 색상 인코딩)
- 3D 시각화 (Three.js + R3F)
- 인터랙티브 카메라 컨트롤 (Leva)
- 완전한 영어 UI (한국어 제거)
- SEO 최적화 완료

✅ **최근 완료 사항 (2025-11-27)**:
- 전체 사이트 영어 번역 (FileUploader, UploadPage, ViewerPage, MappingPage, AxisMapper, CSVTutorial)
- "Try with Sample Data" 버튼 추가 (UploadPage)
- 3D 뷰어 오버레이 패널 제거 (깔끔한 UI)
- CSV 헤더 요구사항 제거 (유연한 데이터 입력)
- SEO 메타 태그 추가 (Open Graph, Twitter Cards)
- TypeScript 빌드 오류 수정

⚠️ **남은 작업**:
- FilterPanel 구현 (범위 기반 필터링)
- CustomizationPanel 구현 (색상/크기 커스터마이징)
- 고급 분석 기능 (이상치 탐지, 클러스터링)
- 내보내기 기능 (PNG, CSV)
- 종합 테스트 및 최적화

---

## 🗺️ 구현 로드맵

### 🚀 Phase 1: 기초 작업 (1-2주차) - **완료** ✅
**목표**: 업로드부터 저장까지 기본 데이터 흐름 구현

**Shared Layer** (50-70시간):
- [x] TypeScript 타입 정의 (data, mapping, viewer) - 6h
- [x] Zustand 스토어 구현 (useDataStore) - 8h
- [x] PapaParse를 사용한 CSV 파서 구현 - 6h
- [x] 검증 유틸리티 구현 - 4h
- [x] 데이터 변환 유틸리티 생성 - 8h
- [ ] 수학/통계 함수 개발 - 6h
- [ ] 핵심 UI 컴포넌트 (Button, Modal, Spinner) - 8h
- [ ] 커스텀 훅 (debounce, throttle) - 4h

**App Layer** (8-12시간):
- [x] Vite 보일러플레이트 제거 - 1h
- [x] 라우트가 있는 RouterProvider 생성 - 4h
- [ ] ErrorBoundary 컴포넌트 추가 - 2h
- [x] 앱에서 Zustand 스토어 초기화 - 1h
- [ ] Vercel Analytics 통합 - 1h

---

### 🎯 Phase 2: 핵심 흐름 (3-4주차) - **완료** ✅
**목표**: 업로드 → 매핑 → 시각화 파이프라인 완성

**UploadPage** (10-14시간):
- [x] FileUploader 위젯 구현 - 6h
- [x] CSV 파싱 통합 - 3h
- [x] DataPreview 위젯 추가 - 4h
- [x] 매핑으로 네비게이션 구현 - 1h
- [x] "Try with Sample Data" 버튼 추가 - 2h
- [x] CSVTutorial 모달 추가 - 3h

**MappingPage** (15-19시간):
- [x] AxisMapper 위젯 구현 - 6h
- [x] 컬럼 검증 추가 - 3h
- [x] 자동 제안 구현 - 4h
- [x] 컬럼 통계 표시 - 2h
- [x] 뷰어로 네비게이션 추가 - 1h

**ViewerPage - 기본** (20-30시간):
- [x] R3F로 Three.js 씬 설정 - 5h
- [x] 데이터 → 3D 변환 구현 - 4h
- [x] Billboard로 포인트 렌더링 - 5h
- [x] CameraControls 추가 - 2h
- [x] 색상 인코딩 적용 - 4h
- [x] Leva GUI 컨트롤 추가 - 3h
- [x] 그리드 및 축 헬퍼 구현 - 4h
- [x] 오버레이 패널 제거 (깔끔한 UI) - 1h

---

### 🎨 Phase 3: 상호작용 (5-6주차)
**목표**: 필터링 및 커스터마이징 추가

**FilterPanel** (5-7시간):
- [ ] X/Y/Z용 범위 슬라이더 구현 - 4h
- [ ] 뷰어와 통합 - 2h
- [ ] 디바운싱 추가 - 1h

**CustomizationPanel** (4-6시간):
- [ ] 색상/크기 컨트롤 구현 - 3h
- [ ] 그리드/축 토글 추가 - 2h
- [ ] 프리셋 구현 - 2h

---

### 📊 Phase 4: 분석 기능 (7-8주차)
**목표**: 이상치 탐지 및 클러스터링 추가

**고급 기능** (16-25시간):
- [ ] IQR 이상치 탐지 구현 - 4h
- [ ] Z-score 이상치 탐지 구현 - 4h
- [ ] K-means 클러스터링 추가 - 6h
- [ ] DBSCAN 클러스터링 추가 - 6h
- [ ] SceneViewer에서 결과 시각화 - 5h

---

### 🚀 Phase 5: 마무리 (9-10주차)
**목표**: 내보내기, 모바일 지원, 접근성

**내보내기 & 추가 기능** (12-18시간):
- [ ] PNG 스크린샷 내보내기 - 4h
- [ ] 필터링된 데이터 CSV 내보내기 - 3h
- [ ] 모바일 터치 컨트롤 - 5h
- [ ] 접근성 감사 (WCAG AA) - 4h
- [ ] 성능 프로파일링 및 최적화 - 6h

---

## 📊 기능 우선순위

### Must-Have (MVP)
1. ✅ CSV 업로드 (드래그 앤 드롭, 검증)
2. ✅ 데이터 파싱 및 미리보기
3. ✅ 3개 컬럼을 X/Y/Z 축에 매핑
4. ✅ 3D 산점도 렌더링
5. ✅ 기본 카메라 컨트롤 (회전, 줌)
6. ✅ 컬럼별 색상 인코딩

### Should-Have (v1.0)
7. ✅ 범위 기반 필터링
8. ✅ 시각적 커스터마이징 (색상, 크기)
9. ✅ 그리드 및 축 표시
10. ✅ 기본 통계 오버레이
11. ✅ PNG 내보내기

### Nice-to-Have (v1.1+)
12. ⏳ 이상치 탐지
13. ⏳ 클러스터링 분석
14. ⏳ 필터링된 CSV 내보내기
15. ⏳ 포인트 선택/검사
16. ⏳ 애니메이션/트랜지션
17. ⏳ 다중 데이터셋 지원

---

## 🚀 개발 워크플로우

### 1. 새 기능 추가 시
1. 해당 기능이 속할 Layer 결정 (Widget/Page)
2. 디렉토리 구조 생성 (`ui/`, `model/`)
3. 타입 정의 (`shared/types/`)
4. Zustand store 업데이트 (필요시)
5. 커스텀 훅 작성 (`model/`)
6. UI 컴포넌트 작성 (`ui/`)

### 2. 공통 로직 발견 시
1. 재사용 가능성 판단
2. 높은 경우 → `shared/lib/` 또는 `shared/hooks/`로 이동
3. 낮은 경우 → 해당 Widget의 `model/`에 유지

### 3. 상태 관리 추가 시
1. 로컬 상태로 충분한지 판단
2. 여러 컴포넌트에서 공유 필요 → Zustand store 생성/확장
3. `shared/zustand/` 디렉토리에 store 파일 추가

---

## ⚡ 성능 최적화 계획

### 벤치마킹 전략
```typescript
// 성능 목표
const TARGETS = {
  initialLoad: 2000, // 10K 포인트 로딩 시간 (ms)
  filterUpdate: 100,  // 범위 변경 시간 (ms)
  targetFPS: 60,      // 초당 프레임
  maxMemory: 500,     // 100K 포인트에 대한 최대 메모리 (MB)
};

// 테스트 접근법
1. 첫날부터 성능 모니터링 설정
2. 데이터셋으로 테스트: 1K, 10K, 50K, 100K 포인트
3. Chrome DevTools로 렌더 루프 프로파일링
4. 힙 스냅샷으로 메모리 사용량 측정
5. 병목 지점 반복적으로 최적화
```

### 최적화 기법
- [ ] 포인트 렌더링에 instanced mesh 사용
- [ ] Frustum culling 구현
- [ ] 원거리 포인트용 LOD (Level of Detail) 추가
- [ ] 데이터 처리에 Web Workers 사용
- [ ] 필터 업데이트 디바운싱
- [ ] 카메라 이동 업데이트 쓰로틀링
- [ ] 분석 알고리즘 지연 로드
- [ ] 데이터 미리보기 테이블 가상화

---

## ✅ 품질 기준 및 핵심 성공 요인

### 개발 우선순위
1. **기초 우선**: 다른 모든 것보다 먼저 shared layer 완성 (차단)
2. **조기 테스트**: 구현과 함께 테스트 작성 (TDD)
3. **성능 예산**: 첫날부터 실제 데이터로 프로파일링
4. **점진적 제공**: 고급 기능 전에 MVP (업로드 → 매핑 → 시각화) 배포
5. **문서화**: 프로젝트 문서를 항상 최신 상태로 유지

### 품질 게이트
- ✅ 모든 Zustand 스토어에 devtools 활성화
- ✅ shared/lib 유틸리티에 대해 90%+ 테스트 커버리지
- ✅ 50K 포인트에서 60 FPS 유지
- ✅ WCAG AA 접근성 준수
- ✅ 태블릿/휴대폰에서 모바일 반응형
- ✅ Chrome, Firefox, Safari, Edge에서 작동

### 필요한 팀 역량
- **React 전문가**: 훅, 최적화, 디버깅
- **Three.js 전문가**: WebGL, 3D 그래픽, 성능
- **TypeScript 전문가**: 고급 타입, 제네릭, 유틸리티 타입
- **데이터 과학자**: 이상치 탐지, 클러스터링 알고리즘
- **UX 디자이너**: 목업, 상호작용 디자인, 접근성

---

## 🎯 즉시 수행할 작업

### 다음 단계 (순서대로)
1. ✅ **FSD 폴더 구조 생성** (완료)
2. ✅ **모든 AGENTS.md 파일 생성** (완료)
3. ✅ **Shared layer 구현** (완료)
4. ✅ **UploadPage 구축** (완료)
5. ✅ **MappingPage 완성** (완료)
6. ✅ **기본 ViewerPage 개발** (완료)
7. ✅ **영어 번역 및 UI 개선** (완료)
8. ✅ **SEO 최적화** (완료)
9. 🔄 **필터링 및 커스터마이징 추가** - **여기서 시작**
10. 🔄 **고급 분석 기능 구현**
11. 🔄 **내보내기 기능 추가**
12. 🔄 **종합 테스트 및 최적화**
13. 🔄 **프로덕션 배포**

### 위험 평가: 🟢 낮음-중간
- ✅ MVP 완성으로 아키텍처 검증 완료
- ✅ 핵심 흐름 (Upload → Mapping → Viewer) 작동 확인
- ⚠️ 대규모 데이터셋 성능 테스트 필요
- ⚠️ 고급 분석 기능 미구현

### 권장사항
**현재 상태**: MVP 완료, 사용자 피드백 수집 가능 단계. 다음 단계로 필터링/커스터마이징 기능 추가 후 성능 최적화 진행. 고급 기능(이상치 탐지, 클러스터링)은 사용자 요구사항 확인 후 개발.

---

## 📝 문서 유지관리 지침

이 파일은 구현이 진행됨에 따라 업데이트해야 합니다:
- 작업 완료 시 체크박스 표시
- 실제 벤치마크 추가
- 아키텍처 결정 문서화

**최종 업데이트**: 2025-11-27 (초기 생성, AGENTS.md와 병합)

---

## ✅ 코드 작성 체크리스트

### 컴포넌트 작성 시
- [ ] FSD 레이어 규칙 준수 (상위 → 하위 의존성)
- [ ] UI 로직과 비즈니스 로직 분리 (`ui/`와 `model/`)
- [ ] 재사용 가능한 로직은 Shared로 이동
- [ ] TypeScript 타입 정의 완료
- [ ] Tailwind CSS 유틸리티 클래스 사용

### 상태 관리 시
- [ ] 로컬 vs 전역 상태 판단
- [ ] Zustand store 활용 (전역 상태)
- [ ] 불필요한 리렌더링 방지 (selector 사용)

### 성능 고려
- [ ] 대량 데이터 처리 시 최적화 (useMemo, useCallback)
- [ ] Three.js 렌더링 최적화 (LOD, frustum culling)
- [ ] 필터링 시 debounce/throttle 적용

---

## 📚 주요 라이브러리 사용법

### React Three Fiber (R3F)
```tsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

<Canvas>
  <ambientLight intensity={0.5} />
  <pointLight position={[10, 10, 10]} />
  <OrbitControls />
  {/* 3D objects */}
</Canvas>
```

### Zustand
```typescript
import { create } from 'zustand';

export const useStore = create<State>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

### GSAP
```typescript
import gsap from 'gsap';

gsap.to(element, { x: 100, duration: 1, ease: 'power2.out' });
```

### Leva (GUI Controls)
```tsx
import { useControls } from 'leva';

const { pointSize, color } = useControls({
  pointSize: { value: 2, min: 1, max: 10 },
  color: '#3498db',
});
```

---

## 🐛 디버깅 가이드

### React DevTools
- 컴포넌트 트리 확인
- Props 및 State 검사

### Zustand DevTools
```typescript
import { devtools } from 'zustand/middleware';

export const useStore = create<State>()(
  devtools((set) => ({
    // ...
  }))
);
```

### Three.js Debugging
- Leva GUI로 파라미터 실시간 조정
- `stats` 패널로 FPS 모니터링
- R3F devtools 사용

---

## 📝 코딩 컨벤션

### 파일명
- 컴포넌트: PascalCase (`FileUploader.tsx`)
- 훅: camelCase with 'use' prefix (`useUploadFile.ts`)
- 유틸: camelCase (`csvParser.ts`)
- 타입: camelCase with '.types' suffix (`data.types.ts`)

### Import 순서
```typescript
// 1. React 관련
import React, { useState, useEffect } from 'react';

// 2. 외부 라이브러리
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';

// 3. 내부 모듈 (상위 레이어 → 하위 레이어)
import { Button } from '@/shared/ui/Button';
import { useDataStore } from '@/shared/zustand/useDataStore';

// 4. 타입
import type { DataPoint } from '@/shared/types/data.types';

// 5. 스타일
import './styles.css';
```

### 함수/변수명
- 컴포넌트: PascalCase
- 함수: camelCase
- 상수: UPPER_SNAKE_CASE
- boolean 변수: `is-`, `has-`, `should-` prefix

---

## 🎯 AI 어시스턴트 협업 가이드

### 코드 생성 요청 시 제공할 정보
1. **기능 요구사항**: 구현하려는 기능의 상세 설명
2. **FSD 레이어**: 해당 기능이 속할 레이어 (App/Pages/Widgets/Features/Shared)
3. **관련 타입**: 사용할 데이터 타입 정보
4. **의존성**: 필요한 Zustand store, 외부 라이브러리

### 예시 요청
```
기능: CSV 파일 업로드 드롭존 컴포넌트
레이어: features/uploadFile
요구사항:
- 드래그 앤 드롭 지원
- 50MB 파일 크기 제한
- CSV 파일만 허용
- 에러 메시지 표시
의존성:
- useDataStore (파싱 후 데이터 저장)
- PapaParse (CSV 파싱)
```

### 코드 리뷰 요청 시 체크 포인트
- FSD 아키텍처 규칙 준수 여부
- UI/로직 분리 적절성
- 타입 안정성
- 성능 최적화 여부
- 재사용성 고려 여부

---

## 📖 참고 문서

### 프로젝트 문서
- `README.md`: 프로젝트 개요 및 실행 가이드
- `CLAUDE.md`: 프로젝트 아키텍처 및 개발 가이드 (이 문서)
- **각 레이어별 AGENTS.md**: 세부 구현 가이드

---

## 📂 서브폴더 컨텍스트 문서 요약

각 레이어별 AGENTS.md 파일은 해당 레이어의 상세 구현 가이드를 제공합니다.

### 🎯 src/app/AGENTS.md
**책임**: 애플리케이션 초기화 및 글로벌 설정

**주요 내용**:
- React Router DOM 설정 및 라우팅 구성
- 전역 Provider 관리 (Router, Theme, ErrorBoundary)
- Zustand 스토어 초기화
- Vercel Analytics 통합
- 애플리케이션 생명주기 관리

**현재 상태**: ✅ 완료 (라우터 설정, 기본 레이아웃)

**주요 컴포넌트**:
- `App.tsx`: 메인 애플리케이션 컴포넌트
- `main.tsx`: 진입점
- `providers/`: Context Provider 디렉토리

**의존성**:
- react, react-dom, react-router-dom
- @vercel/analytics
- pages/* (라우팅용)

---

### 📄 src/pages/AGENTS.md
**책임**: 사용자 워크플로우의 각 단계를 담당하는 페이지 컴포넌트

**주요 페이지**:

#### 1. UploadPage ✅ 완료
- CSV 파일 업로드 (드래그 앤 드롭, 파일 선택)
- 샘플 데이터 체험 기능
- 파일 검증 및 파싱
- 데이터 미리보기
- 매핑 페이지로 이동

**주요 기능**:
- 최대 50MB 파일 지원
- CSV 형식 검증
- PapaParse를 통한 데이터 파싱
- 처음 10행 미리보기

#### 2. MappingPage ✅ 완료
- CSV 컬럼을 X/Y/Z 축에 매핑
- 선택적 색상 인코딩 컬럼 선택
- 매핑 검증 및 자동 제안
- 컬럼 통계 표시

**주요 기능**:
- 숫자형 컬럼 자동 필터링
- 중복 선택 방지
- 컬럼별 통계 (min, max, mean)
- 뷰어 페이지로 이동

#### 3. ViewerPage ✅ 완료
- 3D 공간에서 데이터 시각화
- 인터랙티브 카메라 컨트롤
- 실시간 파라미터 조정 (Leva GUI)
- 그리드 및 축 표시

**주요 기능**:
- Three.js + React Three Fiber 렌더링
- CameraControls로 회전/줌/팬
- Point Size, Opacity, Spacing 조정
- XZ/YZ 평면, 그리드, 축 토글

**워크플로우**: Upload → Mapping → Viewer

**공통 패턴**:
- `ui/` - 프레젠테이션 컴포넌트
- `model/` - 비즈니스 로직 (커스텀 훅)
- Zustand 스토어와 통합
- React Router로 네비게이션

**의존성**:
- widgets/* (FileUploader, AxisMapper, SceneViewer)
- shared/zustand/* (useDataStore, useMappingStore)
- shared/lib/* (csvParser, validation)

---

### 🧩 src/widgets/AGENTS.md
**책임**: 독립적이고 재사용 가능한 복합 UI 블록

**주요 위젯**:

#### 1. FileUploader ✅ 완료
- 드래그 앤 드롭 파일 업로드
- 파일 선택 버튼
- 파일 크기/타입 검증
- 업로드 상태 표시

**컴포넌트**:
- `FileUploader.tsx`: 메인 컨테이너
- `FileDropZone.tsx`: 드래그 앤 드롭 영역
- `FileButton.tsx`: 파일 선택 버튼

#### 2. DataPreview ✅ 완료
- CSV 데이터 테이블 미리보기
- 처음 N행 표시
- 컬럼 헤더 및 데이터 타입
- 기본 통계 정보

#### 3. AxisMapper ✅ 완료
- X/Y/Z 축 컬럼 선택 드롭다운
- 색상 인코딩 컬럼 선택
- 중복 선택 방지
- 매핑 검증

**컴포넌트**:
- `AxisMapper.tsx`: 메인 매퍼
- `AxisSelector.tsx`: 개별 축 드롭다운
- `ColorSelector.tsx`: 색상 인코딩 선택

#### 4. SceneViewer ✅ 완료
- Three.js/R3F 3D 시각화
- 산점도 렌더링 (Billboard)
- 카메라 컨트롤 (CameraControls)
- 축 및 그리드 헬퍼

**컴포넌트**:
- `SceneViewer.tsx`: Canvas 및 씬 설정
- `PointCloud.tsx`: 포인트 렌더러
- `AxisHelper.tsx`: 3D 축 선
- `CustomGrid.tsx`: 바닥 그리드

#### 5. CSVTutorial ✅ 완료
- CSV 형식 가이드 모달
- 기본 요구사항 설명
- 올바른/잘못된 형식 예시
- 샘플 데이터 다운로드

#### 6. FilterPanel ⏳ 계획됨
- 축별 범위 슬라이더
- 실시간 필터링
- 디바운싱 적용

#### 7. CustomizationPanel ⏳ 계획됨
- 색상/크기 커스터마이징
- 그리드/축 토글
- 프리셋 관리

**공통 패턴**:
- `ui/` - 프레젠테이션 컴포넌트
- `model/` - 비즈니스 로직 (커스텀 훅)
- 독립성: 위젯 간 의존성 없음
- 재사용성: 여러 페이지에서 사용

**의존성**:
- shared/ui/* (Button, Modal, Tooltip 등)
- shared/lib/* (유틸리티)
- shared/zustand/* (전역 상태)
- Three.js, R3F, Drei (3D 렌더링)

---

### 🔧 src/shared/AGENTS.md
**책임**: 프로젝트 전역에서 재사용되는 기초 모듈

**주요 디렉토리**:

#### 1. shared/ui/ ⚠️ 부분 구현
**재사용 가능한 UI 컴포넌트**:
- Button, Slider, ColorPicker (계획됨)
- Tooltip, Modal, Spinner (계획됨)
- 현재: 기본 컴포넌트만 존재

#### 2. shared/lib/ ✅ 대부분 완료
**유틸리티 함수**:
- `csvParser.ts` ✅: PapaParse 래퍼, CSV 파싱
- `validation.ts` ✅: 파일 및 데이터 검증
- `dataTransform.ts` ✅: 데이터 변환 (3D 좌표)
- `math.ts` ⏳: 통계 계산 (부분 구현)
- `outlierDetector.ts` ⏳: 이상치 탐지 (계획됨)
- `clustering.ts` ⏳: 클러스터링 알고리즘 (계획됨)

#### 3. shared/hooks/ ⏳ 미구현
**커스텀 React 훅**:
- `useDebounce.ts`: 값 디바운싱
- `useThrottle.ts`: 함수 쓰로틀링
- `useLocalStorage.ts`: localStorage 동기화

#### 4. shared/types/ ✅ 완료
**TypeScript 타입 정의**:
- `data.types.ts`: CSV 데이터 구조
  - `CSVRow`, `CSVData`, `ParsedData`
- `mapping.types.ts`: 축 매핑 구조
  - `AxisMapping`, `ValidationResult`
- `viewer.types.ts`: 3D 뷰어 타입
  - `Point3D`, `CameraSettings`, `ViewerSettings`

#### 5. shared/zustand/ ✅ 완료
**전역 상태 관리 (Zustand)**:

**useDataStore.ts**:
```typescript
- rawData: CSVRow[] | null
- columns: string[]
- dataTypes: Record<string, 'number' | 'string'>
- fileName: string | null
- setData(data, filename)
- clearData()
```

**useMappingStore.ts** (ViewerPage 내부):
```typescript
- xAxis, yAxis, zAxis: string | null
- colorBy: string | null
- colorScheme: string
- setAxis, setColorBy, setColorScheme
- resetMapping()
```

**기타 스토어**:
- Leva로 뷰어 설정 관리
- 필요시 추가 스토어 구현 예정

**공통 원칙**:
- FSD 규칙: 상위 레이어만 의존 가능
- 순수 함수 지향 (lib)
- 타입 안정성
- 재사용성 최우선

**의존성**:
- papaparse (CSV 파싱)
- zustand (상태 관리)
- d3-scale, d3-color (색상 스케일)
- @radix-ui (접근성 컴포넌트)

**구현 우선순위**:
1. ✅ Types (완료)
2. ✅ Zustand Stores (완료)
3. ✅ CSV Parser (완료)
4. ✅ Validation (완료)
5. ⏳ Math/Statistics (부분)
6. ⏳ Custom Hooks (미구현)
7. ⏳ Advanced Algorithms (미구현)

---

## 📊 레이어별 구현 상태 요약

| 레이어 | 완료도 | 주요 완료 항목 | 주요 미완료 항목 |
|--------|--------|---------------|-----------------|
| **app** | 100% | Router, Layout, Navigation | Analytics 세부 설정 |
| **pages** | 100% | Upload, Mapping, Viewer 페이지 | - |
| **widgets** | 70% | FileUploader, AxisMapper, SceneViewer, CSVTutorial | FilterPanel, CustomizationPanel |
| **shared** | 75% | Types, Stores, csvParser, validation, dataTransform | Hooks, Math완성, 고급 알고리즘 |

---

## 🔗 레이어 간 의존성 흐름

```
app/
  ↓ uses
pages/ (UploadPage, MappingPage, ViewerPage)
  ↓ uses
widgets/ (FileUploader, AxisMapper, SceneViewer)
  ↓ uses
shared/ (ui, lib, hooks, types, zustand)
```

**FSD 규칙 준수**:
- ✅ 하위 레이어만 참조
- ✅ 같은 레벨 간 의존성 없음
- ✅ 순환 참조 없음

### 외부 문서
- [Feature-Sliced Design](https://feature-sliced.design/)
- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [Three.js Manual](https://threejs.org/manual/)
- [GSAP Documentation](https://greensock.com/docs/)

---

## 🔄 업데이트 로그

### v0.4 (2025-11-27) - MVP 완성 + 영어화 + SEO
- **전체 영어 번역 완료**: 모든 UI 텍스트를 한국어에서 영어로 변환
  - FileUploader, UploadPage, ViewerPage, MappingPage, AxisMapper 번역
  - CSVTutorial 완전 번역 (예시 데이터 영어 이름으로 변경)
- **샘플 데이터 기능 추가**: "Try with Sample Data" 버튼으로 즉시 체험 가능
- **UI 개선**: 3D 뷰어 오버레이 패널 제거 (깔끔한 인터페이스)
- **CSV 유연성 향상**: 헤더 행 필수 요구사항 제거
- **SEO 최적화**: Open Graph, Twitter Cards, 메타 태그 추가
- **빌드 안정화**: TypeScript 오류 수정, import 경로 정리

### v0.3 (2025-11-20) - MVP 구현
- UploadPage, MappingPage, ViewerPage 완전 구현
- FileUploader, AxisMapper, SceneViewer 위젯 개발
- Three.js + R3F 3D 시각화 파이프라인 구축
- Leva 실시간 GUI 컨트롤 통합
- Zustand 전역 상태 관리 구현

### v0.2 (2025-11-13) - 기초 작업
- FSD 폴더 구조 완전 생성
- TypeScript 타입 정의 완료
- CSV 파서 구현 (PapaParse)
- React Router 설정
- Tailwind CSS 스타일링 적용

### v0.1 (2025-11-06) - 초기 계획
- CLAUDE.md 초기 작성
- FSD 아키텍처 구조 정의
- 커스텀 훅 분리 패턴 명시
- Zustand 상태 관리 구조 설계
- 개발 워크플로우 및 컨벤션 정립

---

**이 문서는 프로젝트의 구조와 개발 방향성을 명확히 하기 위해 작성되었습니다.**  
**AI 어시스턴트와 협업 시 이 문서를 기준으로 코드를 생성하고 리뷰해주세요.**
