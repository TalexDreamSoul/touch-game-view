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
  elasticityClose: number; // 触发关闭的阈值力度
}

function listen(el: HTMLElement, options: Options) {
  const parentEl = el.parentElement! as HTMLElement
  const { thresholdDistance, elasticity, elasticityClose } = options

  const _options = {
    touch: false,
    lastY: -1,
    startY: -1,
  }

  parentEl.addEventListener('touchstart', (e) => {
    // 如果触控点不止一个不触发
    if (e.touches.length !== 1) return

    el.classList.add('active')

    _options.startY = _options.lastY = e.touches[0].clientY

    _options.touch = true

    parentEl.style.transition = 'none'
  })

  parentEl.addEventListener('touchend', (e) => {
    _options.touch = false

    parentEl.style.transition = ''

    el.classList.remove('active')

    if (display.value) {
      // 根据弹性系数计算回弹距离
      const diff = _options.lastY - _options.startY
      const elasticDistance = diff * elasticity

      // console.log("end", elasticDistance)

      if (elasticDistance > elasticityClose) {
        parentEl.style.transform = ''

        display.value = false
        return
      }

      parentEl.style.transform = `translateY(0) scaleY(1) translateY(-${elasticDistance}px)`

      setTimeout(() => {
        parentEl.style.transform = `translateY(0) scaleY(1) translateY(0px)`
      }, 200)
    }
  })

  const scaleRange = [1, 0.85]

  parentEl.addEventListener('touchmove', (e) => {
    const touch = e.touches[0]

    const { clientY } = touch
    // const diff = clientY - _options.lastY
    _options.lastY = clientY

    const totalDiff = clientY - _options.startY
    if (totalDiff < 0) return
    if (totalDiff >= thresholdDistance) {
      parentEl.style.transform = ''

      display.value = false

      return
    }

    // 将 0 - totalDiff 映射到 scaleRange
    const scale = (totalDiff / thresholdDistance) * (scaleRange[1] - scaleRange[0]) + scaleRange[0]

    display.value = true
    parentEl.style.transform = `translateY(0) scaleY(${scale}) translateY(${totalDiff}px)`

    // console.log("totalDiff", totalDiff, scale)
  })
}

const _options: Options = {
  thresholdDistance: window.innerHeight * 0.9, // 设置阈值距离为100px
  elasticity: 0.15, // 设置弹性系数为0.5
  elasticityClose: 30, // 设置弹性系数为0.5
};

onMounted(() => {
  const el = document.getElementById('SettingFloater') as HTMLElement

  listen(el, _options)
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

.Floater:active span, .Floater.active span {
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

  transition: cubic-bezier(0.55, 0.085, 0.68, 0.53) .25s;
  transform: translate(-50%, -50%);
}

.Settings {
  z-index: 10000;
  position: absolute;
  padding: 0 0 5rem 0;

  width: 100%;
  height: calc(90% + 5rem);

  bottom: -5rem;

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
