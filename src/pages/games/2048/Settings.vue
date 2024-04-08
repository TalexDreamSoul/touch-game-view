<script setup lang="ts">
import TouchSlider from '~/components/TouchSlider.vue';
import Personal from './Personal.vue';

const props = defineProps<{
  show: any,
  data: any,
  options: any,
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
    <div class="Floater">
      <span />
    </div>

    <div class="Settings-Main">
      <TouchSlider title="背景音乐" reversed v-model="data.mute.bgm" />
      <TouchSlider title="滑动音效" reversed v-model="data.mute.sound" />
      <TouchSlider title="失败音效" reversed v-model="data.mute.failed" />
      <TouchSlider title="滑动震动" v-model="data.vibrate.slide" />
      <TouchSlider title="失败震动" v-model="data.vibrate.failed" />

      <br />
      <Personal :options="options" />
    </div>
  </div>
</template>

<style>
.Settings.show {
  transform: translateY(0) scaleY(1);
}

.Settings-Main {
  padding: 1rem;
  box-sizing: border-box;
  overflow-y: auto;
}

.Floater {
  z-index: 1;
  position: sticky;

  left: 50%;
  top: 0rem;

  width: 100%;
  height: 1.5rem;

  border-radius: 8px 8px 0 0;
  background-color: #e3e3e350;
  backdrop-filter: blur(18px) saturate(180%);
}

.Floater span {
  position: absolute;

  left: 50%;
  top: 50%;

  width: 4rem;
  height: .5rem;

  border-radius: 8px;
  background-color: #161616A0;

  transform: translate(-50%, -50%);
}

.Settings {
  z-index: 10000;
  position: absolute;
  padding: 0;

  width: 100%;
  height: 90%;

  bottom: 0;

  color: #000;
  border-radius: 16px 16px 0 0;
  background-color: #fff;

  transition: .25s cubic-bezier(.4, 0, .2, 1);
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  transform: translateY(100%) scaleY(.8);
}
</style>
