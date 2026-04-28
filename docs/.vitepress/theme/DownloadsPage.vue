<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useData, withBase } from 'vitepress'
import { VPBadge, VPButton } from 'vitepress/theme'
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
  recommended: boolean
  download: boolean
  metaIconSvg?: string
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
const detectedArchitecture = ref('')
const detectedPlatform = ref('')

let sharedLoadPromise: Promise<void> | null = null

const isDownloadsPage = computed(() => frontmatter.value.pageClass === 'downloads-page')
const isEnglish = computed(() => lang.value === 'en-US')
const release = computed(() => sharedRelease.value)
const loadFailed = computed(() => sharedLoadFailed.value)

function iconSvg(name: 'windows' | 'apple' | 'linux' | 'archlinux') {
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
      historyLinkText: 'View historical versions on GitHub Releases',
      commandLineInstall: 'Install from Command Line',
      recommended: 'Recommended'
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
    historyLinkText: '在 GitHub Releases 查看历史版本',
    commandLineInstall: '从命令行安装',
    recommended: '推荐'
  }
})

const commandLineInstallHref = computed(() => isEnglish.value
  ? withBase('/en/docs/install.html#install-from-command-line')
  : withBase('/docs/install.html#%E4%BB%8E%E5%91%BD%E4%BB%A4%E8%A1%8C%E5%AE%89%E8%A3%85'))

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
  const formatOrder = ['portable', 'setup', 'dmg', 'appBundle', 'appimage', 'deb', 'rpm', 'other']
  const archOrder = ['x64', 'x86', 'arm64']

  const fileFormat = (name: string) => {
    const normalized = name.toLowerCase()

    if (normalized.includes('setup.exe'))
      return 'setup'
    if (normalized.includes('portable'))
      return 'portable'
    if (normalized.endsWith('.dmg'))
      return 'dmg'
    if (normalized.includes('.app.tar.gz'))
      return 'appBundle'
    if (normalized.includes('.appimage'))
      return 'appimage'
    if (normalized.endsWith('.deb'))
      return 'deb'
    if (normalized.endsWith('.rpm'))
      return 'rpm'

    return 'other'
  }

  return [...files].sort((left, right) => {
    const leftName = left.name.toLowerCase()
    const rightName = right.name.toLowerCase()

    const leftFormat = formatOrder.indexOf(fileFormat(leftName))
    const rightFormat = formatOrder.indexOf(fileFormat(rightName))

    if (leftFormat !== rightFormat)
      return leftFormat - rightFormat

    return archOrder.indexOf(normalizeArch(left.name)) - archOrder.indexOf(normalizeArch(right.name))
  })
}

function isRecommendedFile(file: ReleaseFile) {
  const name = file.name.toLowerCase()

  return name.includes('_windows_') && name.includes('_portable.exe')
    || name.includes('_macos_') && name.endsWith('.dmg')
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
    href: fileUrl(file.name),
    recommended: isRecommendedFile(file),
    download: true
  }))
}

