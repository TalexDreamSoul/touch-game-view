<script setup lang="ts">
import TouchSlider from '~/components/TouchSlider.vue';
import Personal from './Personal.vue';

const props = defineProps<{
  show: any,
  data: any,
  options: any,
}>()
const emits = defineEmits<{
  (e: 'update:show', val: boolean): void
}>();

const display = computed({
  get() {
    return props.show
  },
  set(val) {
    emits('update:show', val)
  }
})

// 监听用户是否离开页面
document.addEventListener('visibilitychange', () => {
  if (props.data.mute.bgm) return

  const music = document.getElementById('music') as HTMLAudioElement
  if (document.visibilityState === 'hidden') music?.pause?.()
  else music?.play?.()
})

watch(() => props.data.mute.bgm, (val) => {
  nextTick(() => {
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

// 允许触控下拉Floater关闭页面
interface Options {
  thresholdDistance: number; // 触发关闭的阈值距离
  elasticity: number; // 弹性系数
}

function listen(el: HTMLElement, options: Options) {
  let isDragging = false;
  let startY = 0;
  let currentY = 0;
  let lastY = 0;

  const { thresholdDistance, elasticity } = options;

  el.addEventListener('touchstart', (event: TouchEvent) => {
    isDragging = true;
    startY = event.touches[0].clientY;
    lastY = startY;
    currentY = startY;
  });

  el.addEventListener('touchmove', (event: TouchEvent) => {
    if (!isDragging) return;

    currentY = event.touches[0].clientY;

    const deltaY = currentY - lastY;

    // 实现下拉移动
    el.parentElement!.style.transform = `translateY(100%) scaleY(.8) translateY(${currentY}px)`;

    lastY = currentY;

    // 如果下拉超过阈值距离，则彻底关闭
    if (currentY - startY >= thresholdDistance) {
      el.parentElement!.style.transform = ''; // 移动到底部
      display.value = false
      isDragging = false;
      console.log('弹出框已彻底关闭');
    }
  });

  el.addEventListener('touchend', () => {
    if (!isDragging) return;

    const deltaY = currentY - startY;

    // 使用弹性使弹出框有回弹效果
    const targetY = deltaY > 0 ? 0 : currentY + deltaY * elasticity;

    el.parentElement!.style.transition = 'transform 0.3s ease';
    el.parentElement!.style.transform = `translateY(100%) scaleY(.8) translateY(${targetY}px)`;

    // 清除监听器
    setTimeout(() => {
      el.parentElement!.style.transition = '';
      isDragging = false;
    }, 300);
  });

  el.addEventListener('touchcancel', () => {
    if (!isDragging) return;

    // 取消拖动时，恢复初始状态
    el.parentElement!.style.transition = 'transform 0.3s ease';
    el.parentElement!.style.transform = `translateY(100%) scaleY(.8) translateY(0)`;

    // 清除监听器
    setTimeout(() => {
      el.parentElement!.style.transition = '';
      isDragging = false;
    }, 300);
  });
}

const options: Options = {
  thresholdDistance: 300, // 设置阈值距离为100px
  elasticity: 0.5, // 设置弹性系数为0.5
};

onMounted(() => {
  const el = document.getElementById('SettingFloater') as HTMLElement

  listen(el, options)
})
</script>

<template>
  <div class="Settings" :class="{ show: display }">
    <div id="SettingFloater" class="Floater">
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

.Floater:hover span {
  width: 6rem;

  background-color: #161616E0;
}

.Floater span {
  position: absolute;

  left: 50%;
  top: 50%;

  width: 4rem;
  height: .5rem;

  cursor: pointer;
  border-radius: 8px;
  background-color: #161616A0;

  transition:cubic-bezier(0.55, 0.085, 0.68, 0.53) .25s;
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
