<script setup lang="ts">
import CardCarousel from './cards/CardCarousel.vue'
import GameCards from './cards/GameCards.vue'
const props = defineProps<{
  modelValue?: boolean,
}>()

</script>

<template>
  <div class="MainLayer">
    <CardCarousel />
    <GameCards />
  </div>
</template>

<style>
.MainLayer {
  z-index: 10;
  position: relative;
  display: flex;

  top: -30%;

  align-items: center;
  flex-direction: column;
  justify-content: center;
}
</style>
