<script setup lang="ts">
import { ref, watchEffect, computed, watch } from 'vue';
import HeadBar from './HeadBar.vue';
import Block from './Block.vue';
import BackFace from './BackFace.vue';
import { Game2048, getUserStatus, getOnline, updateOnlineStatus } from './game'
import BGM from './BGM.mp3'

defineOptions({
  name: '2048 Game',
})

const options = reactive({
  error: false,
  version: "",
  personal: {},
  online: []
})

const transparency = ref(false)
const reverse = ref(false)
const score = ref(0)
const rankings = ref<any>([])
const _change = ref(0)
const status = ref("pending")
const arr = ref<any>([])
const tracks = ref<any>([])
const game = new Game2048()
// @ts-ignore
const user = window.$name

function transparencyToggle() {
  if (historyHighest.value <= 5000) {
    alert('很抱歉，您需要达到 5,000 分才可以启用战绩欣赏模式！')
    return
  }
  transparency.value = !transparency.value
}

const historyHighest = computed(() => {
  const _user = [...rankings.value].filter(res => res.user === user.value)
  if (_user.length !== 1) return score.value

  return Math.max(score.value, _user[0].score)
})

watchEffect(() => {
  arr.value = game.map

  getUserStatus(user.value, (res: any) => options.personal = res)
  game.listen((_tracks: any) => {
    tracks.value = _tracks

    score.value = game.state.score
    status.value = game.state.status

    updateOnlineStatus(user.value)
    getOnline((res: any) => {
      options.online = res.online_users
    })

    if (status.value === 'end') {
      getUserStatus(user.value, (res: any) => options.personal = res)
      postScore()

      // 清空缓存
      localStorage.removeItem('__map');
      localStorage.removeItem('__state');

      console.log('数据上传完毕！')
    }

    // 获取 music audio 播放
    const music = document.getElementById('music') as HTMLAudioElement
    if (status.value === 'end') music.pause()
    else music.play()
  })

  setTimeout(() => game.start(), 200)
})

function restart() {
  game.start()

  score.value = game.state.score
  status.value = game.state.status
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

function postScore() {
  // if (historyHighest.value > score.value) return

  // 上传用户数据
  // 格式: post { user: "", score: 0 }
  fetch(`${baseUrl}/games/2048/score/${user.value}/${score.value}`, {
    // method: 'POST',
    // headers: {
    //   'Content-Type': 'application/json'
    // },
    // body: JSON.stringify({
    //   user: user.savedName,
    //   score: score.value
    // })
  })
    .then(res => res.json())
    .then(data => {
      getRankings()
      console.log("score", data)
    })
    .catch(err => {
      console.log(err)
    })
}

function getRankings() {
  // 向 baseUrl/rank 发送 get
  fetch(`${baseUrl}/games/2048/rank`)
    .then(res => res.json())
    .then(data => {
      rankings.value = data
      console.log("rank", data)
    })
    .catch(err => {
      console.log(err)
    })
}

function reconnect() {
  getStatus()
}

getStatus()
getRankings()

watch(() => reverse.value, (val) => window._ignore = val)
</script>

<template>
  <div @click="reconnect" @touchstart="reconnect" class="Game" :class="{ transparency, error: options.error }">
    <div class="Game-end" :class="{ show: status === 'end' }">
      <p>游戏结束</p>
      <button @touchstart="restart" @click="restart">重新开始</button>
    </div>
    <HeadBar :online="options.online" :historyHighest="historyHighest" :rankings="rankings" :score="score" />
    <div class="GameWrapper" :class="{ reverse }">
      <div id="GameJust" class="Just">
        <div v-if="options.version" class="BlockLine" v-for="(col, i) in arr" :key="i">
          <Block v-for="(item, j) in col" :tracks="tracks" :key="j" :x="j" :y="i" :val="item" />
        </div>
      </div>
      <div class="Back">
        <BackFace v-if="reverse" :options="options" :rankings="rankings" />
      </div>
    </div>

    <div class="ToggleButtons">
      <span @touchstart.prevent="reverse = !reverse" @click="reverse = !reverse">查看排行</span>
      <span @touchstart.prevent="transparencyToggle" @click="transparencyToggle">战绩欣赏</span>
    </div>

    <div @click="change" @touchstart="change" class="Game-Info">
      欢迎 {{ user }} ！ <span class="version">v471/{{ options.version }}</span>
    </div>

    <audio id="music" :src="BGM" autoplay="false" preload="auto"></audio>
  </div>
</template>

<style>
.version {
  opacity: .5;
  font-size: 0.8rem;
}

.Game.transparency .GameWrapper {
  pointer-events: none;
  opacity: 0.5;

  perspective: 1000px;
  transform-style: preserve-3d;
  transform: translate(-50%, -120%) scale(0) rotate3D(0.5, 0, 0, 320deg);
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
