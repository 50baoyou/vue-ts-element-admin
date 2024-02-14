<template>
  <div
    ref="loginRef"
    class="login-wraper"
    grid="~"
    place-items="center"
    w="full"
    h="full"
    bg="cover no-repeat fixed"
  >
    <!-- 登陆表单 -->
    <div class="login-container" grid="~" b-rd="1">
      <div class="login-side" p="10">
        <h1 font-size="7" text="center white">{{ appStore.title }}</h1>
        <h3 my="3" font-size="4" text="center white">凑合着用的前端模板</h3>
        <IconLoginSideBg mx="auto" />
      </div>

      <div p="5">
        <div flex="~" mt="2" mb="10" w="full" font-size="5">
          <IconLoginLogo w="8" h="8" mr="3" />
          <span>Sign in</span>
          <ToggleDarkMode flex="grow justify-end" />
        </div>
        <ElForm ref="loginFormRef" :model="loginForm" :rules="loginRules">
          <ElFormItem prop="username">
            <ElInput
              :prefix-icon="User"
              v-model="loginForm.username"
              type="text"
              placeholder="用户名"
              autocomplete="off"
              size="large"
            />
          </ElFormItem>
          <ElFormItem prop="password">
            <ElInput
              :prefix-icon="Lock"
              v-model="loginForm.password"
              type="password"
              placeholder="密码"
              autocomplete="off"
              show-password
              size="large"
            />
          </ElFormItem>
          <ElFormItem prop="captchaCode">
            <div flex="~" w="full">
              <ElInput
                :prefix-icon="Key"
                v-model="loginForm.captchaCode"
                type="password"
                placeholder="验证码"
                autocomplete="off"
                size="large"
              />
              <div id="demo" ml="2" w="30" color="white">验证码</div>
            </div>
          </ElFormItem>
          <ElButton size="large" class="login-btn" w="full">登录</ElButton>
        </ElForm>

        <div flex="~" mt="5" ml="auto">
          <span font-size="3">多语言设置</span>
          <IconLoginLanguage ml="2" w="5" h="5" />
        </div>
        <!-- 测试账号 -->
        <ElDivider>测试账号</ElDivider>
        <div font-size="3" text="center">
          <span>用户名：admin</span>
          <span ml="5">密码：123456</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import type { FormInstance, FormRules } from 'element-plus'

// 组件
import ToggleDarkMode from '@/components/ToggleDarkMode.vue'

// 图标
import { User, Key, Lock } from '@element-plus/icons-vue'
import IconLoginSideBg from '@/assets/login/login-side-bg.svg'
import IconLoginLogo from '@/assets/login/login-logo.svg'
import IconLoginLanguage from '@/assets/login/login-language.svg'

const appStore = useAppStore()

// 用户表单
const loginFormRef = ref<FormInstance>()
const loginForm = ref<LoginData>({
  username: '',
  password: '',
  captchaCode: ''
})

// 自定义校验规则
const validateUser = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback('请输入用户名')
  } else {
    callback()
  }
}
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback('请输入密码')
  } else {
    callback()
  }
}
const loginRules = ref<FormRules<typeof loginForm>>({
  username: [{ validator: validateUser, trigger: 'blur' }],
  password: [{ validator: validatePass, trigger: 'blur' }]
})
</script>

<style lang="scss" scoped>
.login-wraper {
  background-image: url('@/assets/login/login-bg.png');

  .login-container {
    grid-template-columns: 26.25rem 26.25rem;
    background-color: hsl(0deg 0% 100% / 50%);
    backdrop-filter: blur(30px);
    box-shadow: 6px 6px 12px 4px rgb(0 0 0 / 10%);

    .login-side {
      background-color: #16baaa;
    }

    .login-btn {
      color: #fff;
      background-color: #16baaa;
    }
  }
}

.dark .login-wraper {
  background-image: url('@/assets/login/login-bg-dark.jpg');

  .login-container {
    background-color: #424242;

    .login-side {
      background-color: #141414;
    }

    .login-btn {
      background-color: #141414;
    }
  }
}
</style>
