<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import Block from './Block.vue';
import { Game2048 } from './game'

defineOptions({
  name: '2048 Game',
})

const score = ref(0)
const status = ref("pending")
const arr = ref<any>([])
const tracks = ref<any>([])
const game = new Game2048()
// const user = useUserStore()

watchEffect(() => {
  arr.value = game.map

  game.listen((_tracks: any) => {
    tracks.value = _tracks

    score.value = game.state.score
    status.value = game.state.status
  })
  game.start()
})

function restart() {
  game.start()
}
</script>

<template>
  <div class="Game">
    <div class="Game-end" :class="{ show: status === 'end' }">
      <p>游戏结束</p>
      <button @click="restart">重新开始</button>
    </div>
    <div class="Game-Bar">
      <div class="Game-Bar-Title">2048
      </div>
      <div class="Game-Bar-Line">
        游戏排行
        <span class="game-score">0</span>
      </div>
      <div class="Game-Bar-Line">
        历史最高
        <span class="game-score">{{ score }}</span>
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
  </div>
</template>

<style>
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
  background-image: url("./bg.jpg");
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
  top: 20%;

  width: 24rem;
  height: 4rem;

  border-radius: 8px;
  /* background-color: #e6e6e6; */
  transform: translate(-50%, -50%);
  z-index: 100;
}

.GameWrapper {
  position: absolute;
  display: flex;

  top: 50%;
  left: 50%;

  width: 24rem;
  height: 24rem;

  border-radius: 8px;
  background-color: #e6e6e680;
  backdrop-filter: blur(18px) saturate(180%);
  transform: translate(-50%, -50%);
}
</style>

<route lang="yaml">
meta:
  layout: game
</route>
