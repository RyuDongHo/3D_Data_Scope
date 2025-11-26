# Pages 레이어 에이전트 문서

## 1. 레이어 책임
사용자 워크플로우의 각 단계를 담당하는 페이지 컴포넌트들입니다. 라우팅을 통해 연결되며, 위젯과 공유 모듈을 조합하여 완전한 사용자 경험을 제공합니다.

**워크플로우**: UploadPage → MappingPage → ViewerPage

---

## 2. 공통 구조

### 아키텍처 패턴
모든 페이지는 FSD 규칙을 따릅니다:
```
pages/{PageName}/
  ├── ui/              # 프레젠테이션 컴포넌트
  │   └── {PageName}.tsx
  └── model/           # 비즈니스 로직
      └── use{PageName}.ts
```

### 공통 의존성
- `shared/zustand/*` - 전역 상태 관리
- `shared/types/*` - 타입 정의
- `shared/lib/*` - 유틸리티 함수
- `widgets/*` - 재사용 가능한 UI 블록
- `react-router-dom` - 페이지 간 네비게이션

### 공통 패턴
- 페이지 수준 상태 오케스트레이션
- 에러 바운더리 통합
- 로딩 상태 관리
- 네비게이션 가드 (데이터 유효성 검증)

---

## 3. 개별 페이지 상세

### 3.1 UploadPage

#### 책임
CSV 파일 업로드의 진입점. 파일 선택(드래그 앤 드롭 또는 버튼), 유효성 검증, 파싱, 미리보기를 담당합니다.

#### 입출력
**입력**:
- 사용자가 선택한 CSV 파일 (50MB 이하)
- 파일 유효성 검증 규칙

**출력**:
- 파싱된 데이터를 `useDataStore`에 저장
- 컬럼명, 데이터 타입 추출
- `/mapping` 페이지로 네비게이션
- 에러 메시지 (잘못된 파일)

#### 내부 구조
```typescript
// ui/UploadPage.tsx
- FileUploader 위젯 통합
- DataPreview 위젯으로 미리보기 표시
- "다음 단계" 버튼으로 매핑 페이지 이동

// model/useUploadPage.ts
- 페이지 상태 관리 (loading, error, success)
- 파일 업로드 워크플로우 조율
- useDataStore와 통합
- 네비게이션 로직
```

#### 실행 흐름
1. 사용자가 CSV 파일을 드래그하거나 선택
2. FileUploader가 파일 유효성 검증 (크기, 확장자)
3. shared/lib/csvParser로 파싱
4. 컬럼별 데이터 타입 추론
5. useDataStore.setData()로 저장
6. DataPreview에 처음 10행 표시
7. "매핑 설정" 버튼 활성화
8. `/mapping`으로 이동

#### 의존성
- `widgets/FileUploader` - 파일 업로드 UI
- `widgets/DataPreview` - 데이터 테이블 미리보기
- `shared/lib/csvParser` - CSV 파싱
- `shared/lib/validation` - 파일 검증
- `shared/zustand/useDataStore` - 데이터 저장

#### 검증 항목
- [ ] 50MB 이하 파일만 허용
- [ ] .csv 확장자만 허용
- [ ] 잘못된 CSV 형식 에러 처리
- [ ] 대용량 파일 파싱 시 로딩 표시
- [ ] 빈 파일 처리

#### 구현 예상 시간
**10-14시간**
- 기본 파일 입력 및 업로드: 2시간
- CSV 파싱 통합: 3시간
- 데이터 스토어 연동: 1시간
- 미리보기 표시: 2시간
- 드래그 앤 드롭 강화: 3시간
- 에러 처리 및 검증: 3시간

---

### 3.2 MappingPage

#### 책임
CSV 컬럼을 3D 축(X, Y, Z)에 매핑하고 선택적으로 색상 인코딩 컬럼을 선택합니다. 매핑 검증 후 시각화 설정을 준비합니다.

#### 입출력
**입력**:
- `useDataStore`의 파싱된 CSV 데이터 (컬럼, 데이터 타입)
- 사용자의 축 매핑 선택 (X, Y, Z 컬럼)
- 선택적 색상 인코딩 컬럼

