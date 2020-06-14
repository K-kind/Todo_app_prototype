<template>
  <div class="today-column">
    <WorkingTask />
    <CompletedTasks :date="today" />
  </div>
</template>

<script>
import WorkingTask from '@/components/WorkingTask.vue'
import CompletedTasks from '@/components/CompletedTasks.vue'

export default {
  name: 'TodayColumn',
  components: {
    WorkingTask,
    CompletedTasks
  },
  computed: {
    today() { return new Date },
  }
}
</script>
