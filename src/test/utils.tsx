import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

export const renderCalculator = () => {
  const user = userEvent.setup()
  return { user, ...render(<App />) }
}
