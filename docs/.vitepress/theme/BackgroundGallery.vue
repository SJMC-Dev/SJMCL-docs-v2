<script setup lang="ts">
import { ref, computed } from 'vue'
import { useData, withBase } from 'vitepress'
interface GalleryVariant {
  labelZh: string
  labelEn: string
  src: string
}

interface GalleryImage {
  nameZh: string
  nameEn: string
  thumbnail: string
  variants: GalleryVariant[]
}

interface GalleryVersion {
  name: string
  images: GalleryImage[]
}

const BASE = '/images/backgrounds'

const galleryData: GalleryVersion[] = [
  {
    name: 'v1.x',
    images: [
      {
        nameZh: '樱满集',
        nameEn: 'Florwyn',
        thumbnail: `${BASE}/v1.x/Florwyn-thumbnail.jpg`,
        variants: [
          { labelZh: '浅色', labelEn: 'Light', src: `${BASE}/v1.x/Florwyn-light.jpg` },
          { labelZh: '深色', labelEn: 'Dark', src: `${BASE}/v1.x/Florwyn-dark.jpg` },
        ],
      },
      {
        nameZh: 'SJTU 紫气东来门',
        nameEn: 'SJTU Eastgate',
        thumbnail: `${BASE}/v1.x/SJTU-eastgate-thumbnail.jpg`,
        variants: [
          { labelZh: '浅色', labelEn: 'Light', src: `${BASE}/v1.x/SJTU-eastgate-light.jpg` },
          { labelZh: '深色', labelEn: 'Dark', src: `${BASE}/v1.x/SJTU-eastgate-dark.jpg` },
        ],
      },
    ],
  },
  {
    name: 'v0.x',
    images: [
      {
        nameZh: '银淞雪镇',
        nameEn: 'Jǫkull Village',
        thumbnail: `${BASE}/v0.8.x/Jokull.jpg`,
        variants: [
          { labelZh: '默认', labelEn: 'Default', src: `${BASE}/v0.8.x/Jokull.jpg` },
        ],
      },
      {
        nameZh: 'SJTU 紫气东来门',
        nameEn: 'SJTU Eastgate',
        thumbnail: `${BASE}/v0.8.x/SJTU-eastgate.jpg`,
        variants: [
          { labelZh: '默认', labelEn: 'Default', src: `${BASE}/v0.8.x/SJTU-eastgate.jpg` },
        ],
      },
      {
        nameZh: 'GNWork 理想城',
        nameEn: 'GNWork City',
        thumbnail: `${BASE}/v0.8.x/GNLXC.jpg`,
        variants: [
          { labelZh: '默认', labelEn: 'Default', src: `${BASE}/v0.8.x/GNLXC.jpg` },
        ],
      },
    ],
  },
]

const { lang } = useData()
const isZh = computed(() => lang.value.startsWith('zh'))

function imgName(img: GalleryImage): string {
  return isZh.value ? img.nameZh : img.nameEn
}

function varLabel(v: GalleryVariant): string {
  return isZh.value ? v.labelZh : v.labelEn
}

const selectedImage = ref<GalleryImage | null>(null)
const activeVariantIndex = ref(0)

function openModal(img: GalleryImage) {
  selectedImage.value = img
  activeVariantIndex.value = 0
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  selectedImage.value = null
  document.body.style.overflow = ''
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeModal()
}

function activeVariant(): GalleryVariant | null {
  if (!selectedImage.value) return null
  return selectedImage.value.variants[activeVariantIndex.value] ?? null
}
</script>

<template>
  <div class="bg-gallery">
    <p v-if="galleryData.length === 0" class="gallery-empty">
      No images yet.
    </p>

    <section v-for="version in galleryData" :key="version.name" class="gallery-section">
      <h2 class="gallery-version-title">{{ version.name }}</h2>
      <div class="gallery-grid">
        <div
          v-for="img in version.images"
          :key="`${version.name}-${img.nameEn}`"
          class="gallery-card"
          @click="openModal(img)"
        >
          <img :src="withBase(img.thumbnail)" :alt="imgName(img)" loading="lazy" />
          <div class="card-caption">{{ imgName(img) }}</div>
        </div>
      </div>
    </section>

    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="selectedImage"
          class="gallery-modal-overlay"
          @click.self="closeModal"
          @keydown="onKeydown"
        >
          <div class="gallery-modal" role="dialog" aria-label="Image viewer">
            <button class="modal-close" @click="closeModal" aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

          <div class="modal-image-wrap">
            <img
              v-if="activeVariant()"
              :src="withBase(activeVariant()!.src)"
              :alt="`${imgName(selectedImage)} - ${varLabel(activeVariant()!)}`"
            />
          </div>

          <div class="modal-info">
            <div class="modal-info-left">
              <p class="modal-name">{{ imgName(selectedImage) }}</p>
              <div v-if="selectedImage.variants.length > 1" class="variant-tabs">
                <button
                  v-for="(v, idx) in selectedImage.variants"
                  :key="v.labelEn"
                  class="variant-tab"
                  :class="{ active: idx === activeVariantIndex }"
                  @click="activeVariantIndex = idx"
                >
                  {{ varLabel(v) }}
                </button>
              </div>
            </div>
            <a
              v-if="activeVariant()"
              class="modal-download"
              :href="withBase(activeVariant()!.src)"
              download
              target="_blank"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {{ isZh ? '下载' : 'Download' }}
            </a>
          </div>
        </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.bg-gallery {
  margin-top: 24px;
}

.gallery-empty {
  color: var(--vp-c-text-2);
  font-style: italic;
}

.gallery-section {
  margin-bottom: 48px;
}

.gallery-version-title {
  font-size: 1.35rem;
  font-weight: 600;
  margin-bottom: 16px;
  padding-bottom: 0;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.gallery-card {
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  transition: transform 0.2s, box-shadow 0.2s;
}

.gallery-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.gallery-card img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  display: block;
}

.card-caption {
  padding: 8px 12px;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Modal transition */
.modal-enter-active {
  transition: opacity 0.25s ease;
}
.modal-enter-active .gallery-modal {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-leave-active .gallery-modal {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-enter-from {
  opacity: 0;
}
.modal-enter-from .gallery-modal {
  transform: scale(0.92);
  opacity: 0;
}
.modal-leave-to {
  opacity: 0;
}
.modal-leave-to .gallery-modal {
  transform: scale(0.92);
  opacity: 0;
}

/* Modal */
.gallery-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.72);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.gallery-modal {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  background: var(--vp-c-bg);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.32);
  display: flex;
  flex-direction: column;
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 34px;
  height: 34px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.65);
}

.modal-image-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a0a0a;
  min-height: 0;
}

.modal-image-wrap img {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
}

.modal-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 20px;
  border-top: 1px solid var(--vp-c-divider);
}

.modal-info-left {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal-name {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

/* Variant tabs */
.variant-tabs {
  display: flex;
  gap: 8px;
}

.variant-tab {
  padding: 4px 16px;
  border-radius: 999px;
  font-size: 0.82rem;
  border: none;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s;
}

.variant-tab:hover {
  color: var(--vp-c-text-1);
}

.variant-tab.active {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.modal-download {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #fff;
  background: var(--vp-c-brand-1);
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background 0.2s;
}

.modal-download:hover {
  background: var(--vp-c-brand-2);
  color: #fff;
  text-decoration: none;
}
</style>
