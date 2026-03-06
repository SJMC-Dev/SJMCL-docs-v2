<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

const { isDark } = useData()

const screenshotLightUrl = withBase('/images/home-banner-screenshot.png')
const screenshotDarkUrl = withBase('/images/home-banner-screenshot-dark.png')
const stickerUrl = withBase('/images/home-banner-miuxi-emoji.png')

const screenshotUrl = computed(() => isDark.value ? screenshotDarkUrl : screenshotLightUrl)
</script>

<template>
  <div class="sjmcl-home-hero-image">
    <img
      :src="screenshotUrl"
      alt="SJMC Launcher Screenshot"
      class="sjmcl-home-hero-image__screenshot"
    >
    <img
      :src="stickerUrl"
      alt=""
      aria-hidden="true"
      class="sjmcl-home-hero-image__sticker"
    >
  </div>
</template>

<style scoped>
.sjmcl-home-hero-image {
  position: relative;
  margin: 0 auto;
  width: min(80vw, 400px);
}

.sjmcl-home-hero-image__screenshot {
  display: block;
  width: 100%;
  border-radius: 6px;
  box-shadow: 0 20px 48px rgb(15 23 42 / 26%);
}

.sjmcl-home-hero-image__sticker {
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 2;
  width: clamp(84px, 18vw, 150px);
  transform: translate(-32%, 30%) rotate(-10deg);
  filter: drop-shadow(0 10px 14px rgb(15 23 42 / 25%));
  pointer-events: none;
}

.dark .sjmcl-home-hero-image__screenshot {
  box-shadow: 0 24px 56px rgb(2 6 23 / 55%);
}

@media (min-width: 960px) {
  .sjmcl-home-hero-image {
    width: min(30vw, 560px);
  }
}
</style>
