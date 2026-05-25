import { useEffect, useState } from 'react'

type Operator = '+' | '-' | '*' | '/' | '%'
type Feedback = 'idle' | 'result' | 'error'
type ClearMode = 'clear' | 'all'

type CalcState = {
  clearMode: ClearMode
  display: string
  expression: string
  feedback: Feedback
  operator: Operator | null
  replaceDisplay: boolean
  storedText: string
  storedValue: number | null
}

type ButtonSpec = {
  ariaLabel: string
  kind: 'equal' | 'function' | 'number' | 'operator'
  value: string
  wide?: boolean
}

const ERROR_LABEL = 'Error'

const BUTTONS: ButtonSpec[] = [
  { ariaLabel: 'Borrar actual', kind: 'function', value: 'clear' },
  { ariaLabel: 'Cambiar signo', kind: 'function', value: '+/-' },
  { ariaLabel: 'Módulo', kind: 'function', value: '%' },
  { ariaLabel: 'Dividir', kind: 'operator', value: '/' },
  { ariaLabel: 'Número 7', kind: 'number', value: '7' },
  { ariaLabel: 'Número 8', kind: 'number', value: '8' },
  { ariaLabel: 'Número 9', kind: 'number', value: '9' },
  { ariaLabel: 'Multiplicar', kind: 'operator', value: '*' },
  { ariaLabel: 'Número 4', kind: 'number', value: '4' },
  { ariaLabel: 'Número 5', kind: 'number', value: '5' },
  { ariaLabel: 'Número 6', kind: 'number', value: '6' },
  { ariaLabel: 'Restar', kind: 'operator', value: '-' },
  { ariaLabel: 'Número 1', kind: 'number', value: '1' },
  { ariaLabel: 'Número 2', kind: 'number', value: '2' },
  { ariaLabel: 'Número 3', kind: 'number', value: '3' },
  { ariaLabel: 'Sumar', kind: 'operator', value: '+' },
  { ariaLabel: 'Número 0', kind: 'number', value: '0', wide: true },
  { ariaLabel: 'Punto decimal', kind: 'number', value: '.' },
  { ariaLabel: 'Resultado', kind: 'equal', value: '=', wide: true }
]

const KEYBOARD_MAP: Record<string, string> = {
  Enter: '=',
  '=': '=',
  Escape: 'clear',
  Backspace: 'clear',
  '+': '+',
  '-': '-',
  '*': '*',
  x: '*',
  X: '*',
  '/': '/',
  '%': '%',
  '.': '.',
  ',': '.'
}

for (const digit of ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']) {
  KEYBOARD_MAP[digit] = digit
}

const INITIAL_STATE: CalcState = {
  clearMode: 'all',
  display: '0',
  expression: '',
  feedback: 'idle',
  operator: null,
  replaceDisplay: false,
  storedText: '',
  storedValue: null
}

const APP_CSS = `
:root {
  color: #1a1a1a;
  background: #fafafa;
  color-scheme: light;
  font-family: Inter, "IBM Plex Sans", "Segoe UI", sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  background: #fafafa;
}

button {
  font: inherit;
}

#root {
  min-height: 100vh;
}

.app {
  display: grid;
  min-height: 100vh;
  padding: 24px;
  place-items: center;
}

.calculator {
  width: min(100%, 392px);
  padding: 16px;
  border: 1px solid #d8d8d8;
  border-radius: 10px;
  background: #fafafa;
  display: grid;
  gap: 16px;
}

.title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 500;
  line-height: 1.2;
}

.display {
  padding: 16px;
  border: 1px solid #d8d8d8;
  border-radius: 8px;
  background: #fafafa;
  display: grid;
  gap: 12px;
}

.display-track {
  min-height: 1rem;
  color: #d8d8d8;
  text-align: right;
  font-size: 0.78rem;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.display-value {
  margin: 0;
  color: #1a1a1a;
  text-align: right;
  font-size: clamp(2.4rem, 10vw, 3.4rem);
  font-weight: 300;
  line-height: 0.95;
  font-variant-numeric: tabular-nums;
}

.display-value.compact {
  font-size: clamp(2rem, 8vw, 2.8rem);
}

.display-value.tight {
  font-size: clamp(1.7rem, 7vw, 2.2rem);
}

.keypad {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.key {
  min-height: 64px;
  border: 1px solid #d8d8d8;
  border-radius: 8px;
  background: #fafafa;
  color: #1a1a1a;
  transition: background-color 100ms ease-out;
}

.key.number:hover,
.key.function:hover {
  background: #f0f0f0;
}

.key.operator,
.key.equal {
  background: #f0f0f0;
}

.key.operator:hover,
.key.equal:hover,
.key.active,
.key.pressed {
  background: #d8d8d8;
}

.key:active {
  background: #d8d8d8;
}

.key:focus-visible {
  outline: 2px solid #1a1a1a;
  outline-offset: 0;
}

.key.wide {
  grid-column: span 2;
}

@media (max-width: 380px) {
  .app {
    padding: 0;
  }

  .calculator {
    width: 100%;
    min-height: 100vh;
    border: 0;
    border-radius: 0;
  }
}
`

