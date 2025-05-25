/**
 * Simple test for cookie functions
 */
import { setCookie, getCookie, removeCookie } from '../shared/utils/cookieUtils';

describe('Cookie Utilities', () => {
  // Mock document.cookie
  const originalDocumentCookie = Object.getOwnPropertyDescriptor(document, 'cookie');
  let cookieJar = '';

  beforeEach(() => {
    cookieJar = '';
    
    // Mock the document.cookie
    Object.defineProperty(document, 'cookie', {
      get: jest.fn(() => cookieJar),
      set: jest.fn(value => {
        cookieJar = value;
      }),
      configurable: true
    });
  });

  afterAll(() => {
    // Restore the original document.cookie property
    if (originalDocumentCookie) {
      Object.defineProperty(document, 'cookie', originalDocumentCookie);
    }
  });

  test('should set and get a string cookie', () => {
    setCookie('test', 'value');
    expect(getCookie('test')).toBe('value');
  });

  test('should set and get an object cookie', () => {
    const testObject = { name: 'test', value: 123 };
    setCookie('testObj', testObject);
    expect(getCookie('testObj')).toEqual(testObject);
  });

  test('should remove a cookie', () => {
    setCookie('test', 'value');
    expect(getCookie('test')).toBe('value');
    
    removeCookie('test');
    expect(getCookie('test')).toBeNull();
  });

  test('should handle special characters', () => {
    const specialString = 'test;,/?:@&=+$#';
    setCookie('special', specialString);
    expect(getCookie('special')).toBe(specialString);
  });
}); 