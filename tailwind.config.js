/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1230px',
      '2xl': '1230px'
    },
    extend: {
      fontFamily: {
        'default': ['Roboto', 'sans-serif'],
        'heading': ['Space Grotesk', 'sans-serif']
      },
      colors: {
        'primary': '#36BFFF',
        'highlight': '#F613FF',
        'backgroundGray': '#E6EAF5',
        'backgroundBox': '#FFFFFF',
        'backgroundOverlay': 'rgba(230,234,245,0.8)', // E6EAF5
        'backgroundOpacity8': 'rgba(229,231,235,0.8)',
        'backgroundOpacityGray8': 'rgba(233,236,247,0.8)',
        'heading': '#060E27',
        'subText': '#636180',
        'text': '#060E27',
        'border': '#E6EAF5',
        'borderTable': '#E0E4EF',
        // Dark version
        'backgroundDark': '#212452',
        'backgroundBoxDark': 'rgba(55,65,81,0.8)', 
        'backgroundButtonDark': '#132352',
        'backgroundOverlayDark': 'rgb(34,48,92,0.8)', // #22305C
        'headingDark': '#FFFFFF',
        'borderDark': '#36306D',
        'borderTableDark': '#7C748E',
      },
      backgroundImage: {
      },
      flex: {
        'flexMins': '0 0 calc(20% + 40px)',
        'flexMinsTab': '0 0 calc(20% + 20px)'
      },
      width: {
        'calc': 'calc(33.33333% - 20px)',
      },
      flexBasis: {
        fit: 'fit-content'
      }
    },
  },
  plugins: [
  ],
}
