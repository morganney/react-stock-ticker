# [`react-stock-ticker`](https://www.npmjs.com/package/react-stock-ticker)

![CI](https://github.com/morganney/react-stock-ticker/actions/workflows/ci.yml/badge.svg)
[![codecov](https://codecov.io/gh/morganney/react-stock-ticker/graph/badge.svg?token=6MNXI4F2RJ)](https://codecov.io/gh/morganney/react-stock-ticker)
[![NPM version](https://img.shields.io/npm/v/react-stock-ticker.svg)](https://www.npmjs.com/package/react-stock-ticker)

React component for animating stock price changes.

```console
npm i react-stock-ticker
```

## Demo

https://morganney.github.io/react-stock-ticker

## Example

```html
<script type="module">
  import React, {
    useEffect,
    useState,
    createElement,
  } from 'https://esm.sh/react'
  import { createRoot } from 'https://esm.sh/react-dom/client'
  import { StockTicker } from 'https://esm.sh/react-stock-ticker'
  import htm from 'https://esm.sh/htm'

  const html = htm.bind(createElement)
  const getRandomBetween = (min, max) => {
    return Math.random() * (max - min) + min
  }
  const App = () => {
    const [price, setPrice] = useState(999.85)

    useEffect(() => {
      const interval = setInterval(() => {
        setPrice((prev) => prev + getRandomBetween(-0.1, 0.15))
      }, 3_500)

      return () => clearInterval(interval)
    }, [])

    return html`<${StockTicker} fontSize="32px" price=${price} />`
  }

  createRoot(document.getElementById('root')).render(html`<${App} />`)
</script>
```

## Props

```ts
type StockTickerProps = {
  price: number
  fontSize?: string
  /* default price color. */
  color?: string
  /* color when price increases. */
  upColor?: string
  /* color when price decreases. */
  downColor?: string
  /* transition time in milliseconds. */
  duration?: number
  timingFunction?:
    | 'ease'
    | 'ease-in'
    | 'ease-out'
    | 'ease-in-out'
    | 'linear'
    | 'step-start'
    | 'step-end'
}
```