const operatorLabel = (value: Operator) => {
  if (value === '*') return '×'
  if (value === '/') return '÷'
  return value
}

const isOperator = (value: string): value is Operator => ['+', '-', '*', '/', '%'].includes(value)

const trimDecimal = (value: string) => value.replace(/\.?0+$/, '')

const isError = (value: string) => value === ERROR_LABEL

const formatResult = (value: number) => {
  if (!Number.isFinite(value) || value < 0 || value > 999999999) return ERROR_LABEL
  if (Number.isInteger(value)) return `${value}`.length <= 9 ? `${value}` : ERROR_LABEL
  let decimals = 8
  while (decimals >= 0) {
    const formatted = trimDecimal(value.toFixed(decimals))
    if (formatted.length <= 9) return formatted
    decimals -= 1
  }
  return ERROR_LABEL
}

const applyOperator = (left: number, right: number, operator: Operator) => {
  if (operator === '+') return left + right
  if (operator === '-') return left - right
  if (operator === '*') return left * right
  if (operator === '/') return right === 0 ? Number.NaN : left / right
  return right === 0 ? Number.NaN : left % right
}

const appendDigit = (state: CalcState, digit: string) => {
  const base = state.replaceDisplay || isError(state.display) ? '0' : state.display
  if (base === '0') return digit
  if (base === '-0') return `-${digit}`
  if (base.length >= 9) return base
  return `${base}${digit}`
}

const appendDecimal = (state: CalcState) => {
  const base = state.replaceDisplay || isError(state.display) ? '0' : state.display
  if (base.includes('.') || base.length >= 9) return base
  return `${base}.`
}

const toggleSign = (display: string) => {
  if (isError(display)) return display
  if (display.startsWith('-')) return display.slice(1)
  return display.length >= 9 ? display : `-${display}`
}

const setIdleEntry = (state: CalcState, display: string): CalcState => ({
  ...state,
  clearMode: 'clear',
  display,
  feedback: 'idle',
  replaceDisplay: false
})

const clearEntry = (state: CalcState): CalcState => {
  // El primer toque limpia solo la entrada activa; el segundo reinicia toda la operación.
  if (state.clearMode === 'all') return INITIAL_STATE
  return {
    ...state,
    clearMode: 'all',
    display: '0',
    feedback: 'idle',
    replaceDisplay: true
  }
}

const commitOperation = (state: CalcState, nextOperator: Operator): CalcState => {
  if (isError(state.display)) return state
  if (state.operator !== null && state.replaceDisplay) return { ...state, operator: nextOperator, feedback: 'idle' }
  const currentValue = Number(state.display)
  if (state.operator === null || state.storedValue === null) {
    return {
      ...state,
      clearMode: 'clear',
      feedback: 'idle',
      operator: nextOperator,
      replaceDisplay: true,
      storedText: state.display,
      storedValue: currentValue
    }
  }
  const expression = `${state.storedText} ${operatorLabel(state.operator)} ${state.display}`
  const result = formatResult(applyOperator(state.storedValue, currentValue, state.operator))
  if (isError(result)) {
    return {
      ...INITIAL_STATE,
      display: ERROR_LABEL,
      expression,
      feedback: 'error'
    }
  }
  return {
    ...state,
    clearMode: 'clear',
    display: result,
    feedback: 'idle',
    operator: nextOperator,
    replaceDisplay: true,
    storedText: result,
    storedValue: Number(result)
  }
}

