/*
 * @Author: genfa.zeng
 * @Date: 2021-02-01 10:14:04
 * @LastEditors: genfa.zeng
 * @LastEditTime: 2021-04-01 16:02:52
 * @Description:项目入口文件
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/scss/index.scss'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
