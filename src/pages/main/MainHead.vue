<template>
  <div class="MainHead">
    <button class="search-btn" op-0>搜索</button>
    <div class="title">所有游戏</div>
    <MenuButton />
  </div>
</template>

<script setup>
import MenuButton from './button/MenuButton.vue'
</script>

<style scoped>
.MainHead {
  z-index: 1000;
  position: absolute;

  top: 0;
  left: 0;

  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #000;
  padding: 10px;
}

.search-btn {
  background-color: #f1f1f1;
  color: black;
  border: none;
  cursor: pointer;
  padding: 5px 10px;
}

.title {
  font-size: 20px;
}
</style>
