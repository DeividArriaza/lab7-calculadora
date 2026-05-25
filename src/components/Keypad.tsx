import { BUTTONS } from '../lib/buttons'
import { CalcButton } from './CalcButton'

type Props = {
  activeOperator: string | null
  clearLabel: string
  onPress: (value: string) => void
  pressedKey: string | null
}

export function Keypad ({ activeOperator, clearLabel, onPress, pressedKey }: Props) {
  return (
    <div className='keypad'>
      {BUTTONS.map((button) => (
        <CalcButton
          key={button.value}
          {...button}
          ariaLabel={button.value === 'clear' ? (clearLabel === 'AC' ? 'Clear all' : 'Clear current entry') : button.ariaLabel}
          isActive={button.value === activeOperator}
          isPressed={button.value === pressedKey}
          label={button.value === 'clear' ? clearLabel : button.label}
          onPress={onPress}
        />
      ))}
    </div>
  )
}
