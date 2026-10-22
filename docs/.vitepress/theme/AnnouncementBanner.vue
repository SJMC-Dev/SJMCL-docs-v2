<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { lang } = useData()
const messages = computed(() => lang.value === 'en-US'
  ? {
      prefix: 'A statement on recent discussions about SJMC Launcher: ',
      link: 'Read here',
      suffix: '. Please do not believe or spread rumors.'
    }
  : {
      prefix: '关于近期 SJMC Launcher 相关讨论的说明：',
      link: '点此查看',
      suffix: '，请大家不信谣、不传谣。'
    })
</script>

<template>
  <div class="announcement-container">
    <div class="custom-block warning announcement-banner">
      <p>
        {{ messages.prefix }}<a
          href="https://www.bilibili.com/opus/1261276593127424006"
          target="_blank"
          rel="noreferrer"
        >{{ messages.link }}</a>{{ messages.suffix }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.announcement-container {
  position: relative;
  z-index: 41;
  padding: 32px 24px 0;
}

.announcement-banner {
  --vp-custom-block-warning-bg: #fff3cd;
  --vp-custom-block-warning-border: #d6a329;
  --vp-custom-block-warning-text: #5b3b0a;
  width: fit-content;
  max-width: min(100%, 960px);
  margin: 0 auto;
  padding: 16px 20px;
  font-size: 16px;
  font-weight: 700;
  line-height: 28px;
  text-align: left;
}

.announcement-banner a {
  font-weight: inherit;
}

.dark .announcement-banner {
  --vp-custom-block-warning-bg: #332810;
  --vp-custom-block-warning-border: #946300;
  --vp-custom-block-warning-text: #fce3a4;
}

@media (min-width: 640px) {
  .announcement-container {
    padding-right: 48px;
    padding-left: 48px;
  }
}

@media (min-width: 960px) {
  .announcement-container {
    padding-right: 64px;
    padding-left: 64px;
  }
}
</style>
