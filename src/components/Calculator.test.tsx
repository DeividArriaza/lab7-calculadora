import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderCalculator } from '../test/utils'

const BUTTON_NAMES: Record<string, string[]> = {
  '+': ['Sumar'],
  '-': ['Restar'],
  '×': ['Multiplicar'],
  '÷': ['Dividir'],
  '.': ['Punto decimal'],
  '=': ['Resultado'],
  '%': ['Módulo'],
  '+/-': ['Cambiar signo'],
  C: ['Borrar actual', 'Borrar todo'],
  CA: ['Borrar todo']
}

const press = async (user: ReturnType<typeof renderCalculator>['user'], keys: string[]) => {
  for (const key of keys) {
    const button = (BUTTON_NAMES[key] ?? [`Número ${key}`])
      .map((name) => screen.queryByRole('button', { name }))
      .find(Boolean)
    if (!button) throw new Error(`No se encontró el botón ${key}`)
    await user.click(button)
  }
}

const display = () => screen.getByLabelText('display')

describe('Calculadora digital', () => {
  it('concatena dígitos y limita el display a nueve caracteres', async () => {
    const { user } = renderCalculator()
    await press(user, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'])
    expect(display()).toHaveTextContent('123456789')
  })

  it('limpia el display al ingresar el siguiente operando', async () => {
    const { user } = renderCalculator()
    await press(user, ['4', '+', '9'])
    expect(display()).toHaveTextContent('9')
  })

  it('muestra la operación en curso mientras se escribe', async () => {
    const { user } = renderCalculator()
    await press(user, ['1', '0', '0', '0', '×', '1', '0', '0'])
    expect(screen.getByText('1000 × 100')).toBeInTheDocument()
    expect(display()).toHaveTextContent('100')
  })

  it('resuelve operaciones encadenadas al presionar otro operador', async () => {
    const { user } = renderCalculator()
    await press(user, ['7', '+', '8', '×'])
    expect(display()).toHaveTextContent('15')
  })

  it('muestra un decimal ajustado al límite de nueve caracteres', async () => {
    const { user } = renderCalculator()
    await press(user, ['2', '2', '÷', '7', '='])
    expect(display()).toHaveTextContent('3.1428571')
  })

  it('muestra Error cuando el resultado es negativo o excede el máximo', async () => {
    const { user } = renderCalculator()
    await press(user, ['2', '-', '5', '='])
    expect(display()).toHaveTextContent('Error')
    await press(user, ['CA', '9', '9', '9', '9', '9', '9', '9', '9', '9', '+', '1', '='])
    expect(display()).toHaveTextContent('Error')
  })

  it('permite cambiar el signo y calcular módulo', async () => {
    const { user } = renderCalculator()
    await press(user, ['8', '+/-', '+/-', '%', '3', '='])
    expect(display()).toHaveTextContent('2')
  })
})
