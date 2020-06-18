<template>
  <div class="task-board">
    <div class="task-board__header">
      <h2 class="task-board__heading">前日の未消化タスク</h2>
      <span v-if="totalTime">{{ totalTime }}</span>
    </div>
    <draggable tag="ul" group="TASKS" @end="onDragEnd" draggable=".draggable">
      <li v-for="task of remainingTasks" :key="task.id" class="task-board__li" :class="{ draggable: !onUpdatedTaskId }">
        <div v-if="onUpdatedTaskId !== task.id" @click="openUpdateForm(task.id)" class="task-board__task">
          <p class="task-board__p">
            <!-- {{ task.content }} -->
            {{ task.order }}: ID.{{ task.id }}: {{ task.content }} ({{ task.date }}日)
            <span class="task-board__time">{{ toMinutes(task.expectedTime) }}分</span>
          </p>
        </div>
        <TaskForm
          v-else
          :formIsOpen="true"
          :taskId="task.id"
          :taskContent="task.content"
          :taskExpectedTime="toMinutes(task.expectedTime)"
          :isNewTask="false"
          ref="updateForm"
          @close-form="closeForm"
          @update-task="updateTask($event, task.id)"
        ></TaskForm>
      </li>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapActions } from 'vuex'
import TaskForm from '@/components/TaskForm.vue'
import {
  UPDATE_TASK_CONTENT,
  UPDATE_TASK_ORDER,
  MOVE_TASK_TO_ANOTHER,
  MOVE_TASK_TO_COMPLETED,
  SET_CURRENT_TASK,
  COMPLETE_TASK
} from '@/store/mutation-types'

export default {
  name: 'DailyTasks',
  props: {
    remainingTasks: Array
  },
  data() {
    return {
      onUpdatedTaskId: ''
    }
  },
  components: {
    draggable,
    TaskForm
  },
  computed: {
    totalTime() {
      let times = this.remainingTasks.map(task => task.expectedTime)
      if (!times.length) return null;
      let total = times.reduce((prev, current) => prev + current)
      let m = this.toMinutes(total)
      let h = Math.floor(m / 60)
      m -= h * 60
      let hString = h ? `${h}時間` : ''
      return `${hString}${m}分`
    }
  },
  methods: {
    ...mapActions('daily', [UPDATE_TASK_CONTENT, UPDATE_TASK_ORDER, MOVE_TASK_TO_ANOTHER, MOVE_TASK_TO_COMPLETED, SET_CURRENT_TASK, COMPLETE_TASK]),
    toMinutes(time) {
      return Math.ceil(time / (1000 * 60))
    },
    // taskTimes(task) {
    //   let elapsed = task.elapsedTime
    //   let elapsedString = (elapsed ? `${this.toMinutes(elapsed)}/` : '')
    //   return `${elapsedString}${this.toMinutes(task.expectedTime)}`
    // },
    closeForm() {
      let self = this
      setTimeout(() => self.onUpdatedTaskId = '')
    },
    openForm() {
      let self = this
      setTimeout(() => self.$refs.newForm.focusForm())
    },
    openUpdateForm(taskId) {
      this.onUpdatedTaskId = taskId
      let self = this
      setTimeout(() => self.$refs.updateForm[0].focusForm())
    },
    updateTask(e, task_id) {
      let task = Object.assign(e, {id: task_id})
      this[UPDATE_TASK_CONTENT](task)
      this.closeForm()
    },
    onDragEnd(e) {
      let fromDateString = e.from.dataset.date
      let toDateString = e.to.dataset.date
      let [fromYear, fromMonth, fromDate] = fromDateString.split('-')
      let payload = {
        fromYear,
        fromMonth,
        fromDate,
        oldIndex: e.oldIndex,
        newIndex: e.newIndex,
        fromCompleted: false
      }

      if (e.to.dataset.completed) {
        let movedTask = this.getTaskByDate({
          order: e.oldIndex,
          date: fromDate,
          month: fromMonth,
          year: fromYear,
          isCompleted: false
        })
        this[MOVE_TASK_TO_COMPLETED](payload)
        this[COMPLETE_TASK]({ taskId: movedTask.id, newIndex: e.newIndex })
      } else if (e.to.dataset.working) {
        this[SET_CURRENT_TASK](payload)
      } else if (fromDateString === toDateString) {
        if (e.oldIndex === e.newIndex) { return false }
        this[UPDATE_TASK_ORDER](payload)
      } else {
        let [toYear, toMonth, toDate] = toDateString.split('-')
        Object.assign(payload, { toYear, toMonth, toDate })
        this[MOVE_TASK_TO_ANOTHER](payload)
      }
    }
  }
}
</script>

<style scoped>

</style>
