export type FightResultMethod = string | null | undefined;

export interface FighterRecord {
  wins: number;
  losses: number;
  draws: number;
  knockouts: number;
  rating: number;
}

export interface RatingDeltaInput {
  isWinner: boolean;
  isDraw: boolean;
  method: FightResultMethod;
}

export function normalizeWinnerId(winnerId: string | null | undefined): string | null {
  if (!winnerId || winnerId === 'none') {
    return null;
  }

  return winnerId;
}

export function computeRatingDelta(input: RatingDeltaInput): number {
  if (input.isDraw) {
    return 1;
  }

  if (input.isWinner) {
    const isKnockout = input.method === 'KO' || input.method === 'TKO';
    return isKnockout ? 5 : 3;
  }

  return -2;
}

export function applyFightToRecord(record: FighterRecord, input: RatingDeltaInput): FighterRecord {
  const next = { ...record };
  const delta = computeRatingDelta(input);

  if (input.isDraw) {
    next.draws += 1;
  } else if (input.isWinner) {
    next.wins += 1;
    if (input.method === 'KO' || input.method === 'TKO') {
      next.knockouts += 1;
    }
  } else {
    next.losses += 1;
  }

  next.rating = Math.max(0, next.rating + delta);
  return next;
}
