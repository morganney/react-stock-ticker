# [`react-stock-ticker`](https://www.npmjs.com/package/react-stock-ticker)

![CI](https://github.com/morganney/react-stock-ticker/actions/workflows/ci.yml/badge.svg)
[![codecov](https://codecov.io/gh/morganney/react-stock-ticker/graph/badge.svg?token=6MNXI4F2RJ)](https://codecov.io/gh/morganney/react-stock-ticker)
[![NPM version](https://img.shields.io/npm/v/react-stock-ticker.svg)](https://www.npmjs.com/package/react-stock-ticker)

React component for animating stock price changes.

Check out the demo at https://morganney.github.io/react-stock-ticker.

```console
npm i react-stock-ticker
```

Then import it and add it to your app passing updated stock prices.

```tsx
import { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { StockTicker } from 'react-stock-ticker'

const root = createRoot(document.getElementById('root') as HTMLDivElement)
const getRandomBetween = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}
const Demo = () => {
  const [price, setPrice] = useState(999.85)

  // Replace this with your real data source for stock prices
  useEffect(() => {
    const interval = setInterval(() => {
      setPrice((prevPrice) => prevPrice + getRandomBetween(-0.1, 0.15))
    }, 5_000)

    return () => clearInterval(interval)
  }, [])

  return <StockTicker fontSize="32px" price={price} />
}

root.render(<Demo />)
```
