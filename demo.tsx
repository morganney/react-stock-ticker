import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'

import { StockTicker } from './src/stockTicker.js'

const getRandomBetween = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}
const Demo = () => {
  const [price, setPrice] = useState(999.85)

  useEffect(() => {
    const interval = setInterval(() => {
      setPrice((prevPrice) => prevPrice + getRandomBetween(-0.1, 0.15))
    }, 5_000)

    return () => clearInterval(interval)
  }, [])

  return <StockTicker fontSize="32px" price={price} />
}
const root = createRoot(document.body as HTMLBodyElement)

root.render(<Demo />)
