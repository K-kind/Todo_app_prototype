<template>
  <div class="this-week-column">
    <CompletedTasks :date="today" />
  </div>
</template>

<script>
import CompletedTasks from '@/components/CompletedTasks.vue'

export default {
  name: 'ThisWeekColumn',
  components: {
    CompletedTasks
  },
  computed: {
    today() { return new Date },
  }
}
</script>
