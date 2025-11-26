# Agent Summary: shared

## 1. Responsibility
Foundation layer providing reusable UI components, utility functions, custom hooks, TypeScript types, and global state management. Serves all upper layers (app, pages, widgets) with common functionality to prevent code duplication.

## 2. Inputs / Outputs
### Inputs
- Configuration for UI components (props, themes)
- Raw data for utility processing
- State update actions from upper layers

### Outputs
- Reusable UI components (Button, Slider, Modal, etc.)
- Processed data from utility functions
- Type definitions for type safety
- Global state via Zustand stores
- Custom hooks for common patterns

## 3. Internal Structure

### 📁 shared/ui/ - Reusable UI Components
**Purpose**: Atomic, presentation-only components used across the application

#### Planned Components (Not Yet Implemented)
- **Button/Button.tsx**: Primary, secondary, ghost variants with loading states
- **Slider/Slider.tsx**: Range and single-value sliders
- **ColorPicker/ColorPicker.tsx**: HSL/RGB color selection
- **Tooltip/Tooltip.tsx**: Hover tooltips with configurable positions
- **Modal/Modal.tsx**: Dialog overlays with backdrop
- **Spinner/Spinner.tsx**: Loading indicators

**Design Pattern**: Headless UI with Tailwind styling, accessible (ARIA), composable

---

### 📁 shared/lib/ - Utility Functions
**Purpose**: Pure functions for data processing, validation, and algorithms

#### Planned Modules (Not Yet Implemented)
- **validation.ts**: File and data validation
  - `validateCSVFile(file: File): ValidationResult`
  - `validateColumnMapping(mapping: AxisMapping): boolean`
  
- **csvParser.ts**: CSV parsing wrapper
  - `parseCSV(file: File): Promise<ParsedData>`
  - Uses PapaParse with error handling
  
- **dataTransform.ts**: Data transformation utilities
  - `normalizeData(data: number[]): number[]`
  - `transformToPoints(data: CSVData, mapping: AxisMapping): Point3D[]`
  
- **math.ts**: Mathematical operations
  - `calculateStatistics(data: number[]): Stats`
  - `euclideanDistance(p1: Point3D, p2: Point3D): number`
  
- **outlierDetector.ts**: Outlier detection algorithms
  - `detectOutliersIQR(data: number[]): number[]`
  - `detectOutliersZScore(data: number[], threshold: number): number[]`
  
- **clustering.ts**: Clustering algorithms
  - `kMeansClustering(points: Point3D[], k: number): ClusterResult`
  - `dbscan(points: Point3D[], epsilon: number, minPoints: number): ClusterResult`

---

### 📁 shared/hooks/ - Custom React Hooks
**Purpose**: Reusable stateful logic patterns

#### Planned Hooks (Not Yet Implemented)
- **useDebounce.ts**: Debounce values (for filters, search)
  - `useDebounce<T>(value: T, delay: number): T`
  
- **useThrottle.ts**: Throttle function calls (for scroll, resize)
  - `useThrottle<T>(callback: Function, delay: number): Function`
  
- **useLocalStorage.ts**: Persist state to localStorage
  - `useLocalStorage<T>(key: string, initial: T): [T, Dispatch<T>]`

---

### 📁 shared/types/ - TypeScript Definitions
**Purpose**: Type safety across the application

#### Planned Type Files (Not Yet Implemented)
- **data.types.ts**: CSV data structures
  ```typescript
  type CSVRow = Record<string, string | number>
  type CSVData = {
    rows: CSVRow[]
    columns: string[]
    dataTypes: Record<string, 'number' | 'string'>
  }
  type ParsedData = CSVData & {
    rowCount: number
    columnCount: number
  }
  ```

- **mapping.types.ts**: Axis mapping structures
  ```typescript
  type AxisMapping = {
    xAxis: string
    yAxis: string
    zAxis: string
    colorBy: string | null
  }
  type ValidationResult = {
    valid: boolean
    error?: string
  }
  ```

- **viewer.types.ts**: 3D visualization types
  ```typescript
  type Point3D = { x: number; y: number; z: number; color?: string }
  type CameraSettings = {
    position: [number, number, number]
    target: [number, number, number]
  }
  type FilterRange = { min: number; max: number }
  type ViewerSettings = {
    pointSize: number
    backgroundColor: string
    showGrid: boolean
    showAxes: boolean
  }
  ```

---

### 📁 shared/zustand/ - Global State Management
**Purpose**: Application-wide state with Zustand

#### Planned Stores (Not Yet Implemented)

##### **useDataStore.ts**
```typescript
interface DataState {
  rawData: CSVRow[] | null
  columns: string[]
  dataTypes: Record<string, 'number' | 'string'>
  statistics: Record<string, Stats>
  setData: (data: ParsedData) => void
  clearData: () => void
}
```

