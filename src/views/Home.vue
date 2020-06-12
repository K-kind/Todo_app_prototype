<template>
  <div class="home">
    <DailyTasks :date="today" />
    <DailyTasks :date="tomorrow" />
  </div>
</template>

<script>
import DailyTasks from '@/components/DailyTasks.vue'

export default {
  name: 'Home',
  // data() {
  //   dates: []
  // },
  components: {
    DailyTasks
  },
  computed: {
    today() {
      return new Date
    },
    tomorrow() {
      let date = new Date
      date.setDate(date.getDate() + 1)
      return date
    },
    day(from_today) {
      let date = new Date
      date.setDate(date.getDate() + from_today)
      return date
    }
  }
}
</script>

<style scoped>
.home {
  display: flex;
}
</style>