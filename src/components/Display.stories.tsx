import type { Meta, StoryObj } from '@storybook/react'
import { Display } from './Display'

const meta = {
  component: Display,
  title: 'Calculator/Display',
  args: { operation: '248 × 12 +' }
} satisfies Meta<typeof Display>

export default meta

type Story = StoryObj<typeof meta>

export const NumberState: Story = { args: { value: '31415926' } }

export const ErrorState: Story = { args: { value: 'ERROR' } }
