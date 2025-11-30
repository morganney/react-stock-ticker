import { describe, it, expect, beforeAll, afterEach } from 'vitest'
import { render, renderHook } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

import { StockTicker } from '../src/stockTicker.js'
import { useLocaleMetadata } from '../src/hooks.js'
import { getLocaleMetadata } from '../src/utils.js'

describe('StockTicker', () => {
  it('renders the price', () => {
    const { rerender } = render(<StockTicker price={9999.5} />)
    let tenthsDigit = document
      .querySelectorAll('.charsX')[7]
      .querySelector('div')

    expect(document.querySelector('p')).toHaveTextContent('$9,999.50')

    // Increase the price
    rerender(<StockTicker price={10000} />)
    expect(document.querySelector('p')).toHaveTextContent('$10,000.00')
    expect(tenthsDigit).toHaveStyle('color: green')

    // Decrease the price
    rerender(<StockTicker price={9999.8} />)
    expect(document.querySelector('p')).toHaveTextContent('$9,999.80')
    tenthsDigit = document.querySelectorAll('.charsX')[7].querySelector('div')
    expect(tenthsDigit).toHaveStyle('color: red')

    // Check colors after transition end
    tenthsDigit?.dispatchEvent(new Event('transitionend'))
    tenthsDigit = document.querySelectorAll('.charsX')[7].querySelector('div')
    expect(tenthsDigit).toHaveStyle('color: black')

    // Change color props
    rerender(<StockTicker price={9999.7} upColor="blue" downColor="orange" />)
    tenthsDigit = document.querySelectorAll('.charsX')[7].querySelector('div')
    expect(tenthsDigit).toHaveStyle('color: orange')
    rerender(<StockTicker price={9999.8} upColor="blue" downColor="orange" />)
    tenthsDigit = document.querySelectorAll('.charsX')[7].querySelector('div')
    expect(tenthsDigit).toHaveStyle('color: blue')
    rerender(<StockTicker price={9999.9} color="yellow" />)
    expect(
      document.querySelectorAll('.charsX')[2].querySelector('div')
    ).toHaveStyle('color: yellow')
  })
})

describe('useLocaleMetadata', () => {
  beforeAll(() => {
    Object.defineProperty(global, 'getComputedStyle', {
      value: () => ({
        direction: 'ltr',
        getPropertyValue: () => 'ltr',
      }),
    })
  })

  it('returns metadata for a locale', () => {
    const { result } = renderHook(() => useLocaleMetadata('en-US'))

    expect(result.current.symbols).toEqual([
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
    ])
    expect(result.current.formatter).toBeInstanceOf(Intl.NumberFormat)
    expect(result.current.documentDirection).toBe('ltr')
    expect(result.current.direction).toBe('ltr')
  })
})

describe('getLocaleMetadata fallbacks', () => {
  const originalLocaleDescriptor = Object.getOwnPropertyDescriptor(
    Intl,
    'Locale'
  )

  afterEach(() => {
    if (originalLocaleDescriptor) {
      Object.defineProperty(Intl, 'Locale', originalLocaleDescriptor)
    } else {
      delete (Intl as { Locale?: typeof Intl.Locale }).Locale
    }
  })

  it('falls back to document direction when Intl.Locale is unavailable', () => {
    Object.defineProperty(Intl, 'Locale', {
      value: undefined,
      writable: true,
      configurable: true,
    })

    const meta = getLocaleMetadata('en-US')

    expect(meta.documentDirection).toBe('ltr')
    expect(meta.direction).toBe('ltr')
  })

  it('uses text info when provided by Intl.Locale', () => {
    class FakeLocale {
      constructor(locale: string) {
        void locale
      }

      getTextInfo() {
        return { direction: 'rtl' as const }
      }
    }

    Object.defineProperty(Intl, 'Locale', {
      value: FakeLocale,
      writable: true,
      configurable: true,
    })

    const meta = getLocaleMetadata('ar-SA')

    expect(meta.direction).toBe('rtl')
  })
})
