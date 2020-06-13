<template>
  <div class="daily-column">
    <DailyTasks v-for="n in 7" :date="day(n)" :key="n"></DailyTasks>
  </div>
</template>

<script>
import DailyTasks from '@/components/DailyTasks.vue'

export default {
  name: 'DailyColumn',
  components: {
    DailyTasks
  },
  methods: {
    day(from_today) {
      let date = new Date
      date.setDate(date.getDate() + from_today)
      return date
    }
  }
}
</script>

<style scoped>
.daily-column {
  vertical-align: top;
}
</style>