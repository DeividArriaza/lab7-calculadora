import { BUTTONS } from '../lib/buttons'
import { CalcButton } from './CalcButton'

type Props = {
  activeOperator: string | null
  clearLabel: string
  onPress: (value: string) => void
  pressedKey: string | null
}

export function Keypad ({ activeOperator, clearLabel, onPress, pressedKey }: Props) {
  const shared = { activeOperator, clearLabel, onPress, pressedKey }
  return (
    <div className='keypad'>
      {BUTTONS.map((button) => (
        <CalcButton key={button.value} {...button} {...shared} />
      ))}
    </div>
  )
}
