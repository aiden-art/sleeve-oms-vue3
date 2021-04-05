/*
 * @Author: genfa.zeng
 * @Date: 2021-02-01 10:14:04
 * @LastEditors: genfa.zeng
 * @LastEditTime: 2021-02-01 13:50:30
 * @Description:vite配置文件
 */
import { resolve } from 'path'
import type { UserConfig, ConfigEnv } from 'vite'
import { loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createProxy } from './build/vite/proxy'
import { wrapperEnv } from './build/utils'

const pathResolve = (dir: string): string => {
  return resolve(__dirname, '.', dir)
}
const alias: Record<string, string> = {
  '@': pathResolve('src'),
}

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfig => {
  const root: string = process.cwd()
  const env = loadEnv(mode, root)
  const viteEnv = wrapperEnv(env)
  const { VITE_PROXY } = viteEnv
  console.log(VITE_PROXY)
  return {
    resolve: {
      alias,
    },
    plugins: [vue()],
    server: {
      proxy: createProxy(VITE_PROXY),
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "./src/assets/scss/variable.scss";`,
        },
      },
    },
  }
}
