<template>
  <div class="archives">
    <ThisWeekColumn />
    <!-- <LastWeekColumn :startDate="weekStartDate" />
    <WeeklyColumn @change-week="changeWeek" :monthStartDate="monthStartDate" />
    <MonthlyColumn @change-month="changeMonth" :weekStartDate="weekStartDate" /> -->
  </div>
</template>

<script>
import ThisWeekColumn from '@/components/archives/ThisWeekColumn.vue'
// import LastWeekColumn from '@/components/archives/LastWeekColumn.vue'
// import WeeklyColumn from '@/components/archives/WeeklyColumn.vue'
// import MonthlyColumn from '@/components/archives/MonthlyColumn.vue'
import { SET_NEW_TASK_ID } from '@/store/mutation-types'

export default {
  name: 'Archives',
  components: {
    ThisWeekColumn,
    // LastWeekColumn,
    // WeeklyColumn,
    // MonthlyColumn,
  },
  data() {
    return {
      // weekStartDate: null,
      // monthStartDate: null
    }
  },
  methods: {
    changeWeek(startDate) {
      this.weekStartDate = startDate
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
.archives {
  display: flex;
}
</style>
