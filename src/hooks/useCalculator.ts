import { useEffect, useRef, useState } from 'react'
import { getOperationText, initialState, nextState } from '../lib/calculator'
import { KEYBOARD_MAP } from '../lib/keys'

export function useCalculator () {
  const [state, setState] = useState(initialState)
  const [pressedKey, setPressedKey] = useState<string | null>(null)
  const [copyState, setCopyState] = useState<'idle' | 'done'>('idle')
  const clearCopyTimer = useRef<number | null>(null)

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

  useEffect(() => () => {
    if (clearCopyTimer.current) window.clearTimeout(clearCopyTimer.current)
  }, [])

  const copyResult = async () => {
    if (state.display === 'Error' || typeof navigator === 'undefined' || !navigator.clipboard) return
    await navigator.clipboard.writeText(state.display)
    setCopyState('done')
    if (clearCopyTimer.current) window.clearTimeout(clearCopyTimer.current)
    clearCopyTimer.current = window.setTimeout(() => setCopyState('idle'), 1400)
  }

  return {
    display: state.display,
    operation: getOperationText(state),
    clearLabel: state.clearMode === 'all' ? 'AC' : 'C',
    activeOperator: state.operator && state.replaceDisplay ? state.operator : null,
    isSignalActive: state.operator !== null,
    feedback: state.feedback,
    pressedKey,
    copyState,
    press,
    copyResult
  }
}
