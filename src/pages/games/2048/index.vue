<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import Slider from './slider/index.vue'
import HeadBar from './HeadBar.vue';
import Footer from './footer/Footer.vue';
import Rankings from './rankings/index.vue'
import Block from './Block.vue';
import Settings from './Settings.vue';
import { Game2048, postScore, postScoreNew } from './game'
import BGM from './BGM.mp3'
import { useUserData } from './data';
import { angle } from './orientation'

defineOptions({
  name: '2048 Game',
})

const _change = ref(0)
const tracks = ref<any>([])
const game = new Game2048()

const gameSettings = game.gameSettings

if (localStorage.getItem("gameSettings")) {
  Object.assign(gameSettings, JSON.parse(localStorage.getItem("gameSettings")!))
}

watch(gameSettings, (newVal) => {
  localStorage.setItem("gameSettings", JSON.stringify(newVal))
})

const options = reactive({
  nonLatest: false,
  latest: "4131",
  mute: false,
  error: false,
  version: "",
  recordsMode: false,
  personal: game.personal,
  online: game.onlinePlayers,
  state: game.state,
  game: null,
  menu: "游戏"
})

// @ts-ignore
const user = window.$name

function transparencyToggle(val: boolean) {
  if (historyHighest.value <= 1000) {
    alert('很抱歉，您需要达到 3,000 分才可以进行游戏设置！')
    return
  }

  setTimeout(() => options.recordsMode = val, 200)
}

const historyHighest = computed(() => {
  const _user = [...game.rankings.value].filter(res => res.user === user.value)
  if (_user.length !== 1) return options.state.score

  return Math.max(options.state.score, _user[0].score)
})

game.listen((_tracks: any) => {
  tracks.value = _tracks

  const music = document.getElementById('music') as HTMLAudioElement
  if (options.state.status === 'end') {
    // options.state.status = 'pending'
    if (gameSettings.func.startUp) {
      postScore(user.value, options.state.score)
    } else postScoreNew(user.value, options.state.score)

    // 清空缓存
    localStorage.removeItem('__map');
    localStorage.removeItem('__state');

    music?.pause?.()

    setTimeout(() => game.playFailed(), 200)
  } else if (!options.mute) music?.play?.()

})

setTimeout(() => game.start(user), 200)

function restart(ignoreState: boolean = false) {
  game.start(user, ignoreState)
}

function handleREstart() {
  restart()
}

function change() {
  _change.value += 1

  if (_change.value >= 5) {
    // 弹出确认框
    if (!confirm("切换账号会导致本地数据被清空，是否继续？")) return

    _change.value = 0;

    user.value = ''
    localStorage.setItem('user', '')

    localStorage.removeItem('__map');
    localStorage.removeItem('__state');
    localStorage.removeItem('gameSettings');

    location.reload()
  }
}

// const baseUrl = 'https://124.223.71.129:9981'
const baseUrl = 'https://gameends.tagzxia.com:9981'

function getStatus() {
  // 向 baseUrl/status 发送 get
  fetch(`${baseUrl}/status`)
    .then(res => res.json())
    .then(data => {
      options.version = data?.version
      options.error = !data?.status
      options.nonLatest = data?.latest > options.latest
    })
    .catch(err => {
      options.error = true
      console.log(err)
    })
}


function reconnect() {
  getStatus()
}

getStatus()

// @ts-ignore force exist
watch(() => options.recordsMode || options.error || options.reverse, (val) => window._ignore = val)
// @ts-ignore force exist
watch(() => options.menu, (val) => window._ignore = val !== '游戏')
watch(() => options.recordsMode, val => {
  if (!val) options.menu = '游戏'
})

const time = computed(() => options.state.status === 'start' ? new Date().getTime() - gameSettings.time : 0)

const userData = useUserData(options)
provide('userData', userData)
</script>

<template>
  <div @click="reconnect" @touchstart="reconnect" class="Game"
    :class="{ rankings: options.menu === '排行', startup: gameSettings.func.startUp, records: options.recordsMode, error: options.error }">
    <div class="Game-end" :class="{ show: options.state.status === 'end' }">
      <p>游戏结束</p>
      <button @touchstart="handleREstart" @click="handleREstart">重新开始</button>
    </div>

    <div class="Game-Container">
      <HeadBar :online="options.online" :historyHighest="historyHighest" :rankings="game.rankings"
        :score="options.state.score" />

      <div class="GameWrapper">
        <div id="GameJust" class="Just">
          <div v-if="options.version" class="BlockLine" v-for="(col, i) in game.map" :key="i">
            <Block :angle="gameSettings.func.rotate ? angle : 0" v-for="(item, j) in col" :tracks="tracks" :key="j"
              :x="j" :y="i" :val="item" />
          </div>
        </div>
        <div class="Back">
          <Rankings :show="options.menu === '排行'" :options="options" :rankings="game.rankings" />
        </div>
      </div>

      <div v-if="options.nonLatest" class="non-latest">您的页面不是最新版本，刷新多次后更新！</div>
    </div>

    <Settings :options="options.personal" v-model:show="options.recordsMode" :data="gameSettings" />

    <div @click="change" @touchstart="change" class="Game-Info">
      欢迎 {{ user }} ！ <span class="version">v{{ options.latest }}/{{ options.version }}</span>
    </div>

    <audio id="music" :src="BGM" autoplay="false" preload="auto"></audio>

    <Slider @restart="restart" :time="time" v-model="gameSettings.mode" />
    <Footer @settings="transparencyToggle" v-model="options.menu" />
  </div>
