import { describe, it, expect } from 'vitest';
import {
  validateFields,
  validateFile,
  MAX_FILE_SIZE,
  NAME_MAX,
  MESSAGE_MAX,
} from './validation.js';

describe('validateFields', () => {
  it('passes and trims valid input', () => {
    const result = validateFields({ name: '  Alice  ', message: '  Hello  ' });
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ name: 'Alice', message: 'Hello' });
    expect(result.errors).toEqual({});
  });

  it('reports missing name', () => {
    const result = validateFields({ name: '', message: 'Hello' });
    expect(result.success).toBe(false);
    expect(result.errors.name).toMatch(/required/i);
    expect(result.errors.message).toBeUndefined();
  });

  it('reports missing message', () => {
    const result = validateFields({ name: 'Alice', message: '   ' });
    expect(result.success).toBe(false);
    expect(result.errors.message).toMatch(/required/i);
  });

  it('reports both missing fields independently', () => {
    const result = validateFields({ name: '', message: '' });
    expect(result.success).toBe(false);
    expect(result.errors.name).toBeTruthy();
    expect(result.errors.message).toBeTruthy();
  });

  it('rejects oversized name', () => {
    const result = validateFields({
      name: 'x'.repeat(NAME_MAX + 1),
      message: 'ok',
    });
    expect(result.success).toBe(false);
    expect(result.errors.name).toMatch(/at most/i);
  });

  it('rejects oversized message', () => {
    const result = validateFields({
      name: 'Alice',
      message: 'x'.repeat(MESSAGE_MAX + 1),
    });
    expect(result.success).toBe(false);
    expect(result.errors.message).toMatch(/at most/i);
  });
});

describe('validateFile', () => {
  it('returns null for no file', () => {
    expect(validateFile(null)).toBeNull();
    expect(validateFile(undefined)).toBeNull();
  });

  it('returns null for a file within the size limit', () => {
    expect(validateFile({ size: 1024 })).toBeNull();
    expect(validateFile({ size: MAX_FILE_SIZE })).toBeNull();
  });

  it('returns an error message for an oversized file', () => {
    expect(validateFile({ size: MAX_FILE_SIZE + 1 })).toMatch(/at most/i);
  });
});
