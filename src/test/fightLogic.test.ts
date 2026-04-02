import { describe, expect, it } from 'vitest';
import { applyFightToRecord, computeRatingDelta, normalizeWinnerId } from '@/lib/fightLogic';

describe('fightLogic', () => {
  it('normalizes winner value from form', () => {
    expect(normalizeWinnerId('none')).toBeNull();
    expect(normalizeWinnerId('')).toBeNull();
    expect(normalizeWinnerId(null)).toBeNull();
    expect(normalizeWinnerId('fighter-id')).toBe('fighter-id');
  });

  it('computes rating deltas by result and method', () => {
    expect(computeRatingDelta({ isWinner: true, isDraw: false, method: 'UD' })).toBe(3);
    expect(computeRatingDelta({ isWinner: true, isDraw: false, method: 'KO' })).toBe(5);
    expect(computeRatingDelta({ isWinner: false, isDraw: true, method: 'Draw' })).toBe(1);
    expect(computeRatingDelta({ isWinner: false, isDraw: false, method: 'UD' })).toBe(-2);
  });

  it('updates fighter record after KO win', () => {
    const updated = applyFightToRecord(
      { wins: 10, losses: 2, draws: 1, knockouts: 6, rating: 35 },
      { isWinner: true, isDraw: false, method: 'TKO' },
    );

    expect(updated).toEqual({
      wins: 11,
      losses: 2,
      draws: 1,
      knockouts: 7,
      rating: 40,
    });
  });
});
