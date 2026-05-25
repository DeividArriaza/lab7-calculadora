import type { Meta, StoryObj } from '@storybook/react'
import { CalcButton } from './CalcButton'

const meta = {
  component: CalcButton,
  title: 'Calculator/Button',
  args: { ariaLabel: 'Number 7', isActive: false, isPressed: false, onPress: () => undefined }
} satisfies Meta<typeof CalcButton>

export default meta

type Story = StoryObj<typeof meta>

export const NumberKey: Story = { args: { label: '7', value: '7', tone: 'number' } }

export const ActionKey: Story = { args: { ariaLabel: 'Divide', label: '÷', value: '/', tone: 'accent' } }

export const WideKey: Story = { args: { ariaLabel: 'Number 0', label: '0', value: '0', tone: 'number', wide: true } }
