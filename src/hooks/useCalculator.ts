import { useEffect, useState } from 'react'
import { getOperationText, initialState, nextState } from '../lib/calculator'
import { KEYBOARD_MAP } from '../lib/keys'

export function useCalculator () {
  const [state, setState] = useState(initialState)
  const [pressedKey, setPressedKey] = useState<string | null>(null)
  const press = (key: string) => setState((current) => nextState(current, key))

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return
      const mapped = KEYBOARD_MAP[event.key]
      if (!mapped) return
      event.preventDefault()
      setPressedKey(mapped)
      press(mapped)
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      const mapped = KEYBOARD_MAP[event.key]
      if (mapped) setPressedKey((current) => (current === mapped ? null : current))
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return {
    display: state.display,
    operation: getOperationText(state),
    clearLabel: state.clearMode === 'all' ? 'CA' : 'C',
    activeOperator: state.operator && state.replaceDisplay ? state.operator : null,
    pressedKey,
    press
  }
}
