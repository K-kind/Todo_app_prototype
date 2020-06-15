<template>
  <div class="home">
    <WorkingColumn />
    <TodayColumn />
    <DailyColumn :startDate="startDate"/>
    <WeeklyColumn @change-week="changeWeek"/>
  </div>
</template>

<script>
import WorkingColumn from '@/components/WorkingColumn.vue'
import TodayColumn from '@/components/TodayColumn.vue'
import DailyColumn from '@/components/DailyColumn.vue'
import WeeklyColumn from '@/components/WeeklyColumn.vue'
import { SET_NEW_TASK_ID } from '@/store/mutation-types'

export default {
  name: 'Home',
  components: {
    WorkingColumn,
    TodayColumn,
    DailyColumn,
    WeeklyColumn
  },
  data() {
    return {
      startDate: null
    }
  },
  methods: {
    changeWeek(startDate) {
      this.startDate = startDate
    }
  },
  mounted() {
    this.$store.dispatch('daily/' + SET_NEW_TASK_ID)
  }
}
</script>

<style scoped>
.home {
  display: flex;
}
</style>
