import { computed, h } from 'vue'
import { useData } from 'vitepress'
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
import Confetti from './Confetti.vue'
import DownloadsPage from './DownloadsPage.vue'
import HeroBackground from './Layout.vue'
import HomeHeroImage from './HomeHeroImage.vue'
import NavTitle from './NavTitle.vue'
import SiteFooter from './SiteFooter.vue'
import './style.css'

const theme: Theme = {
  extends: DefaultTheme,
  Layout: () => {
    const { frontmatter } = useData()
    const isDownloadsPage = computed(() => frontmatter.value.pageClass === 'downloads-page')

    return h(DefaultTheme.Layout, null, {
      'home-hero-before': () => [h(HeroBackground), !isDownloadsPage.value ? h(Confetti) : null],
      'home-hero-image': () => h(HomeHeroImage),
      ...(isDownloadsPage.value
        ? {
            'home-hero-info': () => h(DownloadsPage, { section: 'hero' }),
            'home-hero-after': () => h(DownloadsPage, { section: 'cards' })
          }
        : {}),
      'doc-before': () => h(Breadcrumbs),
      'layout-bottom': () => h(SiteFooter),
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
