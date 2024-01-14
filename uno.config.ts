import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  // UnoCSS 配置
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      // 将图标集合作为异步块进行打包并按需加载
      collections: {
        bi: () => import('@iconify-json/bi/icons.json').then((i) => i.default)
      }
    })
  ]
})
