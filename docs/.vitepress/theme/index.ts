import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import {
  NolebaseEnhancedReadabilitiesMenu,
  NolebaseEnhancedReadabilitiesPlugin,
  NolebaseEnhancedReadabilitiesScreenMenu,
  type Options as NolebaseEnhancedReadabilitiesOptions
} from '@nolebase/vitepress-plugin-enhanced-readabilities/client'
import '@nolebase/vitepress-plugin-enhanced-readabilities/client/style.css'
import Breadcrumbs from './Breadcrumbs.vue'
import HeroBackground from './Layout.vue'
import NavTitle from './NavTitle.vue'
import './style.css'

const theme: Theme = {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'home-hero-before': () => h(HeroBackground),
      'doc-before': () => h(Breadcrumbs),
      'nav-bar-title-after': () => h(NavTitle),
      'nav-bar-content-after': () => h(NolebaseEnhancedReadabilitiesMenu),
      'nav-screen-content-after': () => h(NolebaseEnhancedReadabilitiesScreenMenu)
    })
  },
  enhanceApp({ app }) {
    app.use(NolebaseEnhancedReadabilitiesPlugin, {
      spotlight: {
        hoverBlockColor: 'rgb(43 108 176 / 12%)'
      },
      locales: {
        'zh-CN': {
          title: {
            title: '阅读增强'
          }
        },
        en: {
          title: {
            title: 'Enhanced Readabilities'
          }
        }
      }
    } satisfies NolebaseEnhancedReadabilitiesOptions)
  }
}

export default theme
