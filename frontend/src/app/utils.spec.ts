import { roundCurrency } from './utils';

describe('Utils', () => {
  it('should be equal', () => {
    expect(roundCurrency(500.49)).toBe('500,5 Kč');
  });
});
