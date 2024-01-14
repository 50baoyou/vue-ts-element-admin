import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv, ConfigEnv, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { createHtmlPlugin } from 'vite-plugin-html'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

import svgLoader from 'vite-svg-loader'

import UnoCSS from 'unocss/vite'

function path(url: string): string {
  return fileURLToPath(new URL(url, import.meta.url))
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  // 在开发环境下 command 的值为 serve（vite），而在生产环境下为 build（vite build）
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  const env = loadEnv(mode, process.cwd())

  const appConfig = {
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
          additionalData: `@use "@/styles/variables.scss" as *;`
        }
      }
    },
    plugins: [
      vue(),
      createHtmlPlugin({
        // 压缩 html
        minify: true,
        // 需要注入 index.html ejs 模版的数据
        inject: {
          data: {
            title: env.VITE_APP_TITLE
          }
        },
        // 如果 vite 版本高于 5.0.0-beta.13，可以将 viteNext 设置为 true 来进行兼容
        viteNext: true
      }),
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
    ]
  }

  const envConfig = (command: 'build' | 'serve') => {
    if (command === 'serve') {
      // dev 独有配置
      return {
        server: {
          // 允许IP访问
          host: true,
          // 应用端口 (默认:5173)
          port: env.VITE_APP_PORT,
          // 运行是否自动打开浏览器
          open: true,
          proxy: {
            // 需要代理的接口：env.VITE_APP_API
            [env.VITE_APP_API]: {
              // 允许跨域
              changeOrigin: true,
              // 目标接口
              target: '填写接口域名',
              // 重写请求路径
              rewrite: (path: string) => path.replace(new RegExp('^' + env.VITE_APP_API), '')
            }
          }
        }
      }
    }

    if (command === 'build') {
      // build 独有配置
      return {
        build: {
          // 消除打包大小超过500kb警告
          chunkSizeWarningLimit: 2000,
          // Vite 2.6.x 以上需要配置 minify: "terser", terserOptions 才能生效
          minify: 'terser',
          terserOptions: {
            compress: {
              // 防止 Infinity 被压缩成 1/0，这可能会导致 Chrome 上的性能问题
              keep_infinity: true,
              // 在生产环境中移除 console 语句，减少代码体积和避免在用户端显示日志信息
              drop_console: true,
              // 在生产环境中移除 debugger 语句，防止调试代码进入生产版本
              drop_debugger: true
            },
            format: {
              // 设置为 false 以删除代码中的注释
              comments: false
            }
          },
          rollupOptions: {
            output: {
              // manualChunks: {
              //   "vue-i18n": ["vue-i18n"],
              // },
              // 用于从入口点创建的块的打包输出格式 [name] 表示文件名，[hash] 表示该文件内容 hash 值
              entryFileNames: 'js/[name].[hash].js',
              // 用于命名代码拆分时创建的共享块的输出命名
              chunkFileNames: 'js/[name].[hash].js',
              // 用于输出静态资源的命名，[ext] 表示文件扩展名
              assetFileNames: (assetInfo: any) => {
                const info = assetInfo.name.split('.')
                let extType = info[info.length - 1]
                // console.log('文件信息', assetInfo.name)

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
    }
  }

  return {
    ...appConfig,
    ...envConfig(command)
  } as UserConfig
})
