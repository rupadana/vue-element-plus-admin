import 'vue/jsx'

// Importwindi css
import '@/plugins/unocss'

// ImportGlobalofsvgIcon
import '@/plugins/svgIcon'

// Initial化多Language
import { setupI18n } from '@/plugins/vueI18n'

// ImportStatus管理
import { setupStore } from '@/store'

// GlobalGroup件
import { setupGlobCom } from '@/components'

// Importelement-plus
import { setupElementPlus } from '@/plugins/elementPlus'

// ImportGlobalStyle
import '@/styles/index.less'

// ImportAnimation
import '@/plugins/animate.css'

// Route
import { setupRouter } from './router'

// 权限
import { setupPermission } from './directives'

import { createApp } from 'vue'

import App from './App.vue'

import './permission'

// CreateInstance
const setupAll = async () => {
  const app = createApp(App)

  await setupI18n(app)

  setupStore(app)

  setupGlobCom(app)

  setupElementPlus(app)

  setupRouter(app)

  setupPermission(app)

  app.mount('#app')
}

setupAll()
