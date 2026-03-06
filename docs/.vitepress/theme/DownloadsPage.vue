<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useData } from 'vitepress'
import { VPButton } from 'vitepress/theme'
import { icons as simpleIcons } from '@iconify-json/simple-icons'

type ReleaseFile = {
  name: string
  size: number
}

type ReleaseResponse = {
  version?: string
  files?: ReleaseFile[]
}

type DownloadButton = {
  label: string
  href: string
}

type CardData = {
  key: 'windows' | 'macos' | 'linux'
  title: string
  description: string
  iconSvg: string
  buttons: DownloadButton[]
}

const props = defineProps<{
  section: 'hero' | 'cards'
}>()

const API_URL = 'https://mc.sjtu.cn/api-sjmcl/releases/latest'
const DOWNLOAD_BASE_URL = 'https://mc.sjtu.cn/sjmcl/releases/'
const GITHUB_RELEASES_URL = 'https://github.com/UNIkeEN/SJMCL/releases'

const { frontmatter, lang } = useData()
const sharedRelease = ref<ReleaseResponse | null>(null)
const sharedLoadFailed = ref(false)

let sharedLoadPromise: Promise<void> | null = null

const isDownloadsPage = computed(() => frontmatter.value.pageClass === 'downloads-page')
const isEnglish = computed(() => lang.value === 'en-US')
const release = computed(() => sharedRelease.value)
const loadFailed = computed(() => sharedLoadFailed.value)

function iconSvg(name: 'windows' | 'apple' | 'linux') {
  const icon = simpleIcons.icons[name]

  return `<svg viewBox="0 0 ${simpleIcons.width} ${simpleIcons.height}" aria-hidden="true" focusable="false">${icon.body}</svg>`
}

const messages = computed(() => {
  if (isEnglish.value) {
    return {
      title: 'Download',
      latestVersion: 'Latest version',
      detecting: 'Detecting your platform',
      failed: 'Unable to load the latest version',
      windows: 'Windows',
      macos: 'macOS',
      linux: 'Linux',
      windowsDesc: 'Setup and portable builds for x86, x64 and ARM64.',
      macosDesc: 'DMG installers and app bundles for Apple Silicon and Intel.',
      linuxDesc: 'AppImage, DEB, RPM and portable builds for desktop Linux.',
      unknownDownload: 'Download latest build',
      setup: 'Setup',
      portable: 'Portable',
      dmg: 'DMG',
      appBundle: 'App Bundle',
      appImage: 'AppImage',
      deb: 'DEB',
      rpm: 'RPM',
      arm64: 'ARM64',
      x64: 'x64',
      x86: 'x86',
      intel: 'Intel',
      appleSilicon: 'Apple Silicon',
      downloadLabel: 'Download',
      historyLinkText: 'View historical versions on GitHub Releases'
    }
  }

  return {
    title: '下载',
    latestVersion: '最新版本',
    detecting: '正在识别你的平台',
    failed: '暂时无法获取最新版本',
    windows: 'Windows',
    macos: 'macOS',
    linux: 'Linux',
    windowsDesc: '提供 x86、x64、ARM64 的安装版与便携版。',
    macosDesc: '提供 Apple Silicon 与 Intel 的 DMG 和 App Bundle。',
    linuxDesc: '提供 AppImage、DEB、RPM 与便携版。',
    unknownDownload: '下载最新版本',
    setup: '安装版',
    portable: '便携版',
    dmg: 'DMG',
    appBundle: 'App Bundle',
    appImage: 'AppImage',
    deb: 'DEB',
    rpm: 'RPM',
    arm64: 'ARM64',
    x64: 'x64',
    x86: 'x86',
    intel: 'Intel',
    appleSilicon: 'Apple Silicon',
    downloadLabel: '下载',
    historyLinkText: '在 GitHub Releases 查看历史版本'
  }
})

function formatSize(size: number) {
  if (size <= 0)
    return ''

  const units = ['B', 'KB', 'MB', 'GB']
  let value = size
  let unitIndex = 0

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }

  const digits = value >= 100 || unitIndex === 0 ? 0 : 1

  return `${value.toFixed(digits)} ${units[unitIndex]}`
}

