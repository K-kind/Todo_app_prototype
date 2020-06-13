<template>
  <div class="today-column">
    <WorkingTask />
    <DailyTasks :date="today" />
    <CompletedTasks :date="today" />
  </div>
</template>

<script>
import WorkingTask from '@/components/WorkingTask.vue'
import DailyTasks from '@/components/DailyTasks.vue'
import CompletedTasks from '@/components/CompletedTasks.vue'

export default {
  name: 'TodayColumn',
  components: {
    WorkingTask,
    DailyTasks,
    CompletedTasks
  },
  computed: {
    today() { return new Date },
  }
}
</script>