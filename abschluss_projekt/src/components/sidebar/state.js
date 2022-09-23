import { ref, computed } from 'vue/types/v3-generated'

export const collapsed = ref(false)
export const toggleSidebar = () => (collapsed.value = !collapsed.value)

export const SIDEBAR_WIDTH = 180
export const SIDEBAR_WIDTH_COLLAPSED = 180
export const sidebarWidth = computed()