**출력**:
- `useMappingStore`에 축 매핑 설정 저장
- 컬럼 → 축 할당 (xAxis, yAxis, zAxis)
- 색상 인코딩 설정 (colorBy, 색상 스킴)
- `/viewer` 페이지로 네비게이션
- 잘못된 선택에 대한 검증 피드백

#### 내부 구조
```typescript
// ui/MappingPage.tsx
- 업로드된 CSV의 사용 가능한 컬럼 표시
- AxisMapper 위젯 통합
- 매핑 요약/미리보기 표시
- 네비게이션 버튼 (뒤로, 계속)

// model/useMappingPage.ts
- useDataStore에서 컬럼 조회
- 매핑 선택 검증 (3개의 서로 다른 숫자 컬럼 필요)
- useMappingStore에 설정 저장
- 네비게이션 흐름 관리
- 엣지 케이스 처리 (숫자가 아닌 컬럼, 중복 선택)
```

#### 실행 흐름
1. useDataStore에서 컬럼 목록 로드
2. 축 선택을 위한 숫자 컬럼 필터링
3. 드롭다운 셀렉터가 있는 AxisMapper 위젯 표시
4. 사용자가 숫자 컬럼에서 X, Y, Z 축 선택
5. 사용자가 선택적으로 색상 기준 컬럼 선택
6. 선택 검증 (중복 없음, 모두 숫자)
7. useMappingStore에 매핑 저장
8. "뷰어로 이동" 버튼 활성화
9. `/viewer`로 이동

#### 의존성
- `widgets/AxisMapper` - 축 선택 UI
- `widgets/DataPreview` - 선택적 미리보기
- `shared/zustand/useDataStore` - CSV 데이터 읽기
- `shared/zustand/useMappingStore` - 매핑 설정 저장
- `shared/types/mapping.types` - 매핑 타입 정의
- `shared/lib/validation` - 매핑 선택 검증
- `shared/lib/dataTransform` - 데이터 타입 검사

#### 검증 항목
- [ ] 숫자 컬럼만 축에 매핑 가능
- [ ] 3개 축이 모두 서로 다른 컬럼
- [ ] 3개 미만의 숫자 컬럼 처리
- [ ] 자동 제안 기능
- [ ] 컬럼 통계 표시 (min, max, mean)
- [ ] 뒤로 가기 시 데이터 유지

#### 구현 예상 시간
**15-19시간**
- 스토어에서 컬럼 목록 표시: 2시간
- X, Y, Z 기본 드롭다운 셀렉터: 2시간
- 매핑 검증 로직: 3시간
- 스토어 통합: 1시간
- 자동 제안 기능: 4시간
- 컬럼 통계 표시: 2시간
- 색상 인코딩 지원: 3시간
- 네비게이션 및 에러 처리: 2시간

---

### 3.3 ViewerPage

#### 책임
매핑된 CSV 데이터를 기반으로 3D 산점도 시각화를 렌더링합니다. 인터랙티브 카메라 컨트롤, 필터링, 커스터마이징, 분석 기능(이상치 감지, 클러스터링)을 제공합니다.

#### 입출력
**입력**:
- `useDataStore`의 매핑된 CSV 데이터
- `useMappingStore`의 축 매핑 설정
- `useViewerStore`의 뷰어 설정 (카메라, 색상, 포인트 크기)
- UI 컨트롤의 필터 범위
- 사용자 카메라 인터랙션 (궤도, 줌, 팬)

**출력**:
- Three.js/R3F를 통한 실시간 3D 산점도
- 인터랙티브 카메라 조작
- 필터링된 데이터 시각화
- 이상치/클러스터 강조 표시
- 내보내기 기능 (스크린샷, 필터링된 데이터)
- 성능 메트릭 (FPS, 포인트 수)

