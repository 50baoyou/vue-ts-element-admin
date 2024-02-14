<template>
  <ElConfigProvider :locale="appStore.locale" :size="appStore.size">
    <RouterView />
  </ElConfigProvider>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
onMounted(() => {
  if (appStore.darkMode === 'dark') {
    document.documentElement.classList.add('dark')
  }
})
</script>
