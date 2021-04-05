import { ProxyList } from './vite/proxy'

export interface ViteEnv {
  VITE_PROXY: ProxyList
}

//读取env配置文件下的环境变量
export function wrapperEnv(envConf: any): ViteEnv {
  const viteEnv: any = {}

  for (const envName of Object.keys(envConf)) {
    let envVal = envConf[envName]
    envVal = envVal === 'true' ? true : envVal === 'false' ? false : envVal
    switch (envName) {
      case 'VITE_PROXY':
        try {
          envVal = JSON.parse(envVal)
        } catch (err) {}
        break
      default:
        break
    }
    viteEnv[envName] = envVal
    process.env[envName] = envVal
    return viteEnv
  }
}
