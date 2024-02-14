/**
 * 登录请求参数
 */
interface LoginData {
  /**
   * 用户名
   */
  username: string
  /**
   * 密码
   */
  password: string

  /**
   * 验证码缓存key
   */
  captchaKey?: string

  /**
   * 验证码
   */
  captchaCode?: string
}
