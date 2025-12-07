# 3D Data Scope 📊

> 순수 직관으로 만든 바이브 코딩 3D 데이터 시각화 놀이터

이것은 **100% 바이브 코딩 프로젝트**입니다 - 오로지 감각과 실험, 반복적인 개선으로만 만들어졌습니다. 철저한 계획 따윈 없고, 그냥 코드 짜고, 보고, 고치고, 작동시키는 것의 반복. 전체 아키텍처는 개발 과정에서 유기적으로 진화했습니다.

![Version](https://img.shields.io/badge/version-0.4.0-blue)
![Vibe](https://img.shields.io/badge/코딩-100%25%20바이브-ff69b4)
![React](https://img.shields.io/badge/React-19.1.1-61dafb?logo=react)
![Three.js](https://img.shields.io/badge/Three.js-0.179-black?logo=three.js)

## 🎨 뭘 하는 앱인가요

CSV 업로드 → 컬럼을 3D 축에 매핑 → 3D 공간에서 데이터 탐색

끝. 심플하고, 시각적이고, 인터랙티브합니다.

## 🧠 바이브 코딩 접근법

이 프로젝트는 **순수 실험과 반복**으로 만들어졌습니다:
- 상세한 설계 문서나 목업 없음
- 코드 먼저, 리팩토링은 나중에 (혹은 절대 안 함)
- "보기 좋나?" → 배포
- "작동하나?" → 충분함
- 기능 아이디어는 구현 중에 떠오름
- 아키텍처는 리팩토링 과정에서 유기적으로 진화

결과: 실제로 쓰기 꽤 괜찮은 느낌의 3D 데이터 시각화 앱.

## 🛠️ 기술 스택

**코어:** React 19 + TypeScript + Vite  
**3D:** Three.js + React Three Fiber + Drei  
**상태관리:** Zustand (간단해서)  
**스타일링:** Tailwind CSS (유틸리티 올인)  
**데이터:** CSV는 PapaParse, 컬러는 D3

## 📁 프로젝트 구조

*우연히* Feature-Sliced Design을 따르게 됨:

```
src/
├── pages/     # Upload → Mapping → Viewer 플로우
├── widgets/   # 실제 UI 블록들
└── shared/    # 어디서나 재사용되는 것들
```

계획한 게 아니라 - 기능 추가하고 리팩토링하다 보니 이렇게 된 구조.

## 🚀 시작하기

```bash
git clone https://github.com/RyuDongHo/3D_Data_Scope.git
cd 3D_Data_Scope
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 열기

### 프로덕션 빌드

```bash
npm run build
npm run preview
```

## 💡 사용법

최소 3개의 숫자 컬럼이 있는 CSV를 업로드하세요. 3D로 탐색하세요. 그게 바이브입니다.

## 🎯 바이브 코딩 여정

**1단계: "일단 작동시키자"**  
→ 기본 CSV 업로드 + 3D 산점도  
→ 모든 게 하드코딩, 추상화 제로  
→ 근데 작동함!

**2단계: "이 코드 엉망이네"**  
→ Zustand 스토어로 리팩토링  
→ 컴포넌트를 위젯으로 분리  
→ 제대로 된 TypeScript 타입 추가  
→ 여전히 바이브 중, 그냥 좀 더 정리됨

**3단계: "쓸만하게 만들자"**  
→ 샘플 데이터 버튼 (UX 승리!)  
→ 영어 번역  
→ UI 정리  
→ 불필요한 패널 제거  
→ SEO 최적화

**현재 단계: "이거... 아키텍처인가?"**  
→ Feature-Sliced Design이 자연스럽게 생김  
→ 포괄적인 테스트 인프라 추가  
→ 88개 테스트 시나리오 계획  
→ 그래도 여전히 100% 바이브

## 🗺️ 미래의 바이브

아마 추가할 것들:
- 포인트 선택/검사
- PNG로 내보내기
- 필터링 컨트롤
- 클러스터링 알고리즘
- 더 많은 테마

안 할 수도. 느낌 오는 대로 보자구요.

## 💭 바이브 코딩에서 배운 것들

**잘 된 것:**
- 빠른 반복 주기
- 실제 사용에 의해 주도되는 기능
- 분석 마비 없음
- 유기적인 아키텍처 출현

**혼란스러웠던 것:**
- 엄청난 리팩토링
- TypeScript가 계속 싸움 걸어옴
- "어 이거 어떻게 작동하는 거지?"
- Git 히스토리가 난장판

**결론:** 10점 만점에 10점, 또 바이브 코딩 할 거임

## 👤 만든 사람

**RyuDongHo** - [@RyuDongHo](https://github.com/RyuDongHo)

---

**100% 바이브와 0% 계획으로 만들어졌습니다** ✨
