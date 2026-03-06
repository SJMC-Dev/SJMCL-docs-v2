import { defineConfig } from 'vitepress'

const BASE = '/sjmcl/'
const FAVICON_URL = `${BASE}logo.png`
const localSearch = {
  provider: 'local',
  options: {
    translations: {
      button: {
        buttonText: '搜索',
        buttonAriaLabel: '搜索'
      },
      modal: {
        resetButtonTitle: '清除查询条件',
        backButtonTitle: '关闭搜索',
        noResultsText: '未找到相关结果',
        displayDetails: '显示详细列表',
        footer: {
          selectText: '选择',
          selectKeyAriaLabel: '回车键',
          navigateText: '切换',
          navigateUpKeyAriaLabel: '向上方向键',
          navigateDownKeyAriaLabel: '向下方向键',
          closeText: '关闭',
          closeKeyAriaLabel: 'Esc 键'
        }
      }
    },
    locales: {
      en: {
        translations: {
          button: {
            buttonText: 'Search',
            buttonAriaLabel: 'Search'
          },
          modal: {
            resetButtonTitle: 'Clear query',
            backButtonTitle: 'Close search',
            noResultsText: 'No results found',
            displayDetails: 'Display detailed list',
            footer: {
              selectText: 'Select',
              selectKeyAriaLabel: 'Enter key',
              navigateText: 'Navigate',
              navigateUpKeyAriaLabel: 'Arrow up',
              navigateDownKeyAriaLabel: 'Arrow down',
              closeText: 'Close',
              closeKeyAriaLabel: 'Escape key'
            }
          }
        }
      }
    }
  }
} as const

function createBreadcrumbs(relativePath: string, title: string) {
  const normalized = relativePath.replace(/(^\/|\/$)/g, '')
  const segments = normalized.split('/').filter(Boolean)
  const contentSegments = segments[0] === 'en' ? segments.slice(1) : segments

  if (!segments.length || normalized === 'index.md')
    return []

  if (contentSegments[0] === 'blog')
    return []

  const isEnglish = segments[0] === 'en'
  const labels: Record<string, string> = isEnglish
    ? {
        docs: 'Docs',
        dev: 'Developers',
        blog: 'Blog',
        about: 'About'
      }
    : {
        docs: '文档',
        dev: '开发者',
        blog: '博客',
        about: '关于'
      }

  const breadcrumbs: { title: string; link: string }[] = []

  for (let i = isEnglish ? 1 : 0; i < segments.length; i++) {
    const segment = segments[i]

    if (segment === 'index.md')
      continue

    const isLast = i === segments.length - 1
    const breadcrumbTitle = isLast ? title : (labels[segment] || segment)
    const partial = segments.slice(0, i + 1).join('/')
    const link = isLast
      ? `/${partial.replace(/\.md$/, '')}`
      : `/${partial.replace(/\/index\.md$/, '/').replace(/index\.md$/, '')}`

    breadcrumbs.push({
      title: breadcrumbTitle,
      link: isLast ? link : (link.endsWith('/') ? link : `${link}/`)
    })
  }

  if (breadcrumbs.length > 1)
    breadcrumbs[breadcrumbs.length - 1].link = ''

  return breadcrumbs
}

const sharedThemeConfig = {
  logo: '/logo.png',
  siteTitle: false,
  socialLinks: [
    { icon: 'github', link: 'https://github.com/UNIkeEN/SJMCL' }
  ],
  search: localSearch
} as const

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'SJMC Launcher',
  description: 'Docs for the SJMC Launcher',
  base: BASE,
  themeConfig: {
    search: localSearch
  },
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: FAVICON_URL }],
    ['link', { rel: 'apple-touch-icon', href: FAVICON_URL }]
  ],
  lastUpdated: true,
  rewrites: (id) => id.startsWith('zh-Hans/') ? id.slice('zh-Hans/'.length) : id,
  vite: {
    optimizeDeps: {
      exclude: [
        '@nolebase/vitepress-plugin-breadcrumbs/client',
        '@nolebase/vitepress-plugin-enhanced-readabilities/client',
        'vitepress',
        '@nolebase/ui'
      ]
    },
    ssr: {
      noExternal: [
        '@nolebase/vitepress-plugin-breadcrumbs',
        '@nolebase/vitepress-plugin-enhanced-readabilities',
        '@nolebase/ui'
      ]
    }
  },
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        ...sharedThemeConfig,
        nav: [
          { text: '文档', link: '/docs/' },
          { text: '开发者', link: '/dev/' },
          { text: '博客', link: '/blog/' },
          { text: '关于', link: '/about/' }
        ],
        sidebar: {
          '/docs/': [
            {
              text: '文档',
              items: [
                { text: '简介', link: '/docs/' },
                { text: '更新日志', link: '/docs/changelog' },
                { text: '用户协议', link: '/docs/tos' }
              ]
            }
          ],
          '/dev/': [
            {
              text: '开发者',
              items: [
                { text: '概览', link: '/dev/' },
                { text: '开源协议', link: '/dev/license' }
              ]
            }
          ],
          '/about/': [
            {
              text: '关于',
              items: [
                { text: '关于我们', link: '/about/' }
              ]
            }
          ]
        },
        docFooter: {
          prev: '上一页',
          next: '下一页'
        },
        outline: {
          label: '页面导航'
        },
        lastUpdated: {
          text: '最后更新于',
          formatOptions: {
            dateStyle: 'short',
            timeStyle: 'medium'
          }
        },
        langMenuLabel: '多语言',
        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '主题',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式'
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      themeConfig: {
        ...sharedThemeConfig,
        nav: [
          { text: 'Docs', link: '/en/docs/' },
          { text: 'Developers', link: '/en/dev/' },
          { text: 'Blog', link: '/en/blog/' },
          { text: 'About', link: '/en/about/' }
        ],
        sidebar: {
          '/en/docs/': [
            {
              text: 'Docs',
              items: [
                { text: 'Introduction', link: '/en/docs/' },
                { text: 'Changelog', link: '/en/docs/changelog' },
                { text: 'Terms of Service', link: '/en/docs/tos' }
              ]
            }
          ],
          '/en/dev/': [
            {
              text: 'Developers',
              items: [
                { text: 'Overview', link: '/en/dev/' },
                { text: 'License', link: '/en/dev/license' }
              ]
            }
          ],
          '/en/about/': [
            {
              text: 'About',
              items: [
                { text: 'About Us', link: '/en/about/' }
              ]
            }
          ]
        },
        docFooter: {
          prev: 'Previous page',
          next: 'Next page'
        },
        outline: {
          label: 'On this page'
        },
        lastUpdated: {
          text: 'Last updated',
          formatOptions: {
            dateStyle: 'short',
            timeStyle: 'medium'
          }
        },
        langMenuLabel: 'Languages',
        returnToTopLabel: 'Back to top',
        sidebarMenuLabel: 'Menu',
        darkModeSwitchLabel: 'Appearance',
        lightModeSwitchTitle: 'Switch to light theme',
        darkModeSwitchTitle: 'Switch to dark theme'
      }
    }
  },
  transformPageData(pageData) {
    pageData.frontmatter.breadcrumbs = createBreadcrumbs(pageData.relativePath, pageData.title)
  }
})
