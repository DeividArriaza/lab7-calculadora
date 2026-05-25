export type ButtonSpec = {
  label: string
  value: string
  tone: 'function' | 'number' | 'accent'
  ariaLabel: string
  equal?: boolean
  wide?: boolean
}

export const BUTTONS: ButtonSpec[] = [
  { label: 'C', value: 'clear', tone: 'function', ariaLabel: 'Clear current entry' },
  { label: '+/-', value: '+/-', tone: 'function', ariaLabel: 'Toggle sign' },
  { label: '%', value: '%', tone: 'function', ariaLabel: 'Modulo' },
  { label: '÷', value: '/', tone: 'accent', ariaLabel: 'Divide' },
  { label: '7', value: '7', tone: 'number', ariaLabel: 'Number 7' },
  { label: '8', value: '8', tone: 'number', ariaLabel: 'Number 8' },
  { label: '9', value: '9', tone: 'number', ariaLabel: 'Number 9' },
  { label: '×', value: '*', tone: 'accent', ariaLabel: 'Multiply' },
  { label: '4', value: '4', tone: 'number', ariaLabel: 'Number 4' },
  { label: '5', value: '5', tone: 'number', ariaLabel: 'Number 5' },
  { label: '6', value: '6', tone: 'number', ariaLabel: 'Number 6' },
  { label: '-', value: '-', tone: 'accent', ariaLabel: 'Subtract' },
  { label: '1', value: '1', tone: 'number', ariaLabel: 'Number 1' },
  { label: '2', value: '2', tone: 'number', ariaLabel: 'Number 2' },
  { label: '3', value: '3', tone: 'number', ariaLabel: 'Number 3' },
  { label: '+', value: '+', tone: 'accent', ariaLabel: 'Add' },
  { label: '0', value: '0', tone: 'number', ariaLabel: 'Number 0', wide: true },
  { label: '.', value: '.', tone: 'number', ariaLabel: 'Decimal point' },
  { label: '=', value: '=', tone: 'accent', ariaLabel: 'Equals', equal: true }
]