##### **useMappingStore.ts**
```typescript
interface MappingState {
  xAxis: string | null
  yAxis: string | null
  zAxis: string | null
  colorBy: string | null
  setAxis: (axis: 'x' | 'y' | 'z', column: string) => void
  setColorBy: (column: string | null) => void
  resetMapping: () => void
  isValid: () => boolean
}
```

##### **useViewerStore.ts**
```typescript
interface ViewerState {
  cameraPosition: [number, number, number]
  pointSize: number
  backgroundColor: string
  pointColor: string
  showGrid: boolean
  showAxes: boolean
  filters: {
    xRange: [number, number]
    yRange: [number, number]
    zRange: [number, number]
  }
  // ... setter methods
}
```

##### **useUIStore.ts**
```typescript
interface UIState {
  isFilterPanelOpen: boolean
  isCustomizationPanelOpen: boolean
  activeModal: string | null
  // ... toggle methods
}
```

---

## 4. Dependencies

### Internal Modules
- Self-contained (no dependencies on other src/ folders per FSD rules)

### External Modules
- **UI Components**:
  - `@radix-ui/react-menubar`, `@radix-ui/react-slot` - Accessible primitives
  - `class-variance-authority`, `clsx`, `tailwind-merge` - Styling utilities
  - `lucide-react` - Icons
  
- **Utilities**:
  - `papaparse` - CSV parsing (to be installed)
  - `d3-scale`, `d3-color` - Color schemes and scaling
  
- **State Management**:
  - `zustand` - Lightweight state management

---

## 5. Inspection Findings (Checklist-Based)

### Functional Issues
- ❌ **Completely Unimplemented**: All modules exist as empty directories
- ❌ **Missing Types**: No TypeScript definitions created
- ❌ **No Stores**: Zustand stores not initialized
- ❌ **No UI Components**: No shared components built
- ❌ **No Utilities**: All helper functions missing

### Design Issues
- ✅ **Good Architecture**: FSD-compliant structure planned
- ⚠️ **Missing Design System**: No documented color palette, spacing scale, typography
- ⚠️ **Accessibility Unclear**: ARIA implementation not specified
- ⚠️ **No Component Library**: Should consider using shadcn/ui or similar

### Maintainability Risks
- **Zero Implementation**: Highest priority layer is completely missing
- **Blocking Layer**: All upper layers depend on this foundation
- **Scope Creep Risk**: Shared layer can grow uncontrollably without discipline

### Prototype Traces
- 🔴 **Pure TODO**: Entire layer is unimplemented
- 📝 **Well-Documented**: CLAUDE.md provides clear specifications

### Recommended Refactoring

#### Phase 1 - Critical Path (Week 1)
**Priority: 🔴 BLOCKING**
1. **Types** (4-6 hours):
   - Create data.types.ts with CSV structures
   - Create mapping.types.ts
   - Create viewer.types.ts

2. **Zustand Stores** (6-8 hours):
   - Implement useDataStore
   - Implement useMappingStore
   - Implement useViewerStore
   - Implement useUIStore
   - Add devtools middleware

3. **Core Utilities** (8-10 hours):
   - Implement csvParser.ts with PapaParse
   - Implement validation.ts
   - Implement dataTransform.ts
   - Implement math.ts (statistics)

#### Phase 2 - UI Foundation (Week 2)
**Priority: 🟠 HIGH**
4. **Basic UI Components** (10-12 hours):
   - Button with variants
   - Slider (range and single)
   - Modal
   - Spinner
   - Tooltip

5. **Custom Hooks** (4-6 hours):
   - useDebounce
   - useThrottle
   - useLocalStorage

#### Phase 3 - Advanced Features (Week 3)
**Priority: 🟡 MEDIUM**
6. **Advanced Utilities** (12-16 hours):
   - Outlier detection algorithms
   - Clustering algorithms (K-means, DBSCAN)
   - Color scheme generation

7. **Advanced UI** (6-8 hours):
   - ColorPicker with presets
   - Advanced Slider features
   - Toast notifications

---

## 6. Testability

### Testing Strategy

#### Unit Tests (Critical)
- **Utilities**: All pure functions in lib/ should have 100% coverage
  - CSV parsing edge cases (empty files, malformed data)
  - Math functions (normalization, statistics)
  - Validation logic (file types, sizes, mappings)
  
- **Zustand Stores**: Test state mutations
  - Initial state
  - Each action/setter
  - Computed properties
  - State persistence

#### Component Tests
- **UI Components**: Visual regression and interaction tests
  - Button variants render correctly
  - Slider value updates
  - Modal open/close behavior
  - Accessibility (keyboard navigation, screen readers)

