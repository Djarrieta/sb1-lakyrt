import { getDate } from '../getDate';
import { formatPercent } from '../formatPercent';

describe('getDate', () => {
  test('returns correct date object for number input', () => {
    const timestamp = 1625097600000; // July 1, 2021 00:00:00 UTC
    const result = getDate(timestamp);
    expect(result.dateMs).toBe(timestamp);
    expect(result.dateString).toBe('2021 07 01 00:00:00');
    expect(result.shortDateString).toBe('2021-07-01');
  });

  test('returns correct date object for string input', () => {
    const dateString = '2021 07 01 12:30:45';
    const result = getDate(dateString);
    expect(result.dateString).toBe(dateString);
    expect(result.shortDateString).toBe('2021-07-01');
  });

  test('returns correct date object for short date string input', () => {
    const shortDateString = '2021-07-01';
    const result = getDate(shortDateString);
    expect(result.shortDateString).toBe(shortDateString);
    expect(result.dateString).toBe('2021 07 01 00:00:00');
  });

  test('returns current date when no input is provided', () => {
    const now = new Date();
    const result = getDate();
    expect(result.date.getFullYear()).toBe(now.getFullYear());
    expect(result.date.getMonth()).toBe(now.getMonth());
    expect(result.date.getDate()).toBe(now.getDate());
  });
});

describe('formatPercent', () => {
  test('formats decimal to percentage string', () => {
    expect(formatPercent(0.1234)).toBe('12.34%');
    expect(formatPercent(0.0567)).toBe('5.67%');
    expect(formatPercent(1)).toBe('100.00%');
    expect(formatPercent(0)).toBe('0.00%');
  });
});