<script setup lang="ts">
import MainHead from './main/MainHead.vue'
import MainLayer from './main/MainLayer.vue'

defineOptions({
  name: 'IndexPage',
})

const offline = ref(false)
const baseUrl = 'https://game.tagzxia.com'

function getStatus() {
  // 向 baseUrl/status 发送 get
  fetch(`${baseUrl}/status`)
    .then(res => res.json())
    .then((data) => {
      offline.value = !data?.status
    })
    .catch((err) => {
      offline.value = true
    })
}

function reconnect(e: Event) {
  if (!offline.value)
    return

  e.preventDefault()
  e.stopImmediatePropagation()

  getStatus()
}
getStatus()
</script>

<template>
  <div :class="{ offline }" class="Index" @click="reconnect">
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
.Index.offline::before {
  z-index: 100000;
  content: '无法连接至远程服务器！';
  position: absolute;

  display: flex;
  align-items: center;
  justify-content: center;

  left: 0;
  top: 0;

  width: 100%;
  height: 100%;
  line-height: 100vh;

  color: red;
  font-size: 2rem;
  background: #ee111150;
}

.Index-Bg {
  z-index: 10000;
  position: sticky;

  top: 0;

  width: 100%;
  height: 35%;

  pointer-events: none;
  background: linear-gradient(to top, transparent, #fff1fb50 30%, #aacbf9);
}

.Index {
  position: absolute;

  width: 100%;
  height: 100%;

  overflow-y: scroll;
  overflow-x: hidden;
}
</style>
