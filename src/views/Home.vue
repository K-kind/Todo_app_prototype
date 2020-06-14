<template>
  <div class="home">
    <WorkingColumn />
    <TodayColumn />
    <DailyColumn />
  </div>
</template>

<script>
import WorkingColumn from '@/components/WorkingColumn.vue'
import TodayColumn from '@/components/TodayColumn.vue'
import DailyColumn from '@/components/DailyColumn.vue'
import { SET_NEW_TASK_ID } from '@/store/mutation-types'

export default {
  name: 'Home',
  components: {
    WorkingColumn,
    TodayColumn,
    DailyColumn
  },
  mounted() {
    this.$store.dispatch(SET_NEW_TASK_ID)
  }
}
</script>

<style scoped>
.home {
  display: flex;
}
</style>
