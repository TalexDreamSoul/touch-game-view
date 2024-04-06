<script setup lang="ts">
const props = defineProps<{
  rankings: any,
  historyHighest: number,
  score: number
}>()

// @ts-ignore
const user = window.$name

const topIndex = computed(() => {
  const _ind = [...props.rankings].findIndex(res => res.user === user.value)

  return _ind + 1 || 999
})
</script>

<template>
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
</template>

<style>
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
</style>
