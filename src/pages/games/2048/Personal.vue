<script setup lang="ts">
const props = defineProps<{
  options: any,
}>()

const totalScores = computed(() => !props.options?.history?.length ? 0 : props.options.history.reduce((sum: any, item: any) => sum + item.score, 0))

const average = computed(() => {
  // options有一个history记录战绩列表 其中每一项score代表分数 给我求平均分
  return !props.options?.history?.length ? 0 : Math.round(totalScores.value / props.options.history.length)
})

const total = computed(() => totalScores.value.toString().replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,'))

const tasks = ref<any[]>([])

function genTotalScores(scores: number[]) {
  [...scores].forEach(num => {
    tasks.value.push({
      per: () => {
        if (totalScores.value >= num) return 100

        else return Math.floor((totalScores.value / num) * 100)
      },
      text: `累计得分达到 ${format(num)} 分`
    })
  })
}

genTotalScores([10000, 50000, 100000, 300000, 500000, 800000, 1000000])

function genGameAccounts(scores: number[]) {
  [...scores].forEach(num => {
    tasks.value.push({
      per: () => {
        if (props.options.game_count >= num) return 100

        else return Math.floor((props.options.game_count / num) * 100)
      },
      text: `游戏次数达到 ${format(num)} 次`
    })
  })
}

genGameAccounts([10, 20, 30, 40, 50, 60, 70, 80, 90, 100])

function genSingleTasks(scores: number[]) {
  [...scores].forEach(num => {
    tasks.value.push({
      per: () => {
        if (props.options.cumulative_score >= num) return 100

        else return Math.floor((props.options.cumulative_score / num) * 100)
      },
      text: `单局积分达到 ${format(num)} 分`
    })
  })
}

const computedTasks = computed(() => {
  const _tasks = tasks.value.map((item: any) => {
    return {
      text: item.text,
      per: item.per()
    }
  })

  // 将 per 为 100 的放到最后，其余从大到小
  return _tasks.sort((a: any, b: any) => {
    if (a.per === 100) return 1
    else if (b.per === 100) return -1
    else return b.per - a.per
  })
})

genSingleTasks([1000, 3000, 5000, 8000, 10000, 15000, 20000, 25000, 30000, 35000, 40000, 50000, 80000, 100000])

const purchases = ref(["撤销道具", "复活道具", "屏蔽交换道具"])

// 设置等级升级公式
// 传入 num 返回[等级，下一等级总共需要经验，百分比]
// 0-1 需要 5000
// 1-2 需要 10000
// 2-3 需要 20000
// 3-4 需要 30000
// 4-5 需要 50000
// 5-6 需要 80000
// 6-7 需要 100000
// 现在根据分数倒推等级
// LEVEL = Math.floor(Math.log2(totalScores.value / 10000))
const level = computed(() => {
  const level = Math.floor(Math.log2(totalScores.value / 1000))
  const total = 10000 * Math.pow(2, level + 1)
  const percent = Math.floor((totalScores.value / total) * 100)
  return [level, total, percent]
})

function format(val: any) {
  return String(val).replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,')
}
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
        <div v-if="level?.length === 3" class="level">
          <span style="width: 150px">等级{{ level[0] }}</span>
          <span class="level-progress" :style="`--p: ${level[2]}%`">
            <span class="color">{{ level[2] }}%</span>
          </span>
          <span>{{ format(totalScores) }}/{{ format(level[1]) }}</span>
        </div>
      </div>
    </div>

    <div class="player-info-card">
      <div class="purchases">
        <h3>完成成就</h3>
        <span>统计： {{ computedTasks.filter(item => item.per >= 100).length }} /{{ computedTasks.length }} 个</span>
      </div>
      <ul>
        <li :class="{ active: purchase.per >= 100 }" :style="`--p: ${purchase.per}%`"
          v-for="(purchase, index) in computedTasks" :key="index">{{ purchase.text }}</li>
      </ul>
    </div>

    <div class="player-info-card">
      <div class="purchases">
        <h3>商店购买</h3>
        <span>积分：{{ String(options?.cumulative_score || 0).replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,') }}</span>
      </div>
      <ul>
        <li v-for="(purchase, index) in purchases" :key="index">{{ purchase }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.player-info-card li::before {
  content: "";
  position: absolute;

  height: 100%;
  width: var(--p);

  left: 0;
  top: 0;

  border-radius: .25rem;
  background-color: #16161610;
}

.player-info-card li.active::before {
  background-color: #205b7e10;
}

.player-info-card li.active {
  color: green !important;
  font-weight: 600;
  background-color: #205b7e10;
}

.player-info-card li {
  position: relative;
}

.level {
  margin-top: .75rem;

  display: flex;

  gap: .25rem;
  align-items: center;
  justify-content: space-between;
}

.level span.level-progress {
  position: relative;
  margin: 0 .25rem;

  height: 20px;
  line-height: 20px;
  width: 100%;

  border-radius: .25rem;
  background-color: #e6e6e6E0;
}

span.level-progress .color {
  color: #000;

  text-shadow: 0 0 4px #fff;
  /* mix-blend-mode: difference; */
}

.level span.level-progress::before {
  content: "";
  position: absolute;

  height: 100%;
  width: var(--p);

  left: 0;
  top: 0;

  border-radius: .25rem;
  background-color: #16161680;
}

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