#### 내부 구조
```typescript
// ui/ViewerPage.tsx
- 3D 씬을 위한 캔버스 컨테이너
- 컨트롤용 사이드 패널 (필터, 커스터마이징)
- 상단 툴바 (내보내기, 뷰 리셋, 설정)
- 상태 바 (FPS, 포인트 수, 선택된 데이터)

// model/useViewerPage.ts
- CSV 데이터를 3D 좌표로 변환
- 데이터셋에 필터 적용
- 뷰 상태 관리 (카메라 위치, 선택)
- 위젯 간 조율
- 내보내기 기능 처리
```

#### 실행 흐름
1. useDataStore와 useMappingStore에서 데이터 로드
2. CSV 컬럼을 3D 포인트 클라우드로 변환 ([-1, 1] 범위로 정규화)
3. colorBy 컬럼 기반 색상 인코딩 적용
4. SceneViewer 위젯을 통해 Three.js 씬 초기화
5. 성능을 위해 인스턴스드 메시로 포인트 렌더링
6. 카메라 조작을 위한 OrbitControls 활성화
7. FilterPanel의 필터 변경 감지
8. 필터 기반 포인트 가시성/색상 업데이트
9. 사용자 요청 시 이상치 감지
10. 통계 표시 및 데이터 내보내기 허용

#### 의존성
- `widgets/SceneViewer` - R3F로 3D 씬 렌더링
- `widgets/FilterPanel` - X/Y/Z 필터링용 범위 슬라이더
- `widgets/CustomizationPanel` - 색상, 크기, 배경 컨트롤
- `shared/lib/dataTransform` - CSV → 3D 좌표 변환
- `shared/lib/math` - 정규화, 통계
- `shared/lib/outlierDetector` - 이상치 감지 알고리즘
- `shared/lib/clustering` - K-means 또는 DBSCAN 클러스터링
- `shared/zustand/useDataStore` - 매핑된 데이터 읽기
- `shared/zustand/useMappingStore` - 축 설정 읽기
- `shared/zustand/useViewerStore` - 뷰어 설정 읽기/쓰기
- `shared/zustand/useUIStore` - 패널 가시성 상태
- `shared/types/viewer.types` - 3D 시각화 타입

#### 외부 라이브러리
- `three` ^0.179.1 - 3D 렌더링 엔진
- `@react-three/fiber` ^9.3.0 - Three.js용 React 조정자
- `@react-three/drei` ^10.7.4 - 헬퍼 컴포넌트 (OrbitControls, Stats 등)
- `gsap` ^3.13.0 - 카메라 애니메이션
- `leva` ^0.10.0 - 실시간 파라미터 조정 GUI

#### 검증 항목
- [ ] 데이터를 3D로 로드 및 변환
- [ ] Three.js 씬에 포인트 렌더링
- [ ] 가시 포인트에 필터 적용
- [ ] 색상 기준 컬럼에 따라 색상 업데이트
- [ ] 이상치 올바르게 감지
- [ ] 100K+ 포인트를 지연 없이 처리
- [ ] PNG로 스크린샷 내보내기
- [ ] 필터링된 데이터를 CSV로 내보내기
- [ ] OrbitControls로 60 FPS 유지

#### 성능 목표
- **목표 FPS**: 50K 포인트에서 60 FPS
- **초기 로드**: 10K 포인트에 대해 <2초
- **필터 업데이트**: 범위 변경 시 <100ms
- **메모리 사용**: 100K 포인트에 대해 <500MB

#### 구현 예상 시간
**43-60시간**
1. 테스트 데이터로 기본 3D 씬 설정: 5시간
2. 데이터 변환 및 정규화: 4시간
3. 인스턴스드 메시로 포인트 렌더링: 5시간
4. OrbitControls 통합: 2시간
5. 색상 인코딩 구현: 4시간
6. 필터 패널 통합: 5시간
7. 커스터마이징 패널 통합: 4시간
8. 성능 최적화: 8시간
9. 이상치 감지 기능: 5시간
10. 클러스터링 기능: 6시간
11. 내보내기 기능: 4시간
12. 통계 및 UI 개선: 4시간

---

## 4. 통합 테스트 전략

