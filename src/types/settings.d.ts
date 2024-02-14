/**
 * 系统设置
 */
interface AppSettings {
  /** 系统标题 */
  title: string
  /** 系统版本 */
  version: string
  /** 是否显示设置 */
  showSettings: boolean
  /** 是否固定头部 */
  fixedHeader: boolean
  /** 是否显示多标签导航 */
  tagsView: boolean
  /** 是否显示侧边栏Logo */
  sidebarLogo: boolean
  /** 导航栏布局(left|top|mix) */
  layout: string
  /** 主题颜色 */
  themeColor: string
  /** 黑暗模式(dark|light) */
  darkMode: 'dark' | 'light'
  /** 布局大小(default|large|small) */
  size: 'default' | 'large' | 'small'
  /** 语言( zh-cn|en) */
  language: string
  /** 水印配置 */
  watermark: {
    /** 是否开启水印 */
    enabled: boolean
    /** 水印内容 */
    content: string
  }
}
