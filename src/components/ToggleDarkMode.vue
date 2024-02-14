<template>
  <ElSwitch
    class="cursor-pointer"
    id="darkModeSwitch"
    v-model="isDark"
    @change="changeDark"
    :beforeChange="useDark"
    inline-prompt
    :active-action-icon="Moon"
    :inactive-action-icon="Sunny"
    active-color="var(--el-fill-color-dark)"
    inactive-color="#16baaa"
  ></ElSwitch>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { domToCanvas } from 'modern-screenshot'
import gsap from 'gsap'

import { Sunny, Moon } from '@element-plus/icons-vue'
import { isNull } from 'lodash-es'

const appStore = useAppStore()

// 暗黑模式切换
const isDark = ref<boolean>(appStore.darkMode === 'dark')
const changeDark = () => {
  // 切换主题模式
  if (isDark.value) {
    appStore.darkMode = 'dark'
    document.documentElement.classList.add('dark')
  } else {
    appStore.darkMode = 'light'
    document.documentElement.classList.remove('dark')
  }
}
const useDark = async () => {
  // 获取挂载 DOM
  const el = document.getElementById('app')
  if (isNull(el)) {
    console.log('Unable to get dom for #app')
    return false
  }

  // 获取按钮 DOM
  const btn = document.getElementById('darkModeSwitch')
  if (isNull(btn)) {
    console.log('Unable to get dom for #darkModeSwitch')
    return false
  }

  const rect = el.getBoundingClientRect()
  const btnRect = btn.getBoundingClientRect()

  // 绘制画布
  const canvas = await domToCanvas(el, { width: rect.width, height: rect.height, scale: 2 })
  canvas.style.position = 'fixed'
  canvas.style.left = '0px'
  canvas.style.top = '0px'
  el.appendChild(canvas)

  // 创建二维绘图对象
  const context = canvas.getContext('2d')
  if (isNull(context)) {
    console.log('Unable to get 2D context for canvas')
    return false
  }

  // 设置合成操作的类型
  // destination-in：仅保留现有画布内容和新形状重叠的部分。其他的都是透明的
  // destination-out：仅保留现有画布内容和新形状不重叠的部分
  context.globalCompositeOperation = isDark.value ? 'destination-out' : 'destination-in'

  // 比例
  const scale = 2

  // 计算坐标
  const x = (btnRect.left + btnRect.width / 2) * scale
  const y = (btnRect.top + btnRect.height / 2) * scale

  // 计算最大距离
  const maxDistance = getMaxDistanceBoundaryPoint(x, y, rect)

  // 初始半径
  const initialRadius = isDark.value ? 0 : maxDistance

  // 目标半径
  const targetRadius = isDark.value ? maxDistance : 0

  // 定义动画初始属性
  const circle = {
    x: x,
    y: y,
    radius: initialRadius
  }

  // 绘制方法
  function draw(context: CanvasRenderingContext2D) {
    context.beginPath()
    context.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, false)
    context.fill()
    context.beginPath()
  }

  // 使用 GSAP 动画
  gsap.to(circle, {
    radius: targetRadius,
    ease: isDark.value ? 'power2.out' : 'power2.in',
    duration: 0.6,
    onUpdate: () => {
      draw(context)
    },
    onComplete: () => {
      el.removeChild(canvas)
    }
  })

  return true
}

// 获取坐标到视口边界点的最长距离
function getMaxDistanceBoundaryPoint(x: number, y: number, rect: DOMRect): number {
  const width = rect.width
  const height = rect.height

  const distances = [
    Math.sqrt(x ** 2 + y ** 2),
    Math.sqrt((width - x) ** 2 + y ** 2),
    Math.sqrt(x ** 2 + (height - y) ** 2),
    Math.sqrt((width - x) ** 2 + (height - y) ** 2)
  ]

  return Math.max(...distances)
}
</script>
