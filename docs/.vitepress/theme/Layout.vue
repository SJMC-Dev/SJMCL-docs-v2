<template>
  <div
    class="hero-layer"
    aria-hidden="true"
  >
    <div class="jumbo animate" />
  </div>
</template>

<style scoped>
.hero-layer {
  position: absolute;
  top: -4rem;
  z-index: 40;
  display: flex;
  width: 100%;
  max-width: 100% !important;
  height: 60vh;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: transparent;
  opacity: 0.35;
  pointer-events: none;
}

.dark .hero-layer {
  opacity: 0.5;
}

.jumbo {
  --stripes: repeating-linear-gradient(100deg, #fff 0%, #fff 7%, transparent 10%, transparent 12%, #fff 16%);
  --rainbow: repeating-linear-gradient(100deg, #60a5fa 10%, #e879f9 16%, #5eead4 22%, #60a5fa 30%);
  position: absolute;
  width: 100%;
  height: inherit;
  background-image: var(--stripes), var(--rainbow);
  background-position: 50% 50%, 50% 50%;
  background-size: 300%, 200%;
  contain: strict;
  contain-intrinsic-size: 100vw 40vh;
  filter: invert(100%);
  opacity: 0.6;
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000;
  mask-image: radial-gradient(ellipse at 100% 0%, black 40%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse at 100% 0%, black 40%, transparent 70%);
}

.jumbo::after {
  position: absolute;
  inset: 0;
  content: "";
  background-image: var(--stripes), var(--rainbow);
  background-size: 200%, 100%;
  mix-blend-mode: difference;
}

.animate.jumbo::after {
  animation: jumbo 90s linear infinite;
}

@keyframes jumbo {
  0% {
    background-position: 50% 50%, 50% 50%;
  }

  to {
    background-position: 350% 50%, 350% 50%;
  }
}
</style>