function createCommandLineInstallButton(): DownloadButton {
  return {
    label: messages.value.commandLineInstall,
    href: commandLineInstallHref.value,
    recommended: false,
    download: false,
    metaIconSvg: iconSvg('archlinux')
  }
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

type TargetPlatform = 'windows' | 'macos' | 'linux' | 'unknown'
type TargetArch = 'arm64' | 'x64' | 'x86' | 'unknown'

function detectPlatform(source: string) {
  if (source.includes('windows') || source.includes('win32') || source.includes('win64'))
    return 'windows' as const
  if (source.includes('mac'))
    return 'macos' as const
  if (source.includes('linux'))
    return 'linux' as const
  return 'unknown' as const
}

function detectArch(source: string, platform: TargetPlatform) {
  const isArm = /\b(arm64|aarch64|armv8)\b/.test(source)
  const isX64 = /\b(x86_64|x64|win64|amd64)\b/.test(source)
  const isX86 = /\b(i686|i386|x86)\b/.test(source) && !isX64

  if (isArm)
    return 'arm64' as const
  if (isX86)
    return 'x86' as const
  if (isX64)
    return 'x64' as const

  // Sensible defaults when architecture is unavailable.
  if (platform === 'macos')
    return 'arm64' as const
  if (platform === 'windows' || platform === 'linux')
    return 'x64' as const

  return 'unknown' as const
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
  const normalized = files.map((file) => ({
    file,
    name: file.name.toLowerCase()
  }))
  const fallbackFile = normalized.find(({ name }) => name.includes('windows_x86_64_portable.exe'))?.file
    || normalized.find(({ name }) => name.includes('windows_x86_64_setup.exe'))?.file
    || normalized.find(({ name }) => name.includes('linux_x86_64.portable'))?.file
    || files[0]

  if (typeof navigator === 'undefined')
    return fallbackFile

  const source = `${navigator.platform} ${navigator.userAgentData?.platform || ''} ${navigator.userAgent} ${detectedPlatform.value} ${detectedArchitecture.value}`.toLowerCase()
  const platform = detectPlatform(source)
  const arch = detectArch(source, platform)

  if (platform === 'macos') {
    return normalized.find(({ name }) => arch === 'arm64'
      ? name.includes('macos_aarch64.dmg')
      : name.includes('macos_x86_64.dmg'))?.file
      || normalized.find(({ name }) => name.includes('macos_') && name.endsWith('.dmg'))?.file
      || fallbackFile
  }

  if (platform === 'linux') {
    return normalized.find(({ name }) => arch === 'arm64'
      ? name.includes('linux_aarch64.portable')
      : name.includes('linux_x86_64.portable'))?.file
      || normalized.find(({ name }) => arch === 'arm64'
        ? name.includes('linux_aarch64.appimage')
        : name.includes('linux_x86_64.appimage'))?.file
      || normalized.find(({ name }) => name.includes('linux_') && name.includes('.portable'))?.file
      || normalized.find(({ name }) => name.includes('linux_') && name.endsWith('.appimage'))?.file
      || fallbackFile
  }

  if (platform === 'windows') {
    if (arch === 'arm64') {
      return normalized.find(({ name }) => name.includes('windows_aarch64_portable.exe'))?.file
        || normalized.find(({ name }) => name.includes('windows_aarch64_setup.exe'))?.file
        || fallbackFile
    }

    const is32Bit = arch === 'x86'
    return normalized.find(({ name }) => is32Bit
      ? name.includes('windows_i686_portable.exe')
      : name.includes('windows_x86_64_portable.exe'))?.file
      || normalized.find(({ name }) => is32Bit
        ? name.includes('windows_i686_setup.exe')
        : name.includes('windows_x86_64_setup.exe'))?.file
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
      buttons: [
        createCommandLineInstallButton(),
        ...createButtons(linuxFiles)
      ]
    }
  ]
})

onMounted(() => {
  if (typeof navigator !== 'undefined' && navigator.userAgentData?.getHighEntropyValues) {
    navigator.userAgentData.getHighEntropyValues(['architecture', 'platform'])
      .then((value) => {
        detectedArchitecture.value = value.architecture?.toLowerCase?.() || ''
        detectedPlatform.value = value.platform?.toLowerCase?.() || ''
      })
      .catch(() => {})
  }

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
              :download="button.download ? '' : undefined"
            >
              <span>{{ button.label }}</span>
              <span
                v-if="button.metaIconSvg"
                class="downloads-card-button-separator"
                aria-hidden="true"
              >
                ·
              </span>
              <span
                v-if="button.metaIconSvg"
                class="downloads-card-button-meta-icon"
                aria-hidden="true"
                v-html="button.metaIconSvg"
              />
              <VPBadge
                v-if="button.recommended"
                type="tip"
                :text="messages.recommended"
                class="downloads-card-badge"
              />
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
  gap: 8px;
  min-height: 42px;
  padding: 0 14px;
  border: 1px solid rgba(148, 163, 184, 0.26);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.84);
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
}

.downloads-card-badge {
  display: inline-flex;
  align-items: center;
  margin-left: 0;
  transform: none;
}

.downloads-card-button-separator {
  color: inherit;
}

.downloads-card-button-meta-icon {
  display: inline-flex;
  width: 16px;
  height: 16px;
  color: #1793d1;
}

.downloads-card-button-meta-icon :deep(svg) {
  display: block;
  width: 16px;
  height: 16px;
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
