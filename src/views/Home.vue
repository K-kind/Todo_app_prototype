<template>
  <div class="home">
    <DailyTasks :date="today" />
    <DailyTasks :date="tomorrow" />
  </div>
</template>

<script>
// @ is an alias to /src
import DailyTasks from '@/components/DailyTasks.vue'

export default {
  name: 'Home',
  components: {
    DailyTasks
  },
  computed: {
    today() {
      return new Date
    },
    tomorrow() {
      let today = new Date
      today.setDate(today.getDate() + 1)
      return today
    }
  }
}
</script>

<style scoped>
.home {
  display: flex;
}
</style>