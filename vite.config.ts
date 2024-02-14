import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv, ConfigEnv, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { compression } from 'vite-plugin-compression2'
import { createHtmlPlugin } from 'vite-plugin-html'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import svgLoader from 'vite-svg-loader'
import UnoCSS from 'unocss/vite'
import mockDevServerPlugin from 'vite-plugin-mock-dev-server'

function path(url: string): string {
  return fileURLToPath(new URL(url, import.meta.url))
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  // 在开发环境下 command 的值为 serve（vite），而在生产环境下为 build（vite build）
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  const env = loadEnv(mode, process.cwd())

  return {
    // 删除所以控制台和调试语句
    esbuild: {
      drop: ['console', 'debugger']
    },
    plugins: [
      vue(),
      mockDevServerPlugin(),
      compression({
        include: ['js', 'css'],
        threshold: 500
      }),
      createHtmlPlugin({
        // 压缩 html
        minify: true,
        // 如果 vite 版本高于 5.0.0-beta.13，可以将 viteNext 设置为 true 来进行兼容
        viteNext: true
      }),
      ViteImageOptimizer(),
      svgLoader(),
      UnoCSS(),
      Icons({
        // 自动安装图标库
        autoInstall: true
      }),
      AutoImport({
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: ['vue'],
        // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
        resolvers: [ElementPlusResolver(), IconsResolver({})],
        eslintrc: {
          // 是否自动生成 eslint 规则，建议生成之后设置 false
          enabled: false,
          // 指定自动导入函数 eslint 规则的文件
          filepath: './.eslintrc-auto-import.json'
        },
        // 是否在 vue 模板中自动导入
        vueTemplate: true,
        // 指定自动导入函数TS类型声明文件路径
        dts: path('./src/types/auto-imports.d.ts')
      }),
      Components({
        resolvers: [
          // 自动导入 Element Plus 组件
          ElementPlusResolver(),
          // 自动注册图标组件
          IconsResolver({
            // element-plus图标库，其他图标库 https://icon-sets.iconify.design/
            enabledCollections: ['ep']
          })
        ],
        // 指定自动导入组件TS类型声明文件路径
        dts: path('./src/types/components.d.ts')
      })
    ],
    resolve: {
      alias: {
        '@': path('./src')
      }
    },
    css: {
      // CSS 预处理器
      preprocessorOptions: {
        // 定义全局 SCSS 变量
        scss: {
          additionalData: `@use "@/styles/variables.scss" as globalScss;`
        }
      }
    },
    server: {
      // 允许IP访问
      host: true,
      // 应用端口 (默认:5173)
      port: Number(env.VITE_APP_PORT),
      // 运行是否自动打开浏览器
      open: true,
      proxy: {
        // 需要代理的接口：env.VITE_APP_API
        [env.VITE_APP_API]: {
          // 允许跨域
          changeOrigin: true,
          // 目标接口
          target: `http://localhost:${env.VITE_APP_PORT}`,
          // 重写请求路径
          rewrite: (path: string) => path.replace(new RegExp('^' + env.VITE_APP_API), '')
        }
      }
    },
    build: {
      rollupOptions: {
        output: {
          // 拆分 chunk
          manualChunks(id: string) {
            if (id.includes('node_modules')) {
              if (id.includes('element-plus')) {
                return 'chunk_element_plus'
              }
              if (id.includes('vue') || id.includes('pinia')) {
                return 'chunk_vue'
              }
              if (id.includes('unocss')) {
                return 'chunk_unocss'
              }
              if (id.includes('lodash-es') || id.includes('axios')) {
                return 'chunk_utils'
              }

              return 'chunk_others'
            }
          },
          // 用于从入口点创建的块的打包输出格式 [name] 表示文件名，[hash] 表示该文件内容 hash 值
          entryFileNames: 'js/[name].[hash].js',
          // 用于命名代码拆分时创建的共享块的输出命名
          chunkFileNames: 'js/[name].[hash].js',
          // 用于输出静态资源的命名，[ext] 表示文件扩展名
          assetFileNames: (assetInfo: any) => {
            const info = assetInfo.name.split('.')
            let extType = info[info.length - 1]
            if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)) {
              extType = 'media'
            } else if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(assetInfo.name)) {
              extType = 'img'
            } else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
              extType = 'fonts'
            }
            return `${extType}/[name].[hash].[ext]`
          }
        }
      }
    }
  }
})
