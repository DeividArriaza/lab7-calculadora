import type { ButtonSpec } from '../lib/buttons'

type Props = ButtonSpec & {
  isActive: boolean
  isPressed: boolean
  label: string
  onPress: (value: string) => void
}

export function CalcButton ({ ariaLabel, equal, isActive, isPressed, label, onPress, tone, value, wide }: Props) {
  const classes = ['key', tone, wide ? 'wide' : '', equal ? 'equal' : '', isActive ? 'selected' : '', isPressed ? 'pressed' : '']
    .filter(Boolean)
    .join(' ')
  return <button aria-label={ariaLabel} aria-pressed={isActive} className={classes} data-key={value} onClick={() => onPress(value)} type='button'>{label}</button>
}
