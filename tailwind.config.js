
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'green-100': '#d1fae5', // light green
        'green-800': '#065f46', // dark green
        'blue-100': '#dbeafe',
        'blue-800': '#1e40af',
        'red-100': '#fee2e2',
        'red-800': '#991b1b',
      },
     colors: {
        primary: '#4f46e5',
        'primary-dark': '#3730a3',
        accent: '#059669',
        'accent-dark': '#047857'
      },
       spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      borderRadius: {
        lg: '1rem',
        xl: '1.5rem'
      },
      fontSize: {
        '2xs': '.65rem',
        '3xl': '1.875rem'
      }
    },
  },
  plugins: [],
  safelist: [
    'bg-green-100', 'text-green-800', 
    'bg-blue-100', 'text-blue-800', 
    'bg-red-100', 'text-red-800',
    'border-transparent'
  ],
};