function fileUrl(name: string) {
  return `${DOWNLOAD_BASE_URL}${name}`
}

function normalizeArch(name: string) {
  if (name.includes('aarch64'))
    return 'arm64'
  if (name.includes('x86_64'))
    return 'x64'
  if (name.includes('i686'))
    return 'x86'
  return 'x64'
}

function archLabel(arch: string) {
  switch (arch) {
    case 'arm64':
      return messages.value.arm64
    case 'x86':
      return messages.value.x86
    case 'x64':
      return messages.value.x64
    default:
      return arch
  }
}

function sortFiles(files: ReleaseFile[]) {
  const formatOrder = ['setup', 'portable', 'dmg', 'bundle', 'appimage', 'deb', 'rpm']
  const archOrder = ['x64', 'x86', 'arm64']

  return [...files].sort((left, right) => {
    const leftName = left.name.toLowerCase()
    const rightName = right.name.toLowerCase()

    const leftFormat = formatOrder.findIndex((format) => leftName.includes(format))
    const rightFormat = formatOrder.findIndex((format) => rightName.includes(format))

    if (leftFormat !== rightFormat)
      return leftFormat - rightFormat

    return archOrder.indexOf(normalizeArch(left.name)) - archOrder.indexOf(normalizeArch(right.name))
  })
}

function buttonLabel(file: ReleaseFile) {
  const name = file.name.toLowerCase()
  const arch = archLabel(normalizeArch(file.name))
  let format = messages.value.portable

  if (name.includes('setup.exe'))
    format = messages.value.setup
  else if (name.includes('.dmg'))
    format = messages.value.dmg
  else if (name.includes('.app.tar.gz'))
    format = messages.value.appBundle
  else if (name.includes('.appimage'))
    format = messages.value.appImage
  else if (name.endsWith('.deb'))
    format = messages.value.deb
  else if (name.endsWith('.rpm'))
    format = messages.value.rpm

  const size = formatSize(file.size)

  return size ? `${format} ${arch} · ${size}` : `${format} ${arch}`
}

function createButtons(files: ReleaseFile[]) {
  return sortFiles(files).map((file) => ({
    label: buttonLabel(file),
    href: fileUrl(file.name)
  }))
}

function autoDownloadLabel(file: ReleaseFile) {
  const name = file.name.toLowerCase()

  if (name.includes('_windows_i686_'))
    return `${messages.value.downloadLabel} Windows (32位) 版`

  if (name.includes('_windows_x86_64_'))
    return `${messages.value.downloadLabel} Windows (64位) 版`

  if (name.includes('_windows_aarch64_'))
    return `${messages.value.downloadLabel} Windows (ARM64) 版`

  if (name.includes('_macos_aarch64.'))
    return `${messages.value.downloadLabel} macOS (${messages.value.appleSilicon}) 版`

  if (name.includes('_macos_x86_64.'))
    return `${messages.value.downloadLabel} macOS (${messages.value.intel}) 版`

  if (name.includes('_linux_aarch64.'))
    return `${messages.value.downloadLabel} Linux (ARM64) 版`

  if (name.includes('_linux_x86_64.'))
    return `${messages.value.downloadLabel} Linux (x86_64) 版`

  return messages.value.unknownDownload
}

async function ensureReleaseLoaded() {
  if (!isDownloadsPage.value || sharedRelease.value || sharedLoadFailed.value)
    return

  if (!sharedLoadPromise) {
    const requestUrl = typeof window === 'undefined'
      ? API_URL
      : (window.location.hostname === 'mc.sjtu.cn' ? API_URL : '/api-sjmcl/releases/latest')

    sharedLoadPromise = fetch(requestUrl, {
      headers: {
        Accept: 'application/json'
      }
    })
      .then(async (response) => {
        if (!response.ok)
          throw new Error(`Unexpected response: ${response.status} ${response.statusText}`)

        const data = await response.json() as ReleaseResponse
        sharedRelease.value = {
          version: data.version || '',
          files: data.files || []
        }
      })
      .catch((error) => {
        sharedLoadFailed.value = true
        if (typeof window !== 'undefined') {
          console.error('[DownloadsPage] Failed to load latest release', {
            requestUrl,
            pageUrl: window.location.href,
            error
          })
        }
      })
      .finally(() => {
        sharedLoadPromise = null
      })
  }

  await sharedLoadPromise
}

