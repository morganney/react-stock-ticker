import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'

import { StockTicker } from './src/stockTicker.js'
import { usePrevious } from './src/hooks.js'
import { formatter } from './src/utils.js'

const getRandomBetween = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}
const Demo = () => {
  const [price, setPrice] = useState(999.85)
  const prevPrice = usePrevious(price)

  useEffect(() => {
    const interval = setInterval(() => {
      setPrice((prevPrice) => prevPrice + getRandomBetween(-0.1, 0.15))
    }, 3_500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <StockTicker fontSize="32px" price={price} />
      <p>Previous price: {formatter.format(prevPrice)}</p>
    </div>
  )
}
const root = createRoot(document.getElementById('root') as HTMLDivElement)

root.render(<Demo />)
