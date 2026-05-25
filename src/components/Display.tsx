type Props = { operation: string, value: string }

const valueClass = (value: string) => {
  if (value.length >= 9) return 'display-value tight'
  if (value.length >= 7) return 'display-value compact'
  return 'display-value'
}

export function Display ({ operation, value }: Props) {
  return (
    <div className='display'>
      <div className='display-track'>{operation}</div>
      <output aria-label='display' className={valueClass(value)}>{value}</output>
    </div>
  )
}
