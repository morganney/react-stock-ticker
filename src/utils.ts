type ChangedChar = {
  index: number
  from: string | null
  to: string | null
  trend: 'up' | 'down'
}
type CurrencyCountry = {
  currency: string
  country: string
}
export type Locale = (typeof localesCurrencyCountry)[number][0]

const localesCurrencyCountry = [
  ['en-US', { currency: 'USD', country: 'United States' }],
  ['de-DE', { currency: 'EUR', country: 'Germany' }],
  ['ja-JP', { currency: 'JPY', country: 'Japan' }],
  ['ar-SA', { currency: 'SAR', country: 'Saudi Arabia' }],
  ['ar-AE', { currency: 'AED', country: 'United Arab Emirates' }],
  ['ar-IQ', { currency: 'IQD', country: 'Iraq' }],
  ['ar-IL', { currency: 'ILS', country: 'Israel' }],
  ['fr-FR', { currency: 'EUR', country: 'France' }],
  ['en-GB', { currency: 'GBP', country: 'United Kingdom' }],
  ['es-ES', { currency: 'ESP', country: 'Spain' }],
  ['ru-RU', { currency: 'RUB', country: 'Russia' }],
  ['ko-KR', { currency: 'KRW', country: 'South Korea' }],
  ['ko-KP', { currency: 'KPW', country: 'North Korea' }],
  ['he-IL', { currency: 'ILS', country: 'Israel' }],
  ['vi-VN', { currency: 'VND', country: 'Vietnam' }],
  ['zh-HK', { currency: 'HKD', country: 'Hong Kong' }],
  ['zh-CN', { currency: 'CNY', country: 'China' }],
  ['hi-IN', { currency: 'INR', country: 'India' }],
  ['en-AU', { currency: 'AUD', country: 'Australia' }],
  ['ex-MX', { currency: 'MXN', country: 'Mexico' }],
  ['en-CA', { currency: 'CAD', country: 'Canada' }],
] as const
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
const localeCurrencyMap = new Map<Locale, CurrencyCountry>(
  localesCurrencyCountry
)
const getSymbolsForLocale = (locale: Locale): [string[], Intl.NumberFormat] => {
  const currencyInfo = localeCurrencyMap.get(locale)?.currency
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyInfo ?? 'USD',
  })
  const parts = formatter.formatToParts(1234567890.12)
  const digits: string[] = []
  const literals = new Set<string>()
  const symbols: string[] = []
  let currency = '$'
  let group = ','
  let decimal: string | undefined = undefined

  parts.forEach((part) => {
    if (part.type === 'integer') {
      digits.push(...part.value.split(''))
    }

    if (part.type === 'literal') {
      literals.add(part.value)
    }

    if (part.type === 'currency') {
      currency = part.value
    }

    if (part.type === 'group') {
      group = part.value
    }

    if (part.type === 'decimal') {
      decimal = part.value
    }
  })

  symbols.push(...digits.sort().reverse())
  symbols.push(currency)
  symbols.push(group)

  if (decimal) {
    symbols.push(decimal)
  }

  symbols.push(...Array.from(literals))

  return [symbols, formatter]
}
export const getMetaForLocale = (locale: Locale) => {
  const intlLocale = new Intl.Locale(locale)
  const documentDirection = getComputedStyle(document.body).direction
  const [symbols, formatter] = getSymbolsForLocale(locale)
  const meta = {
    symbols,
    formatter,
    documentDirection,
    direction: documentDirection ?? 'ltr',
  }

  if (typeof intlLocale.getTextInfo === 'function') {
    meta.direction = intlLocale.getTextInfo().direction
  }

  return meta
}
