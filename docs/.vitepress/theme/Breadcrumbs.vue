<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter } = useData()

const breadcrumbs = computed(() => {
  return (frontmatter.value.breadcrumbs ?? []) as {
    title: string
    link: string
  }[]
})
</script>

<template>
  <div
    v-if="breadcrumbs.length"
    class="vp-nolebase-breadcrumbs"
  >
    <span
      v-for="item in breadcrumbs"
      :key="`${item.title}-${item.link}`"
    >
      <a
        v-if="item.link"
        :href="item.link"
      >
        {{ item.title }}
      </a>
      <span v-else>{{ item.title }}</span>
    </span>
  </div>
</template>

<style scoped>
.vp-nolebase-breadcrumbs {
  margin-bottom: 2rem;
  font-size: 14px;
}

.vp-nolebase-breadcrumbs span {
  color: var(--vp-c-text-2);
  transition: color 0.25s, opacity 0.25s;
}

.vp-nolebase-breadcrumbs span:hover {
  color: var(--vp-c-brand-1);
}

.vp-nolebase-breadcrumbs span:last-child {
  color: var(--vp-c-text-1);
}

.vp-nolebase-breadcrumbs span:last-child:hover {
  color: var(--vp-c-brand-1);
}

.vp-nolebase-breadcrumbs span:not(:first-child)::before {
  padding-left: 4px;
  padding-right: 4px;
  color: var(--vp-c-text-3);
  content: "/";
}
</style>
