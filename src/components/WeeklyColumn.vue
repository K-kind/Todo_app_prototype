<template>
  <div>
    <h2>{{ weekString }}</h2>
    <WeeklyTasks />
  </div>
</template>

<script>
import WeeklyTasks from '@/components/WeeklyTasks.vue'

export default {
  name: 'WeeklyColumn',
  components: {
    WeeklyTasks
  },
  computed: {
    weekRange() {
      let today = new Date()
      let year = today.getFullYear()
      let month = today.getMonth()
      let date = today.getDate()
      let day_num = today.getDay()
      let mondayDate = date - day_num + 1
      let sundayDate = mondayDate + 6
      let monday = new Date(year, month, mondayDate)
      let sunday = new Date(year, month, sundayDate)
      return { monday, sunday }
    },
    weekString() {
      let monday = this.weekRange.monday
      let sunday = this.weekRange.sunday
      let mondayString = `${monday.getMonth() + 1}/${monday.getDate()}(月)`
      let sundayString = `${sunday.getMonth() + 1}/${sunday.getDate()}(日)`
      return `${mondayString} - ${sundayString}`
    }
  }
}
</script>
