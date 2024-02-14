/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * 应用标题
   */
  readonly VITE_APP_TITLE: string
  /**
   * 应用端口
   */
  readonly ITE_APP_PORT: number
  /**
   * API路径(反向代理)
   */
  readonly VITE_APP_API: string
}

// 声明 env
interface ImportMeta {
  readonly env: ImportMetaEnv
}
