# Automated Testing Plan
**3D Data Scope - TYPE A (Auto-Testable) Test Strategy**

> **Generated**: 2025-11-27  
> **Test Coverage Target**: 80%+  
> **Framework**: Vitest + React Testing Library + Playwright

---

## 🎯 Test Strategy Overview

### Test Pyramid Distribution
```
           /\
          /E2E\        10% - Full user workflows (Playwright)
         /------\
        /  INT   \     30% - Component integration (RTL)
       /----------\
      /   UNIT     \   60% - Pure functions, utilities (Vitest)
     /--------------\
```

---

## 📊 Module Classification

| Module | Type | Priority | Test Type | Est. Tests | Coverage Goal |
|--------|------|----------|-----------|------------|---------------|
| **csvParser** | Logic | P0 | Unit | 15 | 95% |
| **validation** | Logic | P0 | Unit | 12 | 95% |
| **dataTransform** | Logic | P0 | Unit | 10 | 90% |
| **math** | Logic | P1 | Unit | 8 | 90% |
| **useDataStore** | State | P0 | Integration | 8 | 85% |
| **useMappingStore** | State | P1 | Integration | 6 | 80% |
| **FileUploader** | Component | P1 | Integration | 10 | 75% |
| **AxisMapper** | Component | P1 | Integration | 8 | 75% |
| **SceneViewer** | Component | P2 | Integration | 5 | 60% |
| **User Workflow** | E2E | P0 | E2E | 6 | - |

**Total Estimated Tests**: 88  
**Estimated Effort**: 3-4 weeks (1 FTE)

---

## 🧪 Unit Tests - shared/lib

### 1. csvParser.ts

**Purpose**: Parse CSV files with PapaParse and extract column metadata

**Test Scenarios**:

```typescript
describe('csvParser', () => {
  describe('parseCSVFile', () => {
    test('should parse valid CSV with header', async () => {
      const file = createMockFile('name,age,height\nJohn,25,175.5\nJane,30,162.3');
      const result = await parseCSVFile(file);
      
      expect(result.columns).toEqual(['name', 'age', 'height']);
      expect(result.rows).toHaveLength(2);
      expect(result.rows[0]).toEqual({ name: 'John', age: 25, height: 175.5 });
    });
    
    test('should parse CSV without header', async () => {
      const file = createMockFile('1,2,3\n4,5,6');
      const result = await parseCSVFile(file);
      
      expect(result.columns).toEqual(['Column1', 'Column2', 'Column3']);
      expect(result.rows[0]).toEqual({ Column1: 1, Column2: 2, Column3: 3 });
    });
    
    test('should detect data types correctly', async () => {
      const file = createMockFile('name,age,score\nJohn,25,95.5\nJane,30,88.0');
      const result = await parseCSVFile(file);
      
      expect(result.dataTypes).toEqual({
        name: 'string',
        age: 'number',
        score: 'number'
      });
    });
    
    test('should handle empty cells', async () => {
      const file = createMockFile('x,y,z\n1,2,\n3,,5');
      const result = await parseCSVFile(file);
      
      expect(result.rows[0].z).toBeNull();
      expect(result.rows[1].y).toBeNull();
    });
    
    test('should reject file exceeding 50MB', async () => {
      const largeFile = createMockFile('x'.repeat(51 * 1024 * 1024));
      
      await expect(parseCSVFile(largeFile)).rejects.toThrow('File size exceeds 50MB');
    });
    
    test('should handle special characters in data', async () => {
      const file = createMockFile('name,value\n"Smith, John",1000\n"O\'Brien",2000');
      const result = await parseCSVFile(file);
      
      expect(result.rows[0].name).toBe('Smith, John');
      expect(result.rows[1].name).toBe("O'Brien");
    });
    
    test('should throw error for malformed CSV', async () => {
      const file = createMockFile('name,age\nJohn,25,extra\nJane');
      
      await expect(parseCSVFile(file)).rejects.toThrow('Malformed CSV');
    });
    
    test('should handle different line endings (CRLF, LF)', async () => {
      const fileCRLF = createMockFile('x,y\r\n1,2\r\n3,4');
      const fileLF = createMockFile('x,y\n1,2\n3,4');
      
      const resultCRLF = await parseCSVFile(fileCRLF);
      const resultLF = await parseCSVFile(fileLF);
      
      expect(resultCRLF.rows).toEqual(resultLF.rows);
    });
    
    test('should skip empty lines', async () => {
      const file = createMockFile('x,y,z\n1,2,3\n\n4,5,6\n');
      const result = await parseCSVFile(file);
      
      expect(result.rows).toHaveLength(2);
    });
    
    test('should handle UTF-8 encoded files', async () => {
      const file = createMockFile('name,city\n김철수,서울\n山田太郎,東京');
      const result = await parseCSVFile(file);
      
      expect(result.rows[0].name).toBe('김철수');
      expect(result.rows[1].city).toBe('東京');
    });
  });
  
  describe('inferDataType', () => {
    test('should detect integer as number', () => {
      expect(inferDataType(['1', '2', '3'])).toBe('number');
    });
    
    test('should detect float as number', () => {
      expect(inferDataType(['1.5', '2.7', '3.14'])).toBe('number');
    });
    
    test('should detect string type', () => {
      expect(inferDataType(['John', 'Jane', 'Bob'])).toBe('string');
    });
    
    test('should detect mixed type as string', () => {
      expect(inferDataType(['1', 'two', '3'])).toBe('string');
    });
    
    test('should handle empty array', () => {
      expect(inferDataType([])).toBe('string');
    });
  });
});
```

