/*
 * @Author: genfa.zeng
 * @Date: 2022-03-13 14:33:43
 * @LastEditors: genfa.zeng
 * @LastEditTime: 2022-03-13 14:58:40
 * @FilePath: /sleeve-oms/tailwind.config.js
 * @Description:tailwind配置
 */
module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    spacing: {
      1: '8px',
      2: '12px',
      3: '16px',
      4: '24px',
      5: '32px',
      6: '48px',
    },
    width: {
      60: '60px',
      80: '80px',
      '1/3': '33.33%',
      full: '100%',
    },
    maxWidth: {
      '1/10': '10%',
      '1/5': '20%',
      '1/3': '33.33%',
      '1/2': '50%',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
