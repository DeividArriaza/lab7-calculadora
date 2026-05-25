import type { Meta, StoryObj } from '@storybook/react'
import { CalcButton } from './CalcButton'

const meta = {
  component: CalcButton,
  title: 'Calculator/Button',
  args: { activeOperator: null, ariaLabel: 'Número 7', clearLabel: 'C', onPress: () => undefined, pressedKey: null }
} satisfies Meta<typeof CalcButton>

export default meta

type Story = StoryObj<typeof meta>

export const NumberKey: Story = { args: { label: '7', value: '7', tone: 'number' } }

export const ActionKey: Story = { args: { ariaLabel: 'Dividir', label: '÷', value: '/', tone: 'operator' } }

export const WideKey: Story = { args: { ariaLabel: 'Número 0', label: '0', value: '0', tone: 'number', wide: true } }
