import { defineStore } from 'pinia'
import defaultSettings from '@/setting/settings'

// 导入 Element Plus 中英文语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'

export const useAppStore = defineStore(
  'app',
  () => {
    // state
    const title = ref(defaultSettings.title)
    const darkMode = ref(defaultSettings.darkMode)
    const language = ref(defaultSettings.language)
    const size = ref(defaultSettings.size)

    // getters
    const locale = computed(() => {
      if (language.value === 'en') {
        return en
      } else {
        return zhCn
      }
    })

    // actions

    /**
     * 切换语言
     *
     * @param val
     */
    function changeLanguage(val: string) {
      language.value = val
    }

    return { title, darkMode, language, size, locale, changeLanguage }
  },
  {
    persist: {
      key: 'app-store'
    }
  }
)