#### Integration Tests
- **Hooks**: Test with React Testing Library
  - useDebounce delays updates correctly
  - useLocalStorage persists and retrieves
  - useThrottle limits function calls

### Test Execution
```bash
npm run test                 # Run all tests
npm run test:coverage        # Generate coverage report
npm run test:ui              # Test UI components
npm run test:watch           # Watch mode for TDD
```

### Coverage Goals
- **Utilities (lib/)**: 95%+ coverage (critical business logic)
- **Stores (zustand/)**: 90%+ coverage
- **Hooks**: 85%+ coverage
- **UI Components**: 80%+ coverage (focus on interactions)

### Test Examples
```typescript
// lib/validation.test.ts
describe('validateCSVFile', () => {
  it('should accept valid CSV files', () => {
    const file = new File(['data'], 'test.csv', { type: 'text/csv' })
    expect(validateCSVFile(file).valid).toBe(true)
  })
  
  it('should reject files over 50MB', () => {
    const largeFile = new File([new ArrayBuffer(51 * 1024 * 1024)], 'large.csv')
    const result = validateCSVFile(largeFile)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('50MB')
  })
})

// zustand/useDataStore.test.ts
describe('useDataStore', () => {
  it('should store and retrieve data', () => {
    const { result } = renderHook(() => useDataStore())
    act(() => {
      result.current.setData({ rows: [{ a: 1 }], columns: ['a'], dataTypes: { a: 'number' }})
    })
    expect(result.current.rawData).toHaveLength(1)
  })
})
```

---

## SDLC Alignment

### Reverse-Engineered Requirements

#### Data Management
- **REQ-SH-001**: Parse CSV files up to 50MB
- **REQ-SH-002**: Infer column data types (numeric vs string)
- **REQ-SH-003**: Store parsed data in memory-efficient structure
- **REQ-SH-004**: Calculate column statistics (min, max, mean, std dev)

#### Validation
- **REQ-SH-005**: Validate file size (<50MB)
- **REQ-SH-006**: Validate file type (.csv only)
- **REQ-SH-007**: Validate axis mappings (3 distinct numeric columns)

#### Data Transformation
- **REQ-SH-008**: Normalize data to [-1, 1] range
- **REQ-SH-009**: Transform CSV columns to 3D coordinates
- **REQ-SH-010**: Apply color encoding to points

#### Analysis
- **REQ-SH-011**: Detect outliers using IQR method
- **REQ-SH-012**: Detect outliers using Z-score method
- **REQ-SH-013**: Perform K-means clustering
- **REQ-SH-014**: Perform DBSCAN clustering

#### State Management
- **REQ-SH-015**: Provide global data store
- **REQ-SH-016**: Provide mapping configuration store
- **REQ-SH-017**: Provide viewer settings store
- **REQ-SH-018**: Provide UI state store
- **REQ-SH-019**: Persist settings to localStorage

#### UI Components
- **REQ-SH-020**: Provide accessible, reusable UI components
- **REQ-SH-021**: Support dark/light themes
- **REQ-SH-022**: Follow design system consistently

### Implementation Status
- Requirements: ✅ Defined in CLAUDE.md
- Design: ✅ Architecture documented
- Implementation: ❌ 0% complete
- Testing: ❌ No tests
- Documentation: ✅ Comprehensive specs in CLAUDE.md

### Gap Analysis
**Critical Gap**: Entire foundation layer is missing. This blocks all feature development.

---

## Implementation Priority: 🔴 CRITICAL - BLOCKING

This layer MUST be implemented first as it's a dependency for all other layers.

### Recommended Implementation Order
1. **Types** → Enables type-safe development from start
2. **Stores** → Enables state management for pages
3. **Validation & CSV Parser** → Enables UploadPage
4. **Data Transform** → Enables MappingPage
5. **Math Utilities** → Enables ViewerPage
6. **UI Components** → Enables widget development
7. **Hooks** → Enables optimization
8. **Advanced Utilities** (outliers, clustering) → Enables analysis features

### Total Estimate: 50-70 hours (1-2 weeks with 1-2 developers)

### Blockers
- None (foundation layer)

### Risks
- **Scope Creep**: Resist adding non-essential utilities
- **Over-Abstraction**: Keep components simple, not overly generic
- **Performance**: CSV parsing and data transformation must be optimized from start

### Success Criteria
- ✅ All types defined with JSDoc comments
- ✅ All 4 Zustand stores functional with devtools
- ✅ CSV parsing handles 50MB files in <2 seconds
- ✅ Data transformation is performant for 100K rows
- ✅ 90%+ test coverage for utilities
- ✅ UI components are accessible (WCAG AA)
- ✅ Storybook or similar for component documentation
