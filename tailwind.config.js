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
        'payWithCryptoBg': "url('/src/images/payWithCryptoBg.png')",
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
