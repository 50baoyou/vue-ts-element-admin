// 浏览器样式重置
import '@unocss/reset/tailwind-compat.css'
import '@/styles/index.scss'
import 'element-plus/theme-chalk/src/dark/css-vars.scss'
// 注意：项目内的样式，最好放在重置样式后，uno.css前
import 'virtual:uno.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// 注册 pinia 持久化插件
// 用法：创建 Store 时，将 persist 选项设置为 true
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

app.mount('#app')
