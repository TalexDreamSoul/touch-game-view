<script setup lang="ts">
import CircleCarousel from './CircleCarousel.svg'

const props = defineProps<{
  modelValue?: boolean,
}>()

</script>

<template>
  <div class="CardCarousel">
    <div class="container">
      <div class="box">
        <span class="title">TaGzxia Games</span>
        <div>
          <strong>游戏唯一身份认证卡</strong>
          <p>0000 000 000 0001</p>
          <span>有效至</span> <span>24/04/30</span>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.CardCarousel {
  position: relative;
  margin: 10% 0;

  width: 80%;
  height: 180px;

  /* mask-image: url(#wave);
  -webkit-mask-image: url(#wave); */
  /* background-color: #0f0f0fA0; */
  /* -webkit-mask: url('data:image/svg+xml;charset=utf-8,<svg height="100%" width="100%"><path d="m 0 0 l 356 0 l 0 130 l -356 0 m 0 -130 c 175.5 24 175.5 24 356 0 M 166.5 18 L 175.5 24 L 175.5 24 L 184.5 18" stroke="#ffffff" fill="transparent" /></svg>') no-repeat; */
  /* -webkit-mask: url('data:image/svg+xml;charset=utf-8,<svg height="100%" width="100%"><path d="m 0 0 l 356 0 l 0 130 l -356 0 m 0 -130 c 175.5 24 175.5 24 356 0 M 166.5 18 L 175.5 24 L 175.5 24 L 184.5 18" stroke="#ffffff" fill="transparent" /></svg>') no-repeat; */
  /* backdrop-filter: blur(18px) saturate(180%); */
}

.container {
  color: #fff;
  position: relative;
  font-family: sans-serif;

  border-radius: 8px;
  background-color: #0f0f0fA0;
  backdrop-filter: blur(18px) saturate(180%);
}

.container::before,
.container::after {
  content: "";
  background-color: #fab5704c;
  position: absolute;
}

.container::before {
  border-radius: 50%;
  width: 6rem;
  height: 6rem;
  top: 30%;
  right: 7%;
}

.container::after {
  content: "";
  position: absolute;
  height: 3rem;
  top: 8%;
  right: 5%;
  border: 1px solid;
}

.container .box {
  width: 100%;
  height: 100%;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.074);
  border: 1px solid rgba(255, 255, 255, 0.222);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  border-radius: 0.7rem;
  transition: all ease 0.3s;
}

.container .box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.container .box .title {
  font-size: 2rem;
  font-weight: 500;
  letter-spacing: 0.1em;
}

.container .box div strong {
  display: block;
  margin-bottom: 0.5rem;
}

.container .box div p {
  margin: 0;
  font-size: 0.9em;
  font-weight: 300;
  letter-spacing: 0.1em;
}

.container .box div span {
  font-size: 0.7rem;
  font-weight: 300;
}

.container .box div span:nth-child(3) {
  font-weight: 500;
  margin-right: 0.2rem;
}

.container .box:hover {
  box-shadow: 0px 0px 20px 1px #ffbb763f;
  border: 1px solid rgba(255, 255, 255, 0.454);
}
</style>
