function distance(a: string, b: string) {
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const current = [i]
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + cost)
    }
    previous = current
  }
  return previous[b.length]
}

/** The closest candidate within a typo's reach of `word`, if any. */
export function suggest(word: string, candidates: Iterable<string>) {
  let best: string | undefined
  let bestDistance = word.length <= 4 ? 2 : 3
  for (const candidate of candidates) {
    const d = distance(word, candidate)
    if (d < bestDistance) {
      best = candidate
      bestDistance = d
    }
  }
  return best
}
