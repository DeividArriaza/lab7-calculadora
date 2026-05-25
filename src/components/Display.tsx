type Props = {
  copyState: 'idle' | 'done'
  feedback: 'idle' | 'result' | 'error'
  onCopy: () => Promise<void>
  operation: string
  value: string
}

const sizeClass = (value: string) => {
  if (value.length >= 9) return 'display-value tight'
  if (value.length >= 7) return 'display-value compact'
  return 'display-value'
}

export function Display ({ copyState, feedback, onCopy, operation, value }: Props) {
  const tooltip = copyState === 'done' ? 'Copiado' : 'Copiar resultado'
  const handleCopy = () => {
    onCopy().catch(() => undefined)
  }
  return (
    <button
      aria-label={`Copiar resultado ${value}`}
      className={`display-shell ${feedback}`}
      data-tooltip={tooltip}
      onClick={handleCopy}
      type='button'
    >
      <span className='display-meta'>
        <span className='display-meta-label'>Operación</span>
        <span className='display-meta-value'>{operation}</span>
      </span>
      <output aria-label='display' className='display'>
        <span className={sizeClass(value)} key={`${feedback}-${value}`}>{value}</span>
      </output>
    </button>
  )
}
