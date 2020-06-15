<template>
  <div>
    <WeeklyTasks />
  </div>
</template>

<script>
import WeeklyTasks from '@/components/WeeklyTasks.vue'
import { SET_NEW_TASK_ID } from '@/store/mutation-types'

export default {
  name: 'WeeklyColumn',
  components: {
    WeeklyTasks
  },
  mounted() {
    this.$store.dispatch('weekly/' + SET_NEW_TASK_ID)
  }
}
</script>
