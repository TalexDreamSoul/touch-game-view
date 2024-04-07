<script setup lang="ts">

const props = defineProps<{
  show: any,
  data: any,
}>()

// 监听用户是否离开页面
document.addEventListener('visibilitychange', () => {
  if (props.data.mute.bgm) return

  const music = document.getElementById('music') as HTMLAudioElement
  if (document.visibilityState === 'hidden') music?.pause?.()
  else music?.play?.()
})

watch(() => props.data.mute.bgm, (val) => {
  nextTick(() => {
    console.log("mute", val)

    if (!val) {
      const music = document.getElementById('music') as HTMLAudioElement
      music?.play?.()
      music.volume = 1
    } else {
      const music = document.getElementById('music') as HTMLAudioElement
      music?.pause?.()
      music.volume = 0
    }
  })
}, { immediate: true })
</script>

<template>
  <div class="Settings" :class="{ show }">
    {{ data.mute }}
    <p @touchstart="data.mute.bgm = !data.mute.bgm" @click="data.mute.bgm = !data.mute.bgm">{{ data.mute.bgm ?
      '关闭' : '开启' }}启用音乐</p>
    <p @touchstart="data.mute.sound = !data.mute.sound" @click="data.mute.sound = !data.mute.sound">{{ data.mute.sound
      ?
      '关闭' : '开启' }}启用音效</p>
  </div>
</template>

<style>
.Settings.show {
  transform: translateY(0) scaleY(1);
}

.Floater {
  position: sticky;
  margin-bottom: 1rem;

  left: 50%;
  top: 0rem;

  width: 4rem;
  height: .5rem;

  border-radius: 8px;
  background-color: #161616A0;

  transform: translateX(-50%);
}

.Settings {
  z-index: 10000;
  position: absolute;
  padding: 1rem;

  width: 100%;
  height: 90%;

  bottom: 0;

  color: #000;
  border-radius: 16px;
  background-color: #fff;

  transition: .25s;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  transform: translateY(100%) scaleY(.8);
}
</style>
