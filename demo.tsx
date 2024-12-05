import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'

const { StockTicker } = (await import(
  process.env.NODE_ENV === 'development'
    ? './src/stockTicker.js'
    : 'react-stock-ticker'
)) as typeof import('react-stock-ticker')
const root = createRoot(document.getElementById('root') as HTMLDivElement)
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

root.render(<Demo />)
