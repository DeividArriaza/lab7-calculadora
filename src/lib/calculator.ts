export type Operator = '+' | '-' | '*' | '/' | '%'

export type Feedback = 'idle' | 'result' | 'error'

export type CalcState = {
  display: string
  expression: string
  storedText: string
  storedValue: number | null
  operator: Operator | null
  replaceDisplay: boolean
  feedback: Feedback
  clearMode: 'clear' | 'all'
}

const ERROR_LABEL = 'Error'

export const initialState: CalcState = {
  display: '0',
  expression: 'Lista',
  storedText: '',
  storedValue: null,
  operator: null,
  replaceDisplay: false,
  feedback: 'idle',
  clearMode: 'all'
}

export const operatorLabel = (value: Operator) => {
  if (value === '*') return '×'
  if (value === '/') return '÷'
  return value
}

const isOperator = (value: string): value is Operator => ['+', '-', '*', '/', '%'].includes(value)

const trimDecimal = (value: string) => value.replace(/\.?0+$/, '')

const isError = (value: string) => value === ERROR_LABEL

const setFeedback = (state: CalcState, feedback: Feedback): CalcState => ({ ...state, feedback })

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

const updateEntry = (state: CalcState, display: string): CalcState => ({
  ...state,
  display,
  replaceDisplay: false,
  feedback: 'idle',
  clearMode: 'clear'
})

const commitOperation = (state: CalcState, nextOperator: Operator): CalcState => {
  if (isError(state.display)) return state
  if (state.operator !== null && state.replaceDisplay) {
    return setFeedback({
      ...state,
      operator: nextOperator
    }, 'idle')
  }
  const currentValue = Number(state.display)
  if (state.operator === null || state.storedValue === null) {
    return {
      ...state,
      storedValue: currentValue,
      storedText: state.display,
      operator: nextOperator,
      replaceDisplay: true,
      feedback: 'idle',
      clearMode: 'clear'
    }
  }
  const expression = `${state.storedText} ${operatorLabel(state.operator)} ${state.display}`
  const result = formatResult(applyOperator(state.storedValue, currentValue, state.operator))
  if (isError(result)) {
    return {
      ...initialState,
      display: ERROR_LABEL,
      expression,
      feedback: 'error',
      clearMode: 'all'
    }
  }
  return {
    ...state,
    display: result,
    expression: `${result} ${operatorLabel(nextOperator)}`,
    storedValue: Number(result),
    storedText: result,
    operator: nextOperator,
    replaceDisplay: true,
    feedback: 'idle',
    clearMode: 'clear'
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
      ...initialState,
      display: ERROR_LABEL,
      expression,
      feedback: 'error',
      clearMode: 'all'
    }
  }
  return {
    ...state,
    display: result,
    expression,
    storedValue: null,
    storedText: '',
    operator: null,
    replaceDisplay: true,
    feedback: 'result',
    clearMode: 'all'
  }
}

const clearEntry = (state: CalcState): CalcState => {
  // First tap clears the active entry, second tap escalates to a full reset.
  if (state.clearMode === 'all') return initialState
  const expression = state.operator && state.storedText ? `${state.storedText} ${operatorLabel(state.operator)}` : 'Lista'
  return {
    ...state,
    display: '0',
    expression,
    replaceDisplay: true,
    feedback: 'idle',
    clearMode: 'all'
  }
}

export const getOperationText = (state: CalcState) => {
  if (state.operator !== null && state.storedText) {
    if (state.replaceDisplay) return `${state.storedText} ${operatorLabel(state.operator)}`
    return `${state.storedText} ${operatorLabel(state.operator)} ${state.display}`
  }
  if (!isError(state.display) && state.display !== '0') return state.display
  return state.expression
}

export const nextState = (state: CalcState, key: string): CalcState => {
  if (key === 'clear') return clearEntry(state)
  if (/^\d$/.test(key)) return updateEntry(state, appendDigit(state, key))
  if (key === '.') return updateEntry(state, appendDecimal(state))
  if (key === '+/-') return updateEntry(state, state.replaceDisplay ? '-0' : toggleSign(state.display))
  if (key === '=') return resolveEquals(state)
  return isOperator(key) ? commitOperation(state, key) : state
}
