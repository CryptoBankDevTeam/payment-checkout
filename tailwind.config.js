module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    
    extend: {
      textColor: {
        'primary': '#0056ab',
      },
      backgroundColor: theme => ({

        'primary': '#0056ab',
  
        // 'secondary': '#ffed4a',
  
        // 'danger': '#e3342f',
      }),
      backgroundImage: {
        'payWithCryptoBkg': "url('/src/images/payWithCryptoBkg.png')",
        'paymentStatusBkg': "url('/src/images/paymentStatusBkg.png')",
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
