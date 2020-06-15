<template>
  <div class="home">
    <WorkingColumn />
    <TodayColumn />
    <DailyColumn :startDate="startDate"/>
    <WeeklyColumn @change-week="changeWeek" :monthStartDate="monthStartDate"/>
    <MonthlyColumn @change-month="changeMonth"/>
  </div>
</template>

<script>
import WorkingColumn from '@/components/WorkingColumn.vue'
import TodayColumn from '@/components/TodayColumn.vue'
import DailyColumn from '@/components/DailyColumn.vue'
import WeeklyColumn from '@/components/WeeklyColumn.vue'
import MonthlyColumn from '@/components/MonthlyColumn.vue'
import { SET_NEW_TASK_ID } from '@/store/mutation-types'

export default {
  name: 'Home',
  components: {
    WorkingColumn,
    TodayColumn,
    DailyColumn,
    WeeklyColumn,
    MonthlyColumn,
  },
  data() {
    return {
      startDate: null,
      monthStartDate: null
    }
  },
  methods: {
    changeWeek(startDate) {
      this.startDate = startDate
    },
    changeMonth(startDate) {
      this.monthStartDate = startDate
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
