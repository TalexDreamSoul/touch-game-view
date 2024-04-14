<template>
  <div class="MainHead">
    <div class="avatar">
      <img v-if="avatar" :src="avatar" alt="avatar" />
    </div>
    <div class="title">{{ menu ? '账户设置' : '所有游戏' }}</div>
    <MenuButton v-model="menu" />
  </div>

  <teleport to="body">
    <div :class="{ menu }" class="MenuCard">
      <div class="MenuCard-Container">
        <p>账户详情({{ name }})</p>
        <section class="section_form">
          <form @submit="handleSubmit" id="consultation-form" class="feed-form" action="#">
            <p class="form-item">QQ号码</p>
            <input v-model="userInfo.qq" required="" placeholder="QQ ID Number" type="number">
            <button class="button_submit">修改</button>
          </form>
        </section>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import MenuButton from './button/MenuButton.vue'
import { getUserInfo, updateUserInfo } from './user';

// @ts-ignore
const name = window.$name
const menu = ref(false)
const userInfo = ref({
  user: '',
  init: -1,
  name: '',
  qq: ''
})

// @ts-ignore
window.$userInfo = userInfo

async function getData() {
  const res = await getUserInfo(name.value)
  if (res.message) {
    await updateUserInfo(name.value, 'init', new Date().getTime())
    return getData()
  }
  // userInfo.value = res
  Object.assign(userInfo.value, res)

  console.log(userInfo.value)
}
getData()

async function handleSubmit() {
  await updateUserInfo(name.value, 'qq', userInfo.value.qq)
}

const avatar = computed(() => {
  // 检验是否合法的QQ号码
  const regex = /^[1-9][0-9]{4,10}$/
  if (!regex.test(userInfo.value.qq)) return ''
  return `https://q1.qlogo.cn/g?b=qq&nk=${userInfo.value.qq}&s=100`
})
</script>

<style scoped>
.avatar {
  width: 36px;
  height: 36px;

  overflow: hidden;
  border-radius: 50%;
  border: 1px solid rgba(255, 0, 0, 0.5);
  background-color: #eee;
}

.form-item {
  opacity: .75;
  font-size: 1rem;
}

.feed-form {
  margin-top: 36px;
  display: flex;
  flex-direction: column;
  width: 300px;
}

.feed-form input {
  height: 54px;
  border-radius: 5px;
  background: white;
  margin-bottom: 15px;
  border: none;
  padding: 0 20px;
  font-weight: 300;
  font-size: 14px;
  color: #4B4B4B;

  border: 2px solid #ccc;
}

.button_submit:active,
.feed-form input:hover {
  outline: none;
  border: 1px solid #000;
  background-color: #00000005;
  box-shadow: 0px 0px 3px 0px #212529;
}

.button_submit {
  width: 100%;
  height: 54px;
  font-size: 14px;
  color: white;
  background: red;
  border-radius: 5px;
  border: none;
  font-weight: 500;
  text-transform: uppercase;
}

/* .section_form {
  display: flex;
  flex-direction: column;
  align-items: center;
} */
</style>

<style>
.MenuCard-Container p {
  font-size: 1.5rem;
  font-weight: 600;
}

.MenuCard-Container {
  top: 15%;

  width: 100%;
  height: 100%;

  padding: 1rem 2rem;
  position: relative;
}

.MenuCard {
  z-index: 1000;
  position: absolute;

  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  color: #000;
  opacity: .85;
  transition: cubic-bezier(0.47, 0, 0.745, 0.715) .25s;
  transform: translateY(-150%);
  background-color: #ffffff;
}

.MenuCard.menu {
  opacity: 1;
  transform: translateY(0);
}
</style>

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

  pointer-events: all;
  overflow: hidden;
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
