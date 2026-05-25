import type { Meta, StoryObj } from '@storybook/react'
import { Calculator } from './Calculator'

const meta = { component: Calculator, title: 'Calculator/App' } satisfies Meta<typeof Calculator>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
