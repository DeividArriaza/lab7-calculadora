import { useCalculator } from '../hooks/useCalculator'
import { Display } from './Display'
import { Keypad } from './Keypad'

export function Calculator () {
  const calculator = useCalculator()
  const {
    activeOperator,
    clearLabel,
    copyResult,
    copyState,
    display,
    feedback,
    isSignalActive,
    operation,
    press,
    pressedKey
  } = calculator
  return (
    <div className='calculator'>
      <header className='calc-header'>
        <p className='eyebrow'>
          Laboratorio de Componentes
          <span aria-hidden='true' className={`signal-dot${isSignalActive ? ' live' : ''}`} />
        </p>
        <h1>Signal Calc</h1>
      </header>
      <Display copyState={copyState} feedback={feedback} onCopy={copyResult} operation={operation} value={display} />
      <Keypad
        activeOperator={activeOperator}
        clearLabel={clearLabel}
        onPress={press}
        pressedKey={pressedKey}
      />
    </div>
  )
}
