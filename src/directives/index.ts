import type { App } from 'vue'
import { setupPermissionDirective } from './permission/hasPermi'

/**
 * Export指令：v-xxx
 * @methods hasPermi By钮权限，用法: v-hasPermi
 */
export const setupPermission = (app: App<Element>) => {
  setupPermissionDirective(app)
}
