// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ['expo', 'universe/native', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
};
