<script setup lang="ts">
import MainHead from './main/MainHead.vue'
import MainLayer from './main/MainLayer.vue';
defineOptions({
  name: 'IndexPage',
})

const router = useRouter()
</script>

<template>
  <div class="Index">
    <div class="Index-Bg">
      <MainHead />
    </div>

    <MainLayer />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>

<style>
.Index-Bg {
  z-index: 10000;
  position: sticky;

  top: 0;

  width: 100%;
  height: 35%;

  background: linear-gradient(to top, transparent, #fff1fb50 30%, #aacbf9)
}

.Index {
  position: absolute;

  width: 100%;
  height: 100%;

  overflow-y: scroll;
}
</style>
