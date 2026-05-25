export const KEYBOARD_MAP: Record<string, string> = {
  Enter: '=',
  '=': '=',
  Escape: 'clear',
  Backspace: 'clear',
  '+': '+',
  '-': '-',
  '*': '*',
  x: '*',
  X: '*',
  '/': '/',
  '%': '%',
  '.': '.',
  ',': '.'
}

for (const digit of ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']) {
  KEYBOARD_MAP[digit] = digit
}
