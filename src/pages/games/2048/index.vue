<script setup lang="ts">
import { ref, watchEffect, computed } from 'vue';
import Block from './Block.vue';
import { Game2048 } from './game'

defineOptions({
  name: '2048 Game',
})

const error = ref(false)
const score = ref(0)
const rankings = ref<any>([])
const _change = ref(0)
const status = ref("pending")
const arr = ref<any>([])
const tracks = ref<any>([])
const game = new Game2048()
// @ts-ignore
const user = window.$name

const historyHighest = computed(() => {
  const _user = [...rankings.value].filter(res => res.user === user.value)
  if (_user.length !== 1) return score.value

  return Math.max(score.value, _user[0].score)
})

const topIndex = computed(() => {
  const _ind = [...rankings.value].findIndex(res => res.user === user.value)

  return _ind + 1 || 999
})

watchEffect(() => {
  arr.value = game.map

  game.listen((_tracks: any) => {
    tracks.value = _tracks

    score.value = game.state.score
    status.value = game.state.status

    if (status.value === 'end') {
      postScore()

      // 清空缓存
      localStorage.removeItem('__map');
      localStorage.removeItem('__state');

      console.log('数据上传完毕！')
    }
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
    _change.value = 0;

    user.value = ''
    localStorage.setItem('user', '')
  }
}

const baseUrl = 'http://124.223.71.129:9981'

function getStatus() {
  // 向 baseUrl/status 发送 get
  fetch(`${baseUrl}/status`)
    .then(res => res.json())
    .then(data => {
      error.value = !data?.status
    })
    .catch(err => {
      error.value = true
      console.log(err)
    })
}

function postScore() {
  if (historyHighest.value > score.value) return

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
</script>

<template>
  <div @click="reconnect" @touchstart="reconnect" class="Game" :class="{ error }">
    <div class="Game-end" :class="{ show: status === 'end' }">
      <p>游戏结束</p>
      <button @touchstart="restart" @click="restart">重新开始</button>
    </div>
    <div class="Game-Bar">
      <div class="Game-Bar-Title">2048
      </div>
      <div class="Game-Bar-Line">
        游戏排行
        <span class="game-score">{{ topIndex || 0 }}</span>
      </div>
      <div class="Game-Bar-Line">
        历史最高
        <span class="game-score">{{ historyHighest }}</span>
      </div>
      <div class="Game-Bar-Line">
        当前得分
        <span class="game-score">{{ score }}</span>
      </div>
    </div>
    <div class="GameWrapper">
      <div class="BlockLine" v-for="(col, i) in arr" :key="i">
        <Block v-for="(item, j) in col" :tracks="tracks" :key="j" :x="j" :y="i" :val="item" />
      </div>
      <!-- <iframe src="/games/2048/index.html" width="100%" height="100%" frameborder="0" /> -->
    </div>

    <div class="Rankings">
      <span v-for="(item, index) in rankings">
        NO{{ index + 1 }}. {{ item.user }}: {{ item.score }}
      </span>
    </div>

    <div @click="change" @touchstart="change" class="Game-Info">
      欢迎 {{ user }} ！
    </div>
  </div>
</template>

<style>
.Rankings span {
  color: #fff;

  font-size: 1.2rem;

}

.Rankings {
  position: absolute;
  padding: 0 1rem;
  display: flex;

  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  left: 50%;
  bottom: 25px;

  width: 85%;
  height: 15%;
  /* height: 4rem; */

  background-color: #e6e6e680;
  backdrop-filter: blur(18px) saturate(180%);

  overflow-y: scroll;
  border-radius: 8px;
  /* background-color: #e6e6e6; */
  transform: translate(-50%, 0);
  z-index: 100;
}

.Game.error::before {
  z-index: 100000;
  content: "无法连接至远程服务器！";
  position: absolute;

  display: flex;
  align-item: center;
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
  background-image: url("./bg.png");

  overflow: hidden;
}

.Game-Bar-Title {
  font-size: 2rem;
  font-weight: 600;

  color: #fff;
  text-shadow: 0 0 8px #000;
}

.game-score {
  width: 4rem;

  text-align: center;

  color: #9A6E5B;
  background: #FCF5E9A0;
  border-radius: 8px;
}

.Game-Bar-Line {
  display: flex;
  padding: .5rem;

  gap: .5rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  color: #fff;
  border-radius: 8px;
  background: #C4876A80;
  backdrop-filter: blur(18px) saturate(180%);
}

.Game-Bar {
  position: absolute;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  left: 50%;
  top: 10%;

  width: 24rem;
  height: 4rem;

  border-radius: 8px;
  /* background-color: #e6e6e6; */
  transform: translate(-50%, -50%);
  z-index: 100;

  overflow: hidden;
}

.GameWrapper {
  position: absolute;
  display: flex;

  top: 50%;
  left: 50%;

  width: 20rem;
  height: 20rem;

  border-radius: 8px;
  background-color: #e6e6e680;
  backdrop-filter: blur(18px) saturate(180%);
  transform: translate(-50%, -50%);

  overflow: hidden;
}
</style>

<route lang="yaml">
meta:
  layout: game
</route>