---

### 2. validation.ts

**Purpose**: Validate file properties and data structure

**Test Scenarios**:

```typescript
describe('validation', () => {
  describe('validateFile', () => {
    test('should accept valid CSV file under 50MB', () => {
      const file = createMockFile('x,y,z\n1,2,3', 'data.csv', 'text/csv');
      const result = validateFile(file);
      
      expect(result.valid).toBe(true);
    });
    
    test('should reject file exceeding 50MB', () => {
      const file = createMockFile('x'.repeat(51 * 1024 * 1024), 'large.csv');
      const result = validateFile(file);
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('50MB');
    });
    
    test('should reject non-CSV file extension', () => {
      const file = createMockFile('data', 'data.txt', 'text/plain');
      const result = validateFile(file);
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('.csv');
    });
    
    test('should accept .csv MIME type variants', () => {
      const variants = ['text/csv', 'application/csv', 'text/x-csv'];
      
      variants.forEach(mimeType => {
        const file = createMockFile('x,y\n1,2', 'data.csv', mimeType);
        expect(validateFile(file).valid).toBe(true);
      });
    });
  });
  
  describe('validateCSVStructure', () => {
    test('should accept CSV with 3+ numeric columns', () => {
      const data = [
        { x: 1, y: 2, z: 3, label: 'A' },
        { x: 4, y: 5, z: 6, label: 'B' }
      ];
      const result = validateCSVStructure(data, ['x', 'y', 'z', 'label']);
      
      expect(result.valid).toBe(true);
    });
    
    test('should reject CSV with less than 3 numeric columns', () => {
      const data = [
        { x: 1, y: 2, label: 'A' },
        { x: 3, y: 4, label: 'B' }
      ];
      const result = validateCSVStructure(data, ['x', 'y', 'label']);
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('3 numeric columns');
    });
    
    test('should reject empty dataset', () => {
      const result = validateCSVStructure([], []);
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('empty');
    });
    
    test('should detect non-numeric values in numeric columns', () => {
      const data = [
        { x: 1, y: 2, z: 'invalid' },
        { x: 4, y: 5, z: 6 }
      ];
      const result = validateCSVStructure(data, ['x', 'y', 'z']);
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('non-numeric');
    });
  });
  
  describe('validateAxisMapping', () => {
    test('should accept valid 3-axis mapping', () => {
      const mapping = { xAxis: 'age', yAxis: 'height', zAxis: 'weight' };
      const result = validateAxisMapping(mapping, ['age', 'height', 'weight']);
      
      expect(result.valid).toBe(true);
    });
    
    test('should reject duplicate axis selections', () => {
      const mapping = { xAxis: 'age', yAxis: 'age', zAxis: 'weight' };
      const result = validateAxisMapping(mapping, ['age', 'weight']);
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('duplicate');
    });
    
    test('should reject if not all axes selected', () => {
      const mapping = { xAxis: 'age', yAxis: null, zAxis: 'weight' };
      const result = validateAxisMapping(mapping, ['age', 'weight']);
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('all three axes');
    });
    
    test('should reject if axis column not in available columns', () => {
      const mapping = { xAxis: 'age', yAxis: 'height', zAxis: 'invalid' };
      const result = validateAxisMapping(mapping, ['age', 'height']);
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('not found');
    });
  });
});
```

---

### 3. dataTransform.ts

**Purpose**: Transform CSV data to 3D coordinates

**Test Scenarios**:

```typescript
describe('dataTransform', () => {
  describe('transformToPoints', () => {
    test('should convert CSV rows to Point3D array', () => {
      const data = [
        { age: 25, height: 175, weight: 70 },
        { age: 30, height: 160, weight: 55 }
      ];
      const mapping = { xAxis: 'age', yAxis: 'height', zAxis: 'weight' };
      
      const points = transformToPoints(data, mapping);
      
      expect(points).toHaveLength(2);
      expect(points[0]).toEqual({ x: 25, y: 175, z: 70 });
    });
    
    test('should normalize coordinates to [-1, 1] range', () => {
      const data = [
        { x: 0, y: 0, z: 0 },
        { x: 100, y: 200, z: 300 }
      ];
      const mapping = { xAxis: 'x', yAxis: 'y', zAxis: 'z' };
      
      const points = transformToPoints(data, mapping, { normalize: true });
      
      expect(points[0]).toEqual({ x: -1, y: -1, z: -1 });
      expect(points[1]).toEqual({ x: 1, y: 1, z: 1 });
    });
    
    test('should handle negative values', () => {
      const data = [
        { x: -10, y: -20, z: -30 },
        { x: 10, y: 20, z: 30 }
      ];
      const mapping = { xAxis: 'x', yAxis: 'y', zAxis: 'z' };
      
      const points = transformToPoints(data, mapping);
      
      expect(points[0].x).toBe(-10);
      expect(points[1].x).toBe(10);
    });
    
    test('should skip rows with missing values', () => {
      const data = [
        { x: 1, y: 2, z: 3 },
        { x: 4, y: null, z: 6 },
        { x: 7, y: 8, z: 9 }
      ];
      const mapping = { xAxis: 'x', yAxis: 'y', zAxis: 'z' };
      
      const points = transformToPoints(data, mapping, { skipInvalid: true });
      
      expect(points).toHaveLength(2);
    });
    
    test('should apply color encoding from colorBy column', () => {
      const data = [
        { x: 1, y: 2, z: 3, category: 'A' },
        { x: 4, y: 5, z: 6, category: 'B' }
      ];
      const mapping = { xAxis: 'x', yAxis: 'y', zAxis: 'z', colorBy: 'category' };
      
      const points = transformToPoints(data, mapping);
      
      expect(points[0].color).toBeDefined();
      expect(points[1].color).toBeDefined();
      expect(points[0].color).not.toBe(points[1].color);
    });
  });
  
  describe('calculateBounds', () => {
    test('should compute min/max for each axis', () => {
      const points = [
        { x: 1, y: 5, z: 10 },
        { x: 3, y: 2, z: 15 },
        { x: 2, y: 8, z: 12 }
      ];
      
      const bounds = calculateBounds(points);
      
      expect(bounds).toEqual({
        x: { min: 1, max: 3 },
        y: { min: 2, max: 8 },
        z: { min: 10, max: 15 }
      });
    });
    
    test('should handle single point', () => {
      const points = [{ x: 5, y: 10, z: 15 }];
      const bounds = calculateBounds(points);
      
      expect(bounds.x).toEqual({ min: 5, max: 5 });
    });
    
    test('should handle empty array', () => {
      expect(() => calculateBounds([])).toThrow('Empty point array');
    });
  });
});
```

---

## 🔗 Integration Tests - Zustand Stores

### 1. useDataStore

**Test Scenarios**:

```typescript
describe('useDataStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useDataStore.setState({ rawData: null, columns: [], dataTypes: {}, fileName: null });
  });
  
  test('should set data correctly', () => {
    const data = [{ x: 1, y: 2, z: 3 }];
    const filename = 'test.csv';
    
    act(() => {
      useDataStore.getState().setData(data, filename);
    });
    
    expect(useDataStore.getState().rawData).toEqual(data);
    expect(useDataStore.getState().fileName).toBe('test.csv');
  });
  
  test('should clear data', () => {
    act(() => {
      useDataStore.getState().setData([{ x: 1 }], 'test.csv');
      useDataStore.getState().clearData();
    });
    
    expect(useDataStore.getState().rawData).toBeNull();
    expect(useDataStore.getState().fileName).toBeNull();
  });
  
  test('should extract columns from data', () => {
    const data = [{ age: 25, height: 175, weight: 70 }];
    
    act(() => {
      useDataStore.getState().setData(data, 'test.csv');
    });
    
    expect(useDataStore.getState().columns).toEqual(['age', 'height', 'weight']);
  });
  
  test('should infer data types', () => {
    const data = [
      { name: 'John', age: 25, score: 95.5 },
      { name: 'Jane', age: 30, score: 88.0 }
    ];
    
    act(() => {
      useDataStore.getState().setData(data, 'test.csv');
    });
    
    expect(useDataStore.getState().dataTypes).toEqual({
      name: 'string',
      age: 'number',
      score: 'number'
    });
  });
  
  test('should overwrite previous data', () => {
    const data1 = [{ x: 1, y: 2 }];
    const data2 = [{ a: 10, b: 20 }];
    
    act(() => {
      useDataStore.getState().setData(data1, 'test1.csv');
      useDataStore.getState().setData(data2, 'test2.csv');
    });
    
    expect(useDataStore.getState().rawData).toEqual(data2);
    expect(useDataStore.getState().fileName).toBe('test2.csv');
  });
  
  test('should persist data across component re-renders', () => {
    const { result, rerender } = renderHook(() => useDataStore());
    const data = [{ x: 1, y: 2, z: 3 }];
    
    act(() => {
      result.current.setData(data, 'test.csv');
    });
    
    rerender();
    
    expect(result.current.rawData).toEqual(data);
  });
  
  test('should notify subscribers on state change', () => {
    const listener = vi.fn();
    useDataStore.subscribe(listener);
    
    act(() => {
      useDataStore.getState().setData([{ x: 1 }], 'test.csv');
    });
    
    expect(listener).toHaveBeenCalled();
  });
});
```

---

## 🧩 Component Integration Tests

### 1. FileUploader

**Test Scenarios**:

```typescript
describe('FileUploader', () => {
  test('should render upload area', () => {
    render(<FileUploader />);
    expect(screen.getByText(/choose file/i)).toBeInTheDocument();
  });
  
  test('should handle file selection via button', async () => {
    const user = userEvent.setup();
    render(<FileUploader />);
    
    const file = new File(['x,y,z\n1,2,3'], 'test.csv', { type: 'text/csv' });
    const input = screen.getByLabelText(/choose file/i);
    
    await user.upload(input, file);
    
    await waitFor(() => {
      expect(useDataStore.getState().rawData).toHaveLength(1);
    });
  });
  
  test('should handle drag and drop', async () => {
    render(<FileUploader />);
    const dropzone = screen.getByTestId('dropzone');
    
    const file = new File(['x,y,z\n1,2,3'], 'test.csv', { type: 'text/csv' });
    
    fireEvent.drop(dropzone, {
      dataTransfer: { files: [file] }
    });
    
    await waitFor(() => {
      expect(useDataStore.getState().fileName).toBe('test.csv');
    });
  });
  
  test('should show error for oversized file', async () => {
    render(<FileUploader />);
    
    const largeContent = 'x'.repeat(51 * 1024 * 1024);
    const file = new File([largeContent], 'large.csv');
    
    const input = screen.getByLabelText(/choose file/i);
    await userEvent.upload(input, file);
    
    expect(screen.getByText(/50MB/i)).toBeInTheDocument();
  });
  
  test('should show loading state during parsing', async () => {
    render(<FileUploader />);
    const file = new File(['x,y,z\n' + '1,2,3\n'.repeat(10000)], 'large.csv');
    
    const input = screen.getByLabelText(/choose file/i);
    await userEvent.upload(input, file);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
```

