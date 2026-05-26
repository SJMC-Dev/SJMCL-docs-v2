<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useData } from 'vitepress'

type PlatformKey = 'linux' | 'macos' | 'windows'
type MethodKey = 'script' | 'aur' | 'snap' | 'homebrew' | 'winget'

type InstallMethod = {
  key: MethodKey
  label: string
  language: string
  command: string
}

type Platform = {
  key: PlatformKey
  label: string
  methods: InstallMethod[]
}

const { lang } = useData()

const activePlatform = ref<PlatformKey>('windows')
const activeMethod = ref<MethodKey>('winget')

const isEnglish = computed(() => lang.value === 'en-US')

const platforms = computed<Platform[]>(() => {
  if (isEnglish.value) {
    return [
      {
        key: 'windows',
        label: 'Windows',
        methods: [
          {
            key: 'winget',
            label: 'Winget',
            language: 'powershell',
            command: 'winget install SJMC.SJMCL'
          }
        ]
      },
      {
        key: 'macos',
        label: 'macOS',
        methods: [
          {
            key: 'homebrew',
            label: 'Homebrew',
            language: 'bash',
            command: 'brew install --cask SJMC-Dev/SJMCL/sjmcl'
          }
        ]
      },
      {
        key: 'linux',
        label: 'Linux',
        methods: [
          {
            key: 'script',
            label: 'Install script',
            language: 'bash',
            command: 'curl -LsSf https://mc.sjtu.cn/sjmcl/releases/install.sh | sh -s -- --source sjmc'
          },
          {
            key: 'aur',
            label: 'AUR',
            language: 'bash',
            command: 'yay -S sjmcl-bin'
          },
          {
            key: 'snap',
            label: 'Snap',
            language: 'bash',
            command: 'sudo snap install sjmcl'
          }
        ]
      }
    ]
  }

  return [
    {
      key: 'windows',
      label: 'Windows',
      methods: [
        {
          key: 'winget',
          label: 'Winget',
          language: 'powershell',
          command: 'winget install SJMC.SJMCL'
        }
      ]
    },
    {
      key: 'macos',
      label: 'macOS',
      methods: [
        {
          key: 'homebrew',
          label: 'Homebrew',
          language: 'bash',
          command: 'brew install --cask SJMC-Dev/SJMCL/sjmcl'
        }
      ]
    },
    {
      key: 'linux',
      label: 'Linux',
      methods: [
        {
          key: 'script',
          label: '安装脚本',
          language: 'bash',
          command: 'curl -LsSf https://mc.sjtu.cn/sjmcl/releases/install.sh | sh -s -- --source sjmc'
        },
        {
          key: 'aur',
          label: 'AUR',
          language: 'bash',
          command: 'yay -S sjmcl-bin'
        },
        {
          key: 'snap',
          label: 'Snap',
          language: 'bash',
          command: 'sudo snap install sjmcl'
        }
      ]
    }
  ]
})

const currentPlatform = computed(() => platforms.value.find((platform) => platform.key === activePlatform.value) ?? platforms.value[0])
const currentMethod = computed(() => currentPlatform.value.methods.find((method) => method.key === activeMethod.value) ?? currentPlatform.value.methods[0])
const currentLanguageLabel = computed(() => currentMethod.value.language === 'powershell' ? 'powershell' : 'bash')

watch(currentPlatform, (platform) => {
  if (!platform.methods.some((method) => method.key === activeMethod.value)) {
    activeMethod.value = platform.methods[0].key
  }
})

</script>

<template>
  <section class="install-command-tabs">
    <div
      class="install-tabs install-tabs-primary"
      role="tablist"
      :aria-label="isEnglish ? 'Operating system' : '操作系统'"
    >
      <button
        v-for="platform in platforms"
        :key="platform.key"
        type="button"
        class="install-tab"
        :class="{ active: platform.key === activePlatform }"
        role="tab"
        :aria-selected="platform.key === activePlatform"
        @click="activePlatform = platform.key"
      >
        {{ platform.label }}
      </button>
    </div>

    <div
      v-if="currentPlatform.methods.length > 1"
      class="install-tabs install-tabs-secondary"
      role="tablist"
      :aria-label="isEnglish ? 'Installation method' : '安装方式'"
    >
      <button
        v-for="method in currentPlatform.methods"
        :key="method.key"
        type="button"
        class="install-method-tab"
        :class="{ active: method.key === activeMethod }"
        role="tab"
        :aria-selected="method.key === activeMethod"
        @click="activeMethod = method.key"
      >
        {{ method.label }}
      </button>
    </div>

    <div class="install-command-panel">
      <div class="install-command-code vp-adaptive-theme" :class="`language-${currentMethod.language}`">
        <button
          type="button"
          class="copy"
          :title="isEnglish ? 'Copy Code' : '复制代码'"
          :aria-label="isEnglish ? 'Copy Code' : '复制代码'"
        />
        <span class="lang">{{ currentLanguageLabel }}</span>
        <pre><code>{{ currentMethod.command }}</code></pre>
      </div>
    </div>
  </section>
</template>

<style scoped>
.install-command-tabs {
  margin: 24px 0 32px;
}

.install-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0 28px;
  overflow: visible;
}

.install-tabs-primary,
.install-tabs-secondary {
  border-bottom: 1px solid var(--vp-c-divider);
}

.install-tab,
.install-method-tab {
  position: relative;
  flex: 0 0 auto;
  border: 0;
  background: transparent;
  color: var(--vp-c-text-2);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s ease;
}

.install-tab,
.install-method-tab {
  padding: 0 0 10px;
  font-size: 15px;
}

.install-tab::after,
.install-method-tab::after {
  position: absolute;
  right: 0;
  bottom: -1px;
  left: 0;
  height: 2px;
  border-radius: 999px;
  background: var(--vp-c-text-1);
  content: "";
  opacity: 0;
  transform: scaleX(0.6);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.install-tab.active,
.install-method-tab.active {
  color: var(--vp-c-text-1);
}

.install-tab.active::after,
.install-method-tab.active::after {
  opacity: 1;
  transform: scaleX(1);
}

.install-tabs-secondary {
  margin-top: 10px;
}

.install-command-panel {
  margin-top: 18px;
}

.install-command-code pre {
  margin: 0;
  white-space: pre-wrap;
}

@media (max-width: 640px) {
  .install-tabs {
    gap: 0 20px;
  }
}
</style>