function detectAutoDownload(files: ReleaseFile[]) {
  const fallbackFile = files.find((file) => file.name.includes('windows_x86_64_portable.exe'))
    || files.find((file) => file.name.includes('windows_x86_64_setup.exe'))
    || files.find((file) => file.name.includes('linux_x86_64.portable'))
    || files[0]

  if (typeof navigator === 'undefined')
    return fallbackFile

  const platform = navigator.platform.toLowerCase()
  const userAgent = navigator.userAgent.toLowerCase()
  const pointer = navigator.userAgentData?.platform?.toLowerCase?.() || ''
  const source = `${platform} ${pointer} ${userAgent}`
  const isArm = source.includes('arm') || source.includes('aarch64') || source.includes('apple')

  if (source.includes('mac')) {
    return files.find((file) => isArm
      ? file.name.includes('macos_aarch64.dmg')
      : file.name.includes('macos_x86_64.dmg'))
      || files.find((file) => file.name.includes('macos_') && file.name.endsWith('.dmg'))
      || fallbackFile
  }

  if (source.includes('linux')) {
    return files.find((file) => isArm
      ? file.name.includes('linux_aarch64.portable')
      : file.name.includes('linux_x86_64.portable'))
      || files.find((file) => isArm
        ? file.name.includes('linux_aarch64.AppImage')
        : file.name.includes('linux_x86_64.AppImage'))
      || files.find((file) => file.name.includes('linux_') && file.name.includes('.portable'))
      || files.find((file) => file.name.includes('linux_') && file.name.endsWith('.AppImage'))
      || fallbackFile
  }

  if (source.includes('win')) {
    if (isArm) {
      return files.find((file) => file.name.includes('windows_aarch64_portable.exe'))
        || files.find((file) => file.name.includes('windows_aarch64_setup.exe'))
        || fallbackFile
    }

    const is32Bit = source.includes('i686') || source.includes('x86') || source.includes('win32')

    return files.find((file) => is32Bit
      ? file.name.includes('windows_i686_portable.exe')
      : file.name.includes('windows_x86_64_portable.exe'))
      || files.find((file) => is32Bit
        ? file.name.includes('windows_i686_setup.exe')
        : file.name.includes('windows_x86_64_setup.exe'))
      || fallbackFile
  }

  return fallbackFile
}

const latestVersionText = computed(() => release.value?.version || '...')

const autoDownload = computed(() => {
  const files = release.value?.files || []
  const target = detectAutoDownload(files)

  if (!target) {
    return {
      label: loadFailed.value ? messages.value.unknownDownload : messages.value.detecting,
      href: '#'
    }
  }

  return {
    label: autoDownloadLabel(target),
    href: fileUrl(target.name)
  }
})

const cards = computed<CardData[]>(() => {
  const files = release.value?.files || []
  const windowsFiles = files.filter((file) => file.name.includes('_windows_'))
  const macosFiles = files.filter((file) => file.name.includes('_macos_'))
  const linuxFiles = files.filter((file) => file.name.includes('_linux_'))

  return [
    {
      key: 'windows',
      title: messages.value.windows,
      description: messages.value.windowsDesc,
      iconSvg: iconSvg('windows'),
      buttons: createButtons(windowsFiles)
    },
    {
      key: 'macos',
      title: messages.value.macos,
      description: messages.value.macosDesc,
      iconSvg: iconSvg('apple'),
      buttons: createButtons(macosFiles)
    },
    {
      key: 'linux',
      title: messages.value.linux,
      description: messages.value.linuxDesc,
      iconSvg: iconSvg('linux'),
      buttons: createButtons(linuxFiles)
    }
  ]
})

onMounted(() => {
  void ensureReleaseLoaded()
})
</script>

