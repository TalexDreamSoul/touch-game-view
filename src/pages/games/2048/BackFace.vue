<script setup lang="ts">
const props = defineProps<{
  rankings: any,
}>()

const menu = ref(0)
</script>

<template>
  <div class="BackFace">
    <div class="Menu">
      <span @click="menu = 0" :class="{ select: menu === 0 }">排行</span>
      <span @click="menu = 1" :class="{ select: menu === 1 }">奖章</span>
    </div>
    <div class="Main">
      <div :class="{ select: menu === 0 }" class="Rankings">
        <span v-for="(item, index) in rankings">
          No{{ index + 1 }}. {{ item.user }}: {{ item.score }}分
        </span>
      </div>
      <div :class="{ select: menu === 1 }" class="Awards">
        你还没有获得任何奖章.
      </div>
    </div>
  </div>
</template>

<style>
.Main {
  position: relative;

  flex: 1;

  overflow-y: scroll;
  overflow-x: hidden;
}

.Menu span {
  /* flex: 1; */

  width: 30%;
  text-align: center;

  cursor: pointer;
  transition: .25s;
  border-radius: 4px;
  background-color: #c6c6c680;
}

.Menu span.select {
  flex: 1;

  color: #ffffffEA;
  background-color: #289be780;
}

.Menu {
  display: flex;

  gap: .5rem;
  justify-content: space-around;

  color: #000;

  width: 100%;
}

.BackFace {
  display: flex;
  flex-direction: column;

  gap: .5rem;

  padding: .5rem;

  height: 100%;

  backdrop-filter: blur(18px) saturate(180%);
}

.Rankings span {
  color: #000000EA;

  font-size: 1.2rem;

}

.Awards {
  position: absolute;
  padding: 0 .25rem;
  display: flex;

  flex-direction: column;
  justify-content: flex-start;
  /* align-items: center; */

  top: 0;
  left: 0%;

  width: 100%;
  height: 100%;

  color: #000000EA;
  transition: .25s;
  transform: scale(.8) translateX(200%);
}

.Awards.select {
  transform: scale(1) translateX(0);
}

.Rankings {
  position: absolute;
  padding: 0 .25rem;
  display: flex;

  flex-direction: column;
  justify-content: flex-start;
  /* align-items: center; */

  top: 0;
  left: 0%;

  width: 100%;
  height: 100%;

  transition: .25s;
  transform: scale(.8) translateX(-200%);
}

.Rankings.select {
  transform: scale(1) translateX(0);
}
</style>
