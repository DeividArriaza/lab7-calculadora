import { useCalculator } from '../hooks/useCalculator'
import { Display } from './Display'
import { Keypad } from './Keypad'

export function Calculator () {
  const calculator = useCalculator()
  return (
    <section className='calculator'>
      <h1 className='title'>Calculadora digital</h1>
      <Display operation={calculator.operation} value={calculator.display} />
      <Keypad {...calculator} onPress={calculator.press} />
    </section>
  )
}
