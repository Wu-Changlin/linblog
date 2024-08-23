import { ref, watchEffect } from 'vue'

// 从取缓存中取值，给个默认值。
const theme = ref(localStorage.getItem('theme') || 'light')

// 每次改变都设置一下属性，并存到缓存中。
watchEffect(() => {
  document.documentElement.setAttribute('data-theme', theme.value)
  localStorage.setItem('theme', theme.value)
})

export default function useTheme() {
  return {
    theme
  }
}