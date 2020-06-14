<template>
  <div class="today-column">
    <DailyTasks :date="today">
      <template v-slot:taskDate1>本日 </template>
      <template v-slot:taskDate2> のタスク</template>
    </DailyTasks>
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
