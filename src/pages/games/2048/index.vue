<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import VolumeOn from './volume-on.svg?raw'
import VolumeOff from './volume-off.svg?raw'
import HeadBar from './HeadBar.vue';
import Block from './Block.vue';
import Records from './Records.vue';
import Settings from './Settings.vue';
import BackFace from './BackFace.vue';
import { Game2048, postScore } from './game'
import BGM from './BGM.mp3'

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
  mute: false,
  reverse: false,
  error: false,
  version: "",
  recordsMode: false,
  personal: game.personal,
  online: game.onlinePlayers,
  state: game.state,
  game: null,
})

// @ts-ignore
const user = window.$name

function transparencyToggle() {
  // if (historyHighest.value <= 5000) {
  //   alert('很抱歉，您需要达到 5,000 分才可以启用战绩欣赏模式！')
  //   return
  // }
  if (historyHighest.value <= 1000) {
    alert('很抱歉，您需要达到 3,000 分才可以进行游戏设置！')
    return
  }
  options.recordsMode = !options.recordsMode
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
    postScore(user.name, options.state.score)

    // 清空缓存
    localStorage.removeItem('__map');
    localStorage.removeItem('__state');

    music?.pause?.()

    setTimeout(() => game.playFailed(), 200)
  } else if (!options.mute) music?.play?.()

})

setTimeout(() => game.start(user.value), 200)

function restart() {
  game.start(user.value)
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
watch(() => options.error || options.reverse, (val) => window._ignore = val)

// watch(() => options.mute, val => {
//   const music = document.getElementById('music') as HTMLAudioElement
//   if (val) music?.pause?.()
//   else music?.play?.()
// })
</script>

<template>
  <div @click="reconnect" @touchstart="reconnect" class="Game"
    :class="{ records: options.recordsMode, error: options.error }">
    <div class="Game-end" :class="{ show: options.state.status === 'end' }">
      <p>游戏结束</p>
      <button @touchstart="restart" @click="restart">重新开始</button>
    </div>
    <HeadBar :online="options.online" :historyHighest="historyHighest" :rankings="game.rankings"
      :score="options.state.score" />
    <div class="GameWrapper" :class="{ reverse: options.reverse }">
      <div id="GameJust" class="Just">
        <div v-if="options.version" class="BlockLine" v-for="(col, i) in game.map" :key="i">
          <Block v-for="(item, j) in col" :tracks="tracks" :key="j" :x="j" :y="i" :val="item" />
        </div>
      </div>
      <div class="Back">
        <BackFace v-if="options.reverse" :options="options" :rankings="game.rankings" />
      </div>
    </div>

    <div class="ToggleButtons">
      <span @touchstart.prevent="options.reverse = !options.reverse"
        @click="options.reverse = !options.reverse">查看排行</span>
      <span @touchstart.prevent="transparencyToggle" @click="transparencyToggle">游戏设置</span>
    </div>

    <!-- <Records :show="options.recordsMode" :data="options.personal" /> -->
    <Settings :show="options.recordsMode" :data="gameSettings" />

    <div @click="change" @touchstart="change" class="Game-Info">
      欢迎 {{ user }} ！ <span class="version">v482/{{ options.version }}</span>
    </div>

    <!-- <div @touchstart="options.mute = !options.mute" @click="options.mute = !options.mute" class="mute">
      <span v-html="options.mute ? VolumeOff : VolumeOn" />
    </div> -->
    <audio id="music" :src="BGM" autoplay="false" preload="auto"></audio>

  </div>
</template>

<style>
/* .mute {
  zoom: .75;
  position: absolute;
  margin: .75rem;
} */

.version {
  opacity: .5;
  font-size: 0.8rem;
}

.Game.records .GameWrapper {
  pointer-events: none;
  opacity: 0.5;

  perspective: 1000px;
  transform-style: preserve-3d;
  transform: translate(-50%, -120%) scale(0) rotate3D(0.5, 0, 0, 320deg);
}

.Game.records .ToggleButtons {
  bottom: 92.5%;
}

.ToggleButtons span {
  padding: .25rem 1rem;

  flex: 1;
  text-align: center;
  border-radius: 8px;
  background-color: #e6e6e680;
  backdrop-filter: blur(18px) saturate(180%);
}

.ToggleButtons {
  position: absolute;
  display: flex;

  gap: 1rem;
  justify-content: center;
  align-items: center;

  left: 50%;
  bottom: 10%;

  width: 85%;
  height: 5%;
  /* height: 4rem; */

  cursor: pointer;
  user-select: none;
  overflow-y: scroll;
  /* background-color: #e6e6e6; */
  transform: translate(-50%, 0);
  z-index: 100;

  transition: .25s;
}

.GameWrapper.reverse {
  transform: translate(-50%, -50%) rotateY(180deg)
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

.GameWrapper.reverse .Back {
  background-color: #e6e6e6A0;
  transform: rotateY(180deg);

  backface-visibility: visible;
}

.GameWrapper.reverse .Just {
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
  bottom: 0;
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

@keyframes hue {
  from {
    filter: hue-rotate(0deg);
  }

  to {
    filter: hue-rotate(360deg);
  }
}

.GameWrapper {
  position: absolute;
  display: flex;

  top: 50%;
  left: 50%;

  width: 22rem;
  height: 22rem;

  border-radius: 8px;
  background-color: #e6e6e680;
  backdrop-filter: blur(18px) saturate(180%);
  transform: translate(-50%, -50%);

  transition: .25s;
  transform-style: preserve-3d;
  perspective: 1000px;

  overflow: hidden;
}
</style>

<route lang="yaml">
meta:
  layout: game
</route>
