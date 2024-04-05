<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'TouchGames',
  meta: [
    {
      name: 'description',
      content: 'A free and simple classic games',
    },
    {
      name: 'theme-color',
      content: () => isDark.value ? '#00aba9' : '#ffffff',
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: () => preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg',
    },
  ],
})

let user = localStorage.getItem("user")
const name = ref(user || "")

// @ts-ignore
window.$name = name

function go() {
  user = name.value
  localStorage.setItem("user", name.value)
}
</script>

<template>
  <RouterView />

  <div v-if="!user" class="User">
    <p>
      <em text-sm opacity-75>TaGzxia Games</em>
    </p>

    <div py-4 />

    <TheInput v-model="name" placeholder="请输入游戏名..." autocomplete="false" @keydown.enter="go" />
    <label class="hidden" for="input">你的用户名是？</label>

    <div>
      <button m-3 text-sm btn :disabled="!name" @touchstart="go" click="go">
        确认
      </button>
    </div>
  </div>
</template>

<style>
.User {
  z-index: 1000;
  position: absolute;
  display: flex;

  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  top: 50%;
  left: 50%;

  background-color: #ffffff50;
  backdrop-filter: blur(18px) saturate(180%);

  transform: translate(-50%, -50%);
}
</style>
