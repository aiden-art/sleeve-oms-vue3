import type { ProxyOptions } from 'vite'
type ProxyItem = {
  prefix: string
  target: string
}

export type ProxyList = ProxyItem[]

type ProxyTarget = Record<string, ProxyOptions>

const httpsRE = /^https:\/\//

export function createProxy(list: ProxyList): ProxyTarget {
  const proxyTarget: ProxyTarget = {}
  for (const { prefix, target } of list) {
    const isHttps = httpsRE.test(target)
    proxyTarget[prefix] = {
      target,
      changeOrigin: true,
      ws: true,
      rewrite: (path) => path.replace(new RegExp(`^${prefix}`), ''),
      //htttps下secure为false
      ...(isHttps ? { secure: false } : {}),
    }
    return proxyTarget
  }
}
