import React from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import { StockTicker } from '../src/stockTicker'

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
  })
})
