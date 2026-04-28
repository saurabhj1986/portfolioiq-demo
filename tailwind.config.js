/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sfnavy: '#032D60',
        sfdeep: '#0B5CAB',
        sfblue: '#0176D3',
        sflight: '#00A1E0',
        sfbg: '#F3F6FA',
        sfmuted: '#5C7290',
        sgreen: '#2E844A',
        syellow: '#FE9339',
        sred: '#BA0517',
        sgray: '#747474'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace']
      },
      boxShadow: {
        card: '0 1px 3px rgba(3, 45, 96, 0.06), 0 1px 2px rgba(3, 45, 96, 0.04)',
        cardHover: '0 4px 12px rgba(3, 45, 96, 0.10)'
      }
    }
  },
  plugins: []
};
