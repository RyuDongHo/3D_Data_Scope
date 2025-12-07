import { describe, test, expect } from 'vitest';
import { parseCSVFile } from '@/shared/lib/csvParser';
import { createMockFile } from '../setup';

describe('csvParser', () => {
  describe('parseCSVFile', () => {
    test('should parse valid CSV with header', async () => {
      const content = 'name,age,height\nJohn,25,175.5\nJane,30,162.3';
      const file = createMockFile(content);
      
      const result = await parseCSVFile(file);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.columns).toHaveLength(3);
      expect(result.data?.rows).toHaveLength(2);
      expect(result.data?.rows[0]).toHaveProperty('name', 'John');
      expect(result.data?.rows[0]).toHaveProperty('age', 25);
      expect(result.data?.rows[0]).toHaveProperty('height', 175.5);
    });

    test('should detect data types correctly', async () => {
      const content = 'name,age,score\nJohn,25,95.5\nJane,30,88.0';
      const file = createMockFile(content);
      
      const result = await parseCSVFile(file);
      
      expect(result.success).toBe(true);
      const numberColumns = result.data?.columns.filter((c: { type: string }) => c.type === 'number');
      const stringColumns = result.data?.columns.filter((c: { type: string }) => c.type === 'string');
      
      expect(numberColumns).toHaveLength(2); // age, score
      expect(stringColumns).toHaveLength(1); // name
    });

    test('should handle empty cells', async () => {
      const content = 'x,y,z\n1,2,\n3,,5';
      const file = createMockFile(content);
      
      const result = await parseCSVFile(file);
      
      expect(result.success).toBe(true);
      expect(result.data?.rows[0].z).toBeNull();
      expect(result.data?.rows[1].y).toBeNull();
    });

    test('should skip empty lines', async () => {
      const content = 'x,y,z\n1,2,3\n\n4,5,6\n';
      const file = createMockFile(content);
      
      const result = await parseCSVFile(file);
      
      expect(result.success).toBe(true);
      expect(result.data?.rows).toHaveLength(2);
    });

    test('should handle special characters in data', async () => {
      const content = 'name,value\n"Smith, John",1000\n"O\'Brien",2000';
      const file = createMockFile(content);
      
      const result = await parseCSVFile(file);
      
      expect(result.success).toBe(true);
      expect(result.data?.rows[0].name).toBe('Smith, John');
      expect(result.data?.rows[1].name).toBe("O'Brien");
    });

    test('should handle different line endings', async () => {
      const contentCRLF = 'x,y\r\n1,2\r\n3,4';
      const contentLF = 'x,y\n1,2\n3,4';
      
      const fileCRLF = createMockFile(contentCRLF);
      const fileLF = createMockFile(contentLF);
      
      const resultCRLF = await parseCSVFile(fileCRLF);
      const resultLF = await parseCSVFile(fileLF);
      
      expect(resultCRLF.success).toBe(true);
      expect(resultLF.success).toBe(true);
      expect(resultCRLF.data?.rows).toHaveLength(2);
      expect(resultLF.data?.rows).toHaveLength(2);
    });

    test('should handle UTF-8 encoded files', async () => {
      const content = 'name,city\n김철수,서울\n山田太郎,東京';
      const file = createMockFile(content);
      
      const result = await parseCSVFile(file);
      
      expect(result.success).toBe(true);
      expect(result.data?.rows[0].name).toBe('김철수');
      expect(result.data?.rows[1].city).toBe('東京');
    });

    test('should reject empty CSV', async () => {
      const content = 'x,y,z\n';
      const file = createMockFile(content);
      
      const result = await parseCSVFile(file);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('비어있습니다');
    });

    test('should handle CSV with only header', async () => {
      const content = 'x,y,z';
      const file = createMockFile(content);
      
      const result = await parseCSVFile(file);
      
      expect(result.success).toBe(false);
    });

    test('should parse large CSV efficiently', async () => {
      const headers = 'x,y,z,label\n';
      const rows = Array.from({ length: 1000 }, (_, i) => 
        `${i},${i * 2},${i * 3},Label${i}`
      ).join('\n');
      const file = createMockFile(headers + rows);
      
      const startTime = Date.now();
      const result = await parseCSVFile(file);
      const elapsed = Date.now() - startTime;
      
      expect(result.success).toBe(true);
      expect(result.data?.rows).toHaveLength(1000);
      expect(elapsed).toBeLessThan(1000); // Should parse in < 1 second
    });

    test('should handle numeric values with different formats', async () => {
      const content = 'id,value\n1,1\n2,1.5\n3,1.0\n4,-5\n5,0';
      const file = createMockFile(content);
      
      const result = await parseCSVFile(file);
      
      if (!result.success) {
        console.log('Parse error:', result.error);
      }
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.rows.every((row: Record<string, unknown>) => typeof row.value === 'number')).toBe(true);
        expect(result.data.rows.every((row: Record<string, unknown>) => typeof row.id === 'number')).toBe(true);
      }
    });

    test('should handle mixed numeric and string columns', async () => {
      const content = 'id,name,age,city\n1,John,25,NYC\n2,Jane,30,LA';
      const file = createMockFile(content);
      
      const result = await parseCSVFile(file);
      
      expect(result.success).toBe(true);
      const numericCols = result.data?.columns.filter((c: { type: string }) => c.type === 'number').map((c: { name: string }) => c.name);
      const stringCols = result.data?.columns.filter((c: { type: string }) => c.type === 'string').map((c: { name: string }) => c.name);
      
      expect(numericCols).toContain('id');
      expect(numericCols).toContain('age');
      expect(stringCols).toContain('name');
      expect(stringCols).toContain('city');
    });

    test('should return column statistics', async () => {
      const content = 'age,score\n25,90\n30,85\n28,95';
      const file = createMockFile(content);
      
      const result = await parseCSVFile(file);
      
      expect(result.success).toBe(true);
      if (result.success) {
        const ageCol = result.data.columns.find((c: { name: string }) => c.name === 'age');
        
        expect(ageCol?.minValue).toBe(25);
        expect(ageCol?.maxValue).toBe(30);
        expect(ageCol?.uniqueCount).toBe(3);
      }
    });
  });
});
