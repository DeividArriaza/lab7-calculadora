import type { ButtonSpec } from '../lib/buttons'

type Props = ButtonSpec & {
  activeOperator: string | null
  clearLabel: string
  onPress: (value: string) => void
  pressedKey: string | null
}

export function CalcButton (props: Props) {
  const { activeOperator, ariaLabel, clearLabel, label, onPress, pressedKey, tone, value, wide } = props
  const text = value === 'clear' ? clearLabel : label
  const name = value === 'clear' && clearLabel === 'CA' ? 'Borrar todo' : ariaLabel
  const states = `${value === activeOperator ? ' active' : ''}${value === pressedKey ? ' pressed' : ''}`
  return (
    <button aria-label={name} className={`key ${tone}${wide ? ' wide' : ''}${states}`} onClick={() => onPress(value)} type='button'>{text}</button>
  )
}
