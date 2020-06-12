<template>
  <div class="home">
    <TodayColumn />
    <DailyColumn />
  </div>
</template>

<script>
import TodayColumn from '@/components/TodayColumn.vue'
import DailyColumn from '@/components/DailyColumn.vue'

export default {
  name: 'Home',
  components: {
    TodayColumn,
    DailyColumn
  },
}
</script>

<style scoped>
.home {
  display: flex;
}
</style>
