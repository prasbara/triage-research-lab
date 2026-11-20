/**
 * Mulberry32 Pseudo-Random Number Generator (PRNG)
 * 32-bit state generator for reproducible experimental randomization
 */
export function createMulberry32(seed: number) {
  let s = seed >>> 0
  return function () {
    let t = (s += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Fisher-Yates shuffle with deterministic seeded PRNG
 */
export function seededShuffle<T>(array: T[], seed: number): T[] {
  const result = [...array]
  const rng = createMulberry32(seed)
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Counterbalanced experimental block allocation (Latin Square Design)
 * Allocates cases to either manual (M) or AI-assisted (AI) method
 * avoiding order effects and carryover bias.
 */
export interface BalancedAssignmentPlan<T> {
  participantId: string
  block1: { method: 'manual' | 'ai_assisted'; items: T[] }
  block2: { method: 'manual' | 'ai_assisted'; items: T[] }
}

export function generateCounterbalancedAssignment<T>(
  participantId: string,
  participantIndex: number,
  cases: T[],
  seed = 42
): BalancedAssignmentPlan<T> {
  const randomizedCases = seededShuffle(cases, seed + participantIndex * 7919)
  const half = Math.ceil(randomizedCases.length / 2)
  const setA = randomizedCases.slice(0, half)
  const setB = randomizedCases.slice(half)

  // Even index: Group A (Manual first, then AI)
  // Odd index:  Group B (AI first, then Manual)
  const isGroupA = participantIndex % 2 === 0

  return {
    participantId,
    block1: {
      method: isGroupA ? 'manual' : 'ai_assisted',
      items: isGroupA ? setA : setB,
    },
    block2: {
      method: isGroupA ? 'ai_assisted' : 'manual',
      items: isGroupA ? setB : setA,
    },
  }
}

export function generateParticipantCode(index?: number): string {
  const num = index !== undefined ? String(index + 1).padStart(3, '0') : String(Math.floor(Math.random() * 900) + 100)
  return `P${num}`
}

export function generateSessionCode(): string {
  const year = new Date().getFullYear()
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `SES-${year}-${rand}`
}