const resolveEquals = (state: CalcState): CalcState => {
  if (
    isError(state.display) ||
    state.operator === null ||
    state.storedValue === null ||
    state.replaceDisplay
  ) return state
  const expression = `${state.storedText} ${operatorLabel(state.operator)} ${state.display} =`
  const result = formatResult(applyOperator(state.storedValue, Number(state.display), state.operator))
  if (isError(result)) {
    return {
      ...INITIAL_STATE,
      display: ERROR_LABEL,
      expression,
      feedback: 'error'
    }
  }
  return {
    ...state,
    clearMode: 'all',
    display: result,
    expression,
    feedback: 'result',
    operator: null,
    replaceDisplay: true,
    storedText: '',
    storedValue: null
  }
}

const operationText = (state: CalcState) => {
  if (state.operator !== null && state.storedText) {
    if (state.replaceDisplay) return `${state.storedText} ${operatorLabel(state.operator)}`
    return `${state.storedText} ${operatorLabel(state.operator)} ${state.display}`
  }
  return state.expression
}

const nextState = (state: CalcState, key: string): CalcState => {
  if (key === 'clear') return clearEntry(state)
  if (/^\d$/.test(key)) return setIdleEntry(state, appendDigit(state, key))
  if (key === '.') return setIdleEntry(state, appendDecimal(state))
  if (key === '+/-') return setIdleEntry(state, state.replaceDisplay ? '-0' : toggleSign(state.display))
  if (key === '=') return resolveEquals(state)
  return isOperator(key) ? commitOperation(state, key) : state
}

const displayLabel = (value: string) => {
  if (value === 'clear') return 'C'
  if (value === '*') return '×'
  if (value === '/') return '÷'
  return value
}

const displayClass = (value: string) => {
  if (value.length >= 9) return 'display-value tight'
  if (value.length >= 7) return 'display-value compact'
  return 'display-value'
}

function App () {
  const [state, setState] = useState(INITIAL_STATE)
  const [pressedKey, setPressedKey] = useState<string | null>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return
      const mapped = KEYBOARD_MAP[event.key]
      if (!mapped) return
      event.preventDefault()
      setPressedKey(mapped)
      setState((current) => nextState(current, mapped))
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      const mapped = KEYBOARD_MAP[event.key]
      if (!mapped) return
      setPressedKey((current) => (current === mapped ? null : current))
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  const track = operationText(state)
  const activeOperator = state.operator !== null && state.replaceDisplay ? state.operator : null

  return (
    <>
      <style>{APP_CSS}</style>
      <main className='app'>
        <section className='calculator'>
          <h1 className='title'>Calculadora digital</h1>
          <div className='display'>
            <div className='display-track'>{track}</div>
            <output aria-label='display' className={displayClass(state.display)}>{state.display}</output>
          </div>
          <div className='keypad'>
            {BUTTONS.map((button) => {
              const label = button.value === 'clear' ? (state.clearMode === 'all' ? 'CA' : 'C') : displayLabel(button.value)
              const ariaLabel = button.value === 'clear' ? (state.clearMode === 'all' ? 'Borrar todo' : button.ariaLabel) : button.ariaLabel
              const classes = [
                'key',
                button.kind,
                button.wide ? 'wide' : '',
                button.value === activeOperator ? 'active' : '',
                button.value === pressedKey ? 'pressed' : ''
              ].filter(Boolean).join(' ')
              return (
                <button
                  key={button.value}
                  aria-label={ariaLabel}
                  className={classes}
                  onClick={() => setState((current) => nextState(current, button.value))}
                  type='button'
                >
                  {label}
                </button>
              )
            })}
          </div>
        </section>
      </main>
    </>
  )
}

export default App
