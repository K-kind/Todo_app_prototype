<template>
  <div class="today-column">
    <WorkingTask />
    <DailyTasks :date="today" />
  </div>
</template>

<script>
import WorkingTask from '@/components/WorkingTask.vue'
import DailyTasks from '@/components/DailyTasks.vue'

export default {
  name: 'TodayColumn',
  // data() {
  //   dates = []
  // },
  components: {
    DailyTasks
  },
  computed: {
    today() { return new Date },
  }
}
</script>