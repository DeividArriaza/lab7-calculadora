export type ButtonSpec = {
  label: string
  value: string
  tone: 'equal' | 'function' | 'number' | 'operator'
  ariaLabel: string
  wide?: boolean
}

export const BUTTONS: ButtonSpec[] = [
  { label: 'C', value: 'clear', tone: 'function', ariaLabel: 'Borrar actual' },
  { label: '+/-', value: '+/-', tone: 'function', ariaLabel: 'Cambiar signo' },
  { label: '%', value: '%', tone: 'function', ariaLabel: 'Módulo' },
  { label: '÷', value: '/', tone: 'operator', ariaLabel: 'Dividir' },
  { label: '7', value: '7', tone: 'number', ariaLabel: 'Número 7' },
  { label: '8', value: '8', tone: 'number', ariaLabel: 'Número 8' },
  { label: '9', value: '9', tone: 'number', ariaLabel: 'Número 9' },
  { label: '×', value: '*', tone: 'operator', ariaLabel: 'Multiplicar' },
  { label: '4', value: '4', tone: 'number', ariaLabel: 'Número 4' },
  { label: '5', value: '5', tone: 'number', ariaLabel: 'Número 5' },
  { label: '6', value: '6', tone: 'number', ariaLabel: 'Número 6' },
  { label: '-', value: '-', tone: 'operator', ariaLabel: 'Restar' },
  { label: '1', value: '1', tone: 'number', ariaLabel: 'Número 1' },
  { label: '2', value: '2', tone: 'number', ariaLabel: 'Número 2' },
  { label: '3', value: '3', tone: 'number', ariaLabel: 'Número 3' },
  { label: '+', value: '+', tone: 'operator', ariaLabel: 'Sumar' },
  { label: '0', value: '0', tone: 'number', ariaLabel: 'Número 0', wide: true },
  { label: '.', value: '.', tone: 'number', ariaLabel: 'Punto decimal' },
  { label: '=', value: '=', tone: 'equal', ariaLabel: 'Resultado', wide: true }
]
