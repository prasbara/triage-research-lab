// Seeded pseudo-random number generator (Mulberry32)
export function seededRandom(seed: number) {
  let s = seed >>> 0
  return function() {
    s += 0x6D2B79F5
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function shuffleArray<T>(array: T[], seed: number): T[] {
  const rng = seededRandom(seed)
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export interface AssignmentConfig {
  cases: string[] // case IDs
  participants: string[] // participant IDs
  seed: number
  balanceBy?: 'method' // ensure equal manual/ai_assisted
}

export interface Assignment {
  participant_id: string
  case_id: string
  method: 'manual' | 'ai_assisted'
  task_order: number
  condition_block: number
}

export function generateExperimentAssignments(config: AssignmentConfig): Assignment[] {
  const { cases, participants, seed } = config
  const assignments: Assignment[] = []

  // Each participant gets all cases, half manual, half AI-assisted
  // Counterbalanced: half participants do manual first, other half AI first
  const shuffledCases = shuffleArray(cases, seed)
  const halfSize = Math.ceil(shuffledCases.length / 2)

  participants.forEach((participantId, pIdx) => {
    const participantSeed = seed + pIdx * 1000
    const rng = seededRandom(participantSeed)
    
    // Determine order: even participants do manual first, odd do AI first
    const manualFirst = pIdx % 2 === 0
    
    // Block 1
    const block1Cases = shuffleArray(shuffledCases.slice(0, halfSize), participantSeed)
    // Block 2
    const block2Cases = shuffleArray(shuffledCases.slice(halfSize), participantSeed + 1)

    let taskOrder = 1

    // Block 1
    block1Cases.forEach(caseId => {
      assignments.push({
        participant_id: participantId,
        case_id: caseId,
        method: manualFirst ? 'manual' : 'ai_assisted',
        task_order: taskOrder++,
        condition_block: 1,
      })
    })

    // Block 2
    block2Cases.forEach(caseId => {
      assignments.push({
        participant_id: participantId,
        case_id: caseId,
        method: manualFirst ? 'ai_assisted' : 'manual',
        task_order: taskOrder++,
        condition_block: 2,
      })
    })

    void rng // suppress unused warning
  })

  return assignments
}
