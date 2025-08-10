/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: 'class',
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light', 'dark'],
    darkTheme: 'dark',
    base: true,
    styled: true,
    utils: true,
    prefix: '',
    logs: false,
    themeRoot: ':root',
  },
  theme: {
    extend: {
      transitionDuration: {
        'DEFAULT': '150ms',
      },
      transitionTimingFunction: {
        'DEFAULT': 'ease',
      },
    },
  },
}

export default config;