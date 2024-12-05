type ChangedChar = {
  index: number
  from: string | null
  to: string | null
  trend: 'up' | 'down'
}

export const formatter = new Intl.NumberFormat('en-us', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})
export const getChangedChars = (start: string, end: string) => {
  const changes: Record<number, ChangedChar> = {}

  // Ensure both strings are of the same length
  const length = Math.min(start.length, end.length)

  for (let i = 0; i < length; i++) {
    if (start.charAt(i) !== end.charAt(i)) {
      changes[i] = {
        index: i,
        from: start.charAt(i),
        to: end.charAt(i),
        trend: start.charAt(i) < end.charAt(i) ? 'up' : 'down',
      }
    }
  }

  // Handle cases where one string is longer than the other
  if (start.length > length) {
    for (let i = length; i < start.length; i++) {
      changes[i] = {
        index: i,
        from: start.charAt(i),
        to: null, // Character was removed
        trend: 'down',
      }
    }
  } else if (end.length > length) {
    for (let i = length; i < end.length; i++) {
      changes[i] = {
        index: i,
        from: null, // Character was added
        to: end.charAt(i),
        trend: 'up',
      }
    }
  }

  return changes
}
export const symbolList = [
  '9',
  '8',
  '7',
  '6',
  '5',
  '4',
  '3',
  '2',
  '1',
  '0',
  '$',
  ',',
  '.',
]
