<script setup lang="ts">
import confetti from 'canvas-confetti'
import { onMounted } from 'vue'

onMounted(() => {
  confetti({
    particleCount: 120,
    spread: 180,
    origin: { y: 0.6 }
  })
})
</script>

<template />