</template>

<style>
.Game-Container {
  position: absolute;
  padding: 1rem 0;
  display: flex;

  align-items: center;
  flex-direction: column;
  justify-content: space-around;

  top: 20px;

  width: 100%;
  height: calc(90% - 70px);
}

.GameWrapper {
  position: relative;
  display: flex;

  top: 0;
  left: 0;

  width: 22rem;
  height: 22rem;

  border-radius: 8px;
  background-color: #e6e6e680;
  backdrop-filter: blur(18px) saturate(180%);
  /* transform: translate(-50%, -50%); */

  transition: .25s cubic-bezier(.4, 0, .2, 1);
  transform-style: preserve-3d;
  perspective: 1000px;

  overflow: hidden;
}

.Game.startup .Tools,
.Game.records .Tools {
  opacity: 0;
  transform: scale(0)
}

.non-latest {
  position: relative;
  padding: .125rem .5rem;

  width: max-content;

  text-align: center;
  border-radius: 8px;
  background-color: #ffffff50;
  backdrop-filter: blur(18px) saturate(180%);
  animation: shinning cubic-bezier(0.6, -0.28, 0.735, 0.045) 1.5s infinite;
  transition: .25s;
}

.Game.records .non-latest {
  transform: translate(-50%, 0) scale(0);
}

@keyframes shinning {

  0%,
  100% {
    opacity: .25;
  }

  50% {
    opacity: 1;
  }
}

.version {
  opacity: .5;
  font-size: 0.8rem;
}

.Game.records .GameWrapper {
  pointer-events: none;
  opacity: 0.5;

  perspective: 1000px;
  transform-style: preserve-3d;
  transform: translate(0, -120%) scale(0) rotate3D(0.5, 0, 0, 320deg);
}

.Tools {
  position: relative;
  display: flex;

  gap: 1rem;
  justify-content: center;
  align-items: center;

  /* left: 50%; */
  /* top: 30%; */

  width: 22rem;
  height: 5%;

  cursor: pointer;
  user-select: none;
  overflow-y: scroll;
  border-radius: 8px;
  background-color: #e6e6e680;
  backdrop-filter: blur(18px) saturate(180%);
  /* transform: translate(-50%, 0); */
  z-index: 100;

  overflow: hidden;
  transition: .25s;
}

.GameWrapper .Back,
.GameWrapper .Just {
  position: absolute;

  left: 0;
  top: 0;

  width: 100%;
  height: 100%;

  backface-visibility: hidden;
}

.Game.error::before {
  z-index: 100000;
  content: "无法连接至远程服务器！";
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

.Game-Info {
  z-index: 1000;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 20px;
  background-color: rgba(255, 255, 255, .5);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;

  backdrop-filter: blur(18px) saturate(180%);
}

.Game-end {
  z-index: 1001;
  position: absolute;
  display: flex;

  flex-direction: column;

  gap: 1rem;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  opacity: 0;
  pointer-events: none;
  transform: scale(1.2);
  transition: .25s;

  background-color: #00000050;

}

.Game-end.show {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
}

.Game-end button {
  padding: .5rem;

  cursor: pointer;
  border-radius: 8px;
  background-color: #ffffff80;
}

.Game-end p {
  font-size: 1.5rem;
  font-weight: 600;

  color: #ffffffA0;
}

.Game {
  position: absolute;

  width: 100%;
  height: 100%;

  background-size: cover;
  background-image: linear-gradient(120deg, #e0c3fcE0 0%, #8ec5fcE0 100%);
  /* background-image: url("./bg.png"); */

  overflow: hidden;

  animation: hue 30s infinite linear;
}

body.speed .Game {
  background-size: 100% 200%;

  animation: speedUp 10s infinite linear;
}

@keyframes speedUp {
  from {
    filter: hue-rotate(0deg);
    background-position: 0 0;
  }

  to {
    filter: hue-rotate(360deg);
    background-position: 0 200%;
  }
}

@keyframes hue {
  from {
    filter: hue-rotate(0deg);
  }

  to {
    filter: hue-rotate(360deg);
  }
}
</style>

<route lang="yaml">
meta:
  layout: game
</route>
