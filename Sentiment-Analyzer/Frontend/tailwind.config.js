export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 20px 50px rgba(15, 23, 42, 0.12)',
      },
      backgroundImage: {
        'glass-gradient': 'radial-gradient(circle at top left, rgba(56, 189, 248, 0.16), transparent 35%), radial-gradient(circle at bottom right, rgba(249, 115, 22, 0.14), transparent 28%)',
      },
    },
  },
  plugins: [],
}