---

### 2. AxisMapper

**Test Scenarios**:

```typescript
describe('AxisMapper', () => {
  beforeEach(() => {
    useDataStore.setState({
      columns: ['age', 'height', 'weight', 'name'],
      dataTypes: { age: 'number', height: 'number', weight: 'number', name: 'string' }
    });
  });
  
  test('should render axis selectors', () => {
    render(<AxisMapper />);
    
    expect(screen.getByLabelText(/x axis/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/y axis/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/z axis/i)).toBeInTheDocument();
  });
  
  test('should only show numeric columns in dropdowns', () => {
    render(<AxisMapper />);
    
    const xSelect = screen.getByLabelText(/x axis/i);
    fireEvent.click(xSelect);
    
    expect(screen.getByText('age')).toBeInTheDocument();
    expect(screen.getByText('height')).toBeInTheDocument();
    expect(screen.queryByText('name')).not.toBeInTheDocument();
  });
  
  test('should prevent duplicate axis selection', async () => {
    const user = userEvent.setup();
    render(<AxisMapper />);
    
    await user.selectOptions(screen.getByLabelText(/x axis/i), 'age');
    
    const ySelect = screen.getByLabelText(/y axis/i);
    const options = within(ySelect).getAllByRole('option');
    
    expect(options.find(opt => opt.value === 'age')).toBeDisabled();
  });
  
  test('should enable "Next" button when all axes selected', async () => {
    const user = userEvent.setup();
    render(<AxisMapper />);
    
    await user.selectOptions(screen.getByLabelText(/x axis/i), 'age');
    await user.selectOptions(screen.getByLabelText(/y axis/i), 'height');
    await user.selectOptions(screen.getByLabelText(/z axis/i), 'weight');
    
    expect(screen.getByRole('button', { name: /next/i })).toBeEnabled();
  });
  
  test('should show validation error if mapping incomplete', async () => {
    const user = userEvent.setup();
    render(<AxisMapper />);
    
    await user.selectOptions(screen.getByLabelText(/x axis/i), 'age');
    await user.click(screen.getByRole('button', { name: /next/i }));
    
    expect(screen.getByText(/select all three axes/i)).toBeInTheDocument();
  });
});
```

---

## 🌐 E2E Tests - User Workflows

### Critical User Paths

