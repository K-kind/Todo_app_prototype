<template>
  <div class="today-column">
    <DailyTasks :date="today" />
  </div>
</template>

<script>
import DailyTasks from '@/components/DailyTasks.vue'

export default {
  name: 'TodayColumn',
  components: {
    DailyTasks,
  },
  computed: {
    today() { return new Date },
  }
}
</script>
