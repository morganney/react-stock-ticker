import React from 'react'
import { describe, it, expect, beforeAll } from 'vitest'
import { render, renderHook } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

import { StockTicker } from '../src/stockTicker.js'
import { useLocaleMetadata } from '../src/hooks.js'

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
    expect(tenthsDigit).toHaveStyle('color: rgb(0, 128, 0)')

    // Decrease the price
    rerender(<StockTicker price={9999.8} />)
    expect(document.querySelector('p')).toHaveTextContent('$9,999.80')
    tenthsDigit = document.querySelectorAll('.charsX')[7].querySelector('div')
    expect(tenthsDigit).toHaveStyle('color: rgb(255, 0, 0)')

    // Check colors after transition end
    tenthsDigit?.dispatchEvent(new Event('transitionend'))
    tenthsDigit = document.querySelectorAll('.charsX')[7].querySelector('div')
    expect(tenthsDigit).toHaveStyle('color: rgb(0, 0, 0)')

    // Change color props
    rerender(<StockTicker price={9999.7} upColor="blue" downColor="orange" />)
    tenthsDigit = document.querySelectorAll('.charsX')[7].querySelector('div')
    expect(tenthsDigit).toHaveStyle('color: rgb(255, 165, 0)')
    rerender(<StockTicker price={9999.8} upColor="blue" downColor="orange" />)
    tenthsDigit = document.querySelectorAll('.charsX')[7].querySelector('div')
    expect(tenthsDigit).toHaveStyle('color: rgb(0, 0, 255)')
    rerender(<StockTicker price={9999.9} color="yellow" />)
    expect(
      document.querySelectorAll('.charsX')[2].querySelector('div')
    ).toHaveStyle('color: rgb(255, 255, 0)')
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