```typescript
describe('E2E: Complete User Workflow', () => {
  test('Upload → Mapping → Visualization', async ({ page }) => {
    // 1. Navigate to app
    await page.goto('http://localhost:5173');
    
    // 2. Upload CSV file
    await page.setInputFiles('input[type="file"]', 'tests/fixtures/sample-data.csv');
    await page.waitForSelector('text=Data Preview');
    
    // 3. Verify data preview shows
    expect(await page.textContent('table')).toContain('point_id');
    
    // 4. Navigate to mapping
    await page.click('button:has-text("Next")');
    await page.waitForURL('**/mapping');
    
    // 5. Select axes
    await page.selectOption('select[aria-label="X Axis"]', 'x_coord');
    await page.selectOption('select[aria-label="Y Axis"]', 'y_coord');
    await page.selectOption('select[aria-label="Z Axis"]', 'z_coord');
    
    // 6. Navigate to viewer
    await page.click('button:has-text("View in 3D")');
    await page.waitForURL('**/viewer');
    
    // 7. Verify 3D canvas renders
    await page.waitForSelector('canvas');
    const canvas = page.locator('canvas');
    expect(await canvas.isVisible()).toBe(true);
    
    // 8. Verify point count matches data
    const pointCount = await page.textContent('[data-testid="point-count"]');
    expect(pointCount).toContain('52 points');
  });
  
  test('Sample Data Quick Start', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Click "Try with Sample Data"
    await page.click('button:has-text("Try with Sample Data")');
    
    // Should skip upload and go straight to mapping
    await page.waitForURL('**/mapping');
    expect(await page.textContent('body')).toContain('sample-data.csv');
  });
  
  test('Error: Invalid File Upload', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Try to upload non-CSV file
    await page.setInputFiles('input[type="file"]', 'tests/fixtures/invalid.txt');
    
    // Should show error message
    await page.waitForSelector('text=Only CSV files are allowed');
  });
  
  test('Navigation: Back Button Preserves Data', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Upload file
    await page.setInputFiles('input[type="file"]', 'tests/fixtures/sample-data.csv');
    await page.click('button:has-text("Next")');
    
    // Go to mapping
    await page.waitForURL('**/mapping');
    await page.selectOption('select[aria-label="X Axis"]', 'x_coord');
    
    // Go back
    await page.click('button:has-text("Back")');
    await page.waitForURL('/');
    
    // Data preview should still be visible
    expect(await page.isVisible('table')).toBe(true);
  });
  
  test('3D Viewer: Camera Controls', async ({ page }) => {
    await page.goto('http://localhost:5173/viewer', {
      // Pre-load with sample data via state injection
      storageState: 'tests/fixtures/with-data.json'
    });
    
    const canvas = page.locator('canvas');
    
    // Drag to rotate
    await canvas.dragTo(canvas, {
      sourcePosition: { x: 100, y: 100 },
      targetPosition: { x: 200, y: 200 }
    });
    
    // Verify camera position changed (check via data attribute)
    const cameraPos = await page.getAttribute('[data-testid="camera-position"]', 'data-value');
    expect(cameraPos).not.toBe('[0, 10, 10]'); // Default position
  });
  
  test('Performance: 50K Points Load Time', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    const startTime = Date.now();
    
    await page.setInputFiles('input[type="file"]', 'tests/fixtures/50k-points.csv');
    await page.click('button:has-text("Next")');
    await page.selectOption('select[aria-label="X Axis"]', 'x');
    await page.selectOption('select[aria-label="Y Axis"]', 'y');
    await page.selectOption('select[aria-label="Z Axis"]', 'z');
    await page.click('button:has-text("View in 3D")');
    
    // Wait for canvas to render
    await page.waitForSelector('canvas');
    await page.waitForTimeout(500); // Allow WebGL init
    
    const loadTime = Date.now() - startTime;
    
    // NFR-02: 10K points in 2s, so 50K should be < 10s
    expect(loadTime).toBeLessThan(10000);
  });
});
```

---

## 📦 Test Setup

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.config.*',
        '**/*.d.ts',
        '**/types/*'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

### tests/setup.ts

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Three.js (heavy library)
vi.mock('three', () => ({
  Scene: vi.fn(),
  PerspectiveCamera: vi.fn(),
  WebGLRenderer: vi.fn(() => ({
    setSize: vi.fn(),
    render: vi.fn(),
  })),
}));

// Mock R3F Canvas
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: any) => <div data-testid="r3f-canvas">{children}</div>,
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

---

## 🚀 Execution Commands

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test csvParser.test.ts

# Run E2E tests
npm run test:e2e

# Run E2E in UI mode
npm run test:e2e:ui
```

---

## 📈 Success Criteria

### Coverage Goals
- ✅ **Unit Tests**: 90%+ coverage for shared/lib
- ✅ **Integration Tests**: 80%+ coverage for stores and widgets
- ✅ **E2E Tests**: All critical user paths passing
- ✅ **Performance Tests**: NFR-01, NFR-02, NFR-03 validated

### Quality Gates
- ❌ **Block Merge**: If coverage drops below 75%
- ❌ **Block Deploy**: If any E2E test fails
- ⚠️ **Warning**: If test execution time > 5 minutes

---

## 📝 Notes

### Test Data Fixtures
```
tests/fixtures/
├── sample-data.csv          # 52 rows, valid structure
├── no-header.csv            # CSV without header row
├── invalid.txt              # Non-CSV file
├── malformed.csv            # Broken CSV structure
├── 50k-points.csv           # Large dataset for performance
├── unicode.csv              # UTF-8 characters
└── with-data.json           # Playwright storage state
```

### Continuous Integration
```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run test:e2e
      - uses: codecov/codecov-action@v3
```

---

**Plan Completed**: 2025-11-27  
**Next Steps**: Begin implementation with highest priority (csvParser unit tests)