<template>
  <div
    v-if="isDownloadsPage && section === 'hero'"
    class="downloads-hero"
  >
    <h1 class="downloads-title">
      {{ messages.title }}
    </h1>
    <p class="downloads-subtitle">
      {{ messages.latestVersion }} {{ latestVersionText }}
    </p>
    <div class="downloads-hero-actions">
      <VPButton
        tag="a"
        size="big"
        theme="brand"
        :text="autoDownload.label"
        :href="autoDownload.href"
      />
    </div>
  </div>

  <section
    v-else-if="isDownloadsPage && section === 'cards'"
    class="downloads-grid-section"
  >
    <div class="downloads-grid">
      <article
        v-for="card in cards"
        :key="card.key"
        class="VPFeature downloads-feature"
      >
        <div class="box">
          <div class="icon">
            <span
              class="downloads-system-icon"
              v-html="card.iconSvg"
            />
          </div>
          <h2 class="title">
            {{ card.title }}
          </h2>
          <p class="details">
            {{ card.description }}
          </p>

          <div class="downloads-card-actions">
            <a
              v-for="button in card.buttons"
              :key="button.href"
              class="downloads-card-button"
              :href="button.href"
              download
            >
              {{ button.label }}
            </a>

            <p
              v-if="!card.buttons.length"
              class="downloads-card-empty"
            >
              {{ loadFailed ? messages.failed : messages.detecting }}
            </p>
          </div>
        </div>
      </article>
    </div>
    <p class="downloads-history-link-wrap">
      <a
        class="downloads-history-link"
        :href="GITHUB_RELEASES_URL"
        target="_blank"
        rel="noreferrer"
      >
        {{ messages.historyLinkText }}
      </a>
    </p>
  </section>
</template>

<style scoped>
.downloads-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.downloads-title {
  margin: 0;
  color: #111827;
  font-family: var(--vp-font-family-base);
  letter-spacing: -0.04em;
  line-height: 1;
  font-size: clamp(2.5rem, 7vw, 4rem);
  font-weight: 800;
}

.downloads-subtitle {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: clamp(1rem, 2.4vw, 1.35rem);
  line-height: 1.7;
}

.downloads-hero-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 8px;
}

.downloads-grid-section {
  padding: 16px 24px 0;
}

.downloads-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin: 0 auto;
  max-width: 1152px;
}

.downloads-history-link-wrap {
  margin: 48px 0 0;
  text-align: center;
}

.downloads-history-link {
  font-size: 13px;
  color: var(--vp-c-text-2);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.downloads-history-link:hover {
  color: var(--vp-c-brand-1);
}

.downloads-feature {
  display: block;
  overflow: hidden;
  border-radius: 12px;
  height: 100%;
}

.downloads-feature .box {
  display: flex;
  flex-direction: column;
  padding: 24px;
  height: 100%;
}

.downloads-feature .icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  border-radius: 6px;
  background-color: var(--vp-c-default-soft);
  width: 48px;
  height: 48px;
  font-size: 24px;
  transition: background-color 0.25s;
}

.downloads-system-icon {
  display: inline-flex;
  width: 24px;
  height: 24px;
  color: var(--vp-c-text-1);
}

.downloads-system-icon :deep(svg) {
  width: 24px;
  height: 24px;
  display: block;
}

.downloads-feature .title {
  line-height: 24px;
  font-size: 16px;
  font-weight: 600;
}

.downloads-feature .details {
  flex-grow: 1;
  padding-top: 8px;
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.downloads-card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 18px;
}

.downloads-card-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 14px;
  border: 1px solid rgba(148, 163, 184, 0.26);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.84);
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
}

.downloads-card-button:hover {
  border-color: var(--vp-c-brand-2);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.14);
  transform: translateY(-1px);
}

.downloads-card-empty {
  margin: 0;
  color: var(--vp-c-text-2);
}

.dark .downloads-title {
  color: #f9fafb;
}

.dark .downloads-card-button {
  border-color: rgba(148, 163, 184, 0.18);
  background: rgba(15, 23, 42, 0.72);
  color: #f9fafb;
}

@media (min-width: 960px) {
  .downloads-grid-section {
    padding-left: 64px;
    padding-right: 64px;
  }

  .downloads-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