### 페이지 간 네비게이션 테스트
```typescript
describe('Pages 워크플로우 통합', () => {
  it('Upload → Mapping → Viewer 전체 흐름', async () => {
    // 1. UploadPage에서 CSV 업로드
    const file = new File(['data'], 'test.csv');
    await uploadFile(file);
    expect(useDataStore.getState().rawData).toBeDefined();
    
    // 2. MappingPage로 이동
    navigate('/mapping');
    expect(screen.getByText('축 매핑')).toBeInTheDocument();
    
    // 3. 축 선택
    selectAxis('x', 'column1');
    selectAxis('y', 'column2');
    selectAxis('z', 'column3');
    
    // 4. ViewerPage로 이동
    navigate('/viewer');
    expect(screen.getByRole('canvas')).toBeInTheDocument();
  });
});
```

### 상태 지속성 테스트
- 뒤로 가기 시 데이터 유지
- 페이지 새로고침 시 상태 복원 (localStorage)
- 에러 발생 시 적절한 폴백

---

## 5. 구현 우선순위

### Phase 1: MVP (필수)
1. **UploadPage** (주 1-2)
   - 기본 파일 업로드
   - CSV 파싱
   - 데이터 스토어 저장

2. **MappingPage** (주 2-3)
   - 컬럼 목록 표시
   - 기본 축 선택
   - 매핑 검증

3. **ViewerPage - 기본** (주 3-4)
   - 기본 3D 씬
   - 포인트 렌더링
   - 카메라 컨트롤

### Phase 2: 인터랙티비티 (주 5-6)
- FilterPanel 통합
- CustomizationPanel 통합
- 필터 적용 및 업데이트

### Phase 3: 고급 기능 (주 7-8)
- 이상치 감지
- 클러스터링
- 내보내기 기능

---

## 6. 현재 상태 및 차단 요소

### 구현 상태
- **코드 완성**: 0% (Vite 보일러플레이트만 존재)
- **구조 정의**: 100% (폴더 생성 완료)
- **문서화**: 100% (사양 정의 완료)

### 차단 요소
모든 페이지는 다음에 의존:
- ✅ `shared/types/*` (타입 정의)
- ✅ `shared/zustand/*` (전역 스토어)
- ✅ `shared/lib/*` (유틸리티)
- ✅ `widgets/*` (UI 컴포넌트)

**결론**: Shared 레이어가 먼저 구현되어야 함 (차단 중)

---

## 7. 역추적된 요구사항

### 기능 요구사항
- **REQ-PAGE-001**: UploadPage에서 50MB까지 CSV 업로드 지원
- **REQ-PAGE-002**: MappingPage에서 3개의 서로 다른 숫자 컬럼을 X, Y, Z 축에 매핑
- **REQ-PAGE-003**: ViewerPage에서 60 FPS로 3D 산점도 렌더링
- **REQ-PAGE-004**: 모든 페이지에서 반응형 디자인 (모바일, 태블릿, 데스크톱)
- **REQ-PAGE-005**: 페이지 간 원활한 네비게이션 및 상태 지속성

### 비기능 요구사항
- **REQ-PAGE-NFR-001**: 페이지 전환 시간 <300ms
- **REQ-PAGE-NFR-002**: 접근성 WCAG AA 준수
- **REQ-PAGE-NFR-003**: 에러 발생 시 적절한 사용자 피드백

---

## 8. 다음 액션 아이템

### 즉시 (이번 주)
- [ ] `shared/types/` 구현 (타입 정의)
- [ ] `shared/zustand/` 구현 (스토어)
- [ ] `shared/lib/csvParser` 구현

### 단기 (다음 2주)
- [ ] UploadPage 구현 시작
- [ ] FileUploader 위젯 개발
- [ ] DataPreview 위젯 개발

### 중기 (주 3-5)
- [ ] MappingPage 구현
- [ ] ViewerPage 기본 기능 구현
- [ ] 성능 최적화

---

**문서 최종 업데이트**: 2025-11-27  
**구현 상태**: 0% (계획 단계)  
**예상 총 소요 시간**: 68-93시간 (전체 Pages 레이어)
