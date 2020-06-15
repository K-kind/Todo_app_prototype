<template>
  <div>
    <MonthlyTasks @change-month="changeMonth"/>
  </div>
</template>

<script>
import MonthlyTasks from '@/components/MonthlyTasks.vue'
import { SET_NEW_TASK_ID } from '@/store/mutation-types'

export default {
  name: 'MonthlyColumn',
  components: {
    MonthlyTasks
  },
  methods: {
    changeMonth(startDate) {
      this.$emit('change-month', startDate)
    }
  },
  mounted() {
    this.$store.dispatch('monthly/' + SET_NEW_TASK_ID)
  }
}
</script>
