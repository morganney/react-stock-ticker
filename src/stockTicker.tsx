import { type FC, type CSSProperties, useRef, useLayoutEffect } from 'react'

import { usePrevious } from './hooks.js'
import { formatter, symbolList, getChangedChars } from './utils.js'

type StockTickerProps = {
  price: number
  fontSize?: string
  /* color of the price. */
  color?: string
  /* color of the price when it goes up. */
  upColor?: string
  /* color of the price when it goes down. */
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

const containerBaseStyles: CSSProperties = {
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}
const priceStyles = {
  display: 'flex',
  opacity: 1,
  margin: 0,
  padding: 0,
} satisfies CSSProperties
const reelsStyles = {
  display: 'flex',
  position: 'absolute',
  inset: 0,
  opacity: 0,
} satisfies CSSProperties
const charsXStyles = {
  display: 'flex',
  position: 'absolute',
  inset: 0,
} satisfies CSSProperties
const charsYBaseStyles: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
}

const StockTicker: FC<StockTickerProps> = ({
  price,
  fontSize = '24px',
  color = 'black',
  upColor = 'green',
  downColor = 'red',
  duration = 350,
  timingFunction = 'ease-out',
}) => {
  const priceRef = useRef<HTMLDivElement>(null)
  const reelsRef = useRef<HTMLDivElement>(null)
  const prevPrice = usePrevious(price)
  const charString = formatter.format(price)
  const prevCharString = formatter.format(prevPrice)
  const changed = getChangedChars(prevCharString, charString)
  const trend = price > prevPrice ? 'up' : 'down'
  const chars = charString.split('')
  const containerStyles = {
    fontSize,
    color,
    ...containerBaseStyles,
  }
  const charsYStyles = {
    ...charsYBaseStyles,
    color,
    transition: `transform ${duration}ms ${timingFunction}, color ${duration + 300}ms ${timingFunction}`,
  }

  useLayoutEffect(() => {
    if (priceRef.current && reelsRef.current) {
      const widths: number[] = []
      const height = priceRef.current.getBoundingClientRect().height
      const charX = reelsRef.current.querySelectorAll<HTMLDivElement>('.charsX')

      priceRef.current.querySelectorAll('span').forEach((char) => {
        widths.push(char.getBoundingClientRect().width)
      })

      if (
        Object.keys(changed).length &&
        priceRef.current.style.opacity === '1' &&
        reelsRef.current.style.opacity === '0'
      ) {
        priceRef.current.style.opacity = '0'
        reelsRef.current.style.opacity = '1'
      }

      charX.forEach((reel, index) => {
        const charY = reel.querySelector<HTMLDivElement>('.charsY')
        const indexOfChar = symbolList.indexOf(chars[index])
        const translateY = -indexOfChar * height
        const translateX = widths
          .slice(0, index)
          .reduce((acc, width) => acc + width, 0)

        reel.style.transform = `translateX(${translateX}px)`

        if (charY) {
          charY.style.transform = `translateY(${translateY}px)`

          if (changed[index]) {
            const onTransitionEnd = () => {
              charY.removeEventListener('transitionend', onTransitionEnd)
              charY.style.color = color
            }

            charY.style.color = trend === 'up' ? upColor : downColor
            charY.addEventListener('transitionend', onTransitionEnd, {
              once: true,
            })
          }
        }
      })
    }
  }, [chars, changed, trend, color, upColor, downColor])

  return (
    <div style={containerStyles}>
      <p ref={priceRef} style={priceStyles}>
        {chars.map((digit, index) => {
          return <span key={index}>{digit}</span>
        })}
      </p>
      <div ref={reelsRef} style={reelsStyles}>
        {Array.from({ length: chars.length }).map((_, index) => {
          return (
            <div key={index} style={charsXStyles} className="charsX">
              <div className="charsY" style={charsYStyles}>
                {symbolList.map((symbol) => {
                  return <span key={symbol}>{symbol}</span>
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { StockTicker }
export type { StockTickerProps }
