import React, {
  type ChangeEvent,
  useEffect,
  useReducer,
  useCallback,
} from 'react'
import { createRoot } from 'react-dom/client'

import { StockTicker, type StockTickerProps } from './src/stockTicker.js'
import { usePrevious } from './src/hooks.js'
import { formatter } from './src/utils.js'

const reducer = (state: StockTickerProps, action: StockTickerProps) => {
  return { ...state, ...action }
}
const getRandomBetween = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}
const Demo = () => {
  const [state, dispatch] = useReducer(reducer, {
    price: 999.85,
    fontSize: '36px',
    color: '#000000',
    upColor: '#008000',
    downColor: '#FF0000',
    duration: 350,
    timingFunction: 'ease-out',
  })
  const prevPrice = usePrevious(state.price)
  const handler = useCallback(
    (evt: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = evt.target

      dispatch({
        ...state,
        [name]: type === 'number' ? parseInt(value) : value,
      })
    },
    [state]
  )

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ price: prevPrice + getRandomBetween(-0.1, 0.15) })
    }, 3_500)

    return () => clearInterval(interval)
  }, [prevPrice])

  return (
    <section>
      <h1>
        <a href="https://www.npmjs.com/package/react-stock-ticker">
          <code>react-stock-ticker</code>
        </a>
      </h1>
      <div>
        <StockTicker {...state} />
        <p>Previous: {formatter.format(prevPrice)}</p>
      </div>
      <form>
        <fieldset>
          <legend>Props</legend>
          <div>
            <label>
              <code>color</code>
              <input
                type="color"
                name="color"
                value={state.color}
                onChange={handler}
              />
            </label>
            <label>
              <code>upColor</code>
              <input
                type="color"
                name="upColor"
                value={state.upColor}
                onChange={handler}
              />
            </label>
            <label>
              <code>downColor</code>
              <input
                type="color"
                name="downColor"
                value={state.downColor}
                onChange={handler}
              />
            </label>
          </div>
          <div>
            <label>
              <code>fontSize</code>
              <input
                type="text"
                name="fontSize"
                value={state.fontSize}
                onChange={handler}
              />
            </label>
            <label>
              <code>duration</code>
              <input
                type="number"
                name="duration"
                value={state.duration}
                onChange={handler}
                step={25}
              />
            </label>
            <label>
              <code>timingFunction</code>
              <select
                name="timingFunction"
                value={state.timingFunction}
                onChange={handler}>
                <option value="ease">ease</option>
                <option value="ease-in">ease-in</option>
                <option value="ease-out">ease-out</option>
                <option value="ease-in-out">ease-in-out</option>
                <option value="linear">linear</option>
                <option value="step-start">step-start</option>
                <option value="step-end">step-end</option>
              </select>
            </label>
          </div>
        </fieldset>
      </form>
    </section>
  )
}
const root = createRoot(document.querySelector('main')!)

root.render(<Demo />)
