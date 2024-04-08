<script setup lang="ts">
const props = defineProps<{
  options: any,
}>()

const average = computed(() => {
  // options有一个history记录战绩列表 其中每一项score代表分数 给我求平均分
  return !props.options?.history?.length ? 0 : Math.round(props.options.history.reduce((sum, item) => sum + item.score, 0) / props.options.history.length)
})

const total = computed(() => {
  const _score = !props.options?.history?.length ? 0 : props.options.history.reduce((sum, item) => sum + item.score, 0)

  // 每 3 位加一个,
  return _score.toString().replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,')
})

const tasks = ref(["累计积分达到 100,000 分", "累计积分达到 1,000,000 分", "累计积分达到 10,000,000 分"])
const purchases = ref(["撤销道具", "复活道具", "屏蔽交换道具"])
</script>

<template>
  <div>
    <div class="player-info-card">
      <div class="info">
        <h2>你的个人游戏信息</h2>
        <div class="stats">
          <div class="stat">
            <div class="label">累计得分:</div>
            <div class="value">{{ total }}分</div>
          </div>
          <div class="stat">
            <div class="label">平均得分:</div>
            <div class="value">{{ average }}分</div>
          </div>
          <div class="stat">
            <div class="label">游戏场次:</div>
            <div class="value">{{ options.game_count }}场</div>
          </div>
        </div>
      </div>
    </div>

    <div class="player-info-card">
      <div class="purchases">
        <h3>完成任务</h3>
        <span>统计： 0/0 个</span>
      </div>
      <ul>
        <li v-for="(purchase, index) in tasks" :key="index">{{ purchase }}</li>
      </ul>
    </div>

    <div class="player-info-card">
      <div class="purchases">
        <h3>商店购买</h3>
        <span>积分：{{ String(options.cumulative_score || 0).replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,') }}</span>
      </div>
      <ul>
        <li v-for="(purchase, index) in purchases" :key="index">{{ purchase }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.purchases {
  border-bottom: 1px solid #ccc;
  margin-bottom: 20px;

  /* gap: 1rem;
  display: flex;
  justify-content: center; */
}

.purchases h3 {
  text-align: center;
  font-weight: 600;
}

.purchases span {
  display: inline-block;
  padding: 0 1rem;

  width: 100%;
  text-align: right;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.player-info-card {
  width: 100%;
  margin: 0 auto 1rem;
  padding: 20px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.info {
  text-align: center;
  font-weight: 600;
}

.stats {
  display: flex;

  gap: .5rem;
  justify-content: space-around;
  margin-top: 20px;

  font-weight: 300;
}

.stat {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.label {
  font-weight: bold;
}

.value {
  margin-top: 5px;
}
</style>
