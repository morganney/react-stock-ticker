import { useEffect, useRef, useMemo } from 'react'

import { type Locale, getLocaleMetadata } from './utils.js'

export const usePrevious = <T>(value: T) => {
  const ref = useRef(value)

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}
export const useLocaleMetadata = (locale: Locale) => {
  return useMemo(() => getLocaleMetadata(locale), [locale])
}
