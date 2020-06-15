<template>
  <div class="week-task-board">
    <h2>{{ weekString }}</h2>
    <draggable tag="ul" group="WEEK">
      <li v-for="task of weeklyTasks(weekRange.monday)" :key="task.id">
        <p v-if="onUpdatedTaskId !== task.id" @click="openUpdateForm(task.id)">
          {{ task.order }}: ID.{{ task.id }}: {{ task.content }}
          <span >完了({{ task.isChecked }})</span>
        </p>
        <WeeklyForm
          v-else
          :formIsOpen="true"
          :taskId="task.id"
          :taskContent="task.content"
          :isNewTask="false"
          ref="updateForm"
          @close-form="closeForm"
          @update-task="updateTask($event, task.id)"
        ></WeeklyForm>
      </li>
    </draggable>
    <a @click="openForm" v-show="!newFormIsOpen" href="Javascript:void(0)">+週目標を追加</a>
    <WeeklyForm
      :formIsOpen="newFormIsOpen"
      taskContent=""
      :isNewTask="true"
      ref="newForm"
      @close-form="closeForm"
      @add-task="addTask"
    ></WeeklyForm>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapGetters, mapActions } from 'vuex'
import WeeklyForm from '@/components/WeeklyForm.vue'
import {
  ADD_NEW_TASK,
  SET_NEW_TASK_ID,
  UPDATE_TASK_CONTENT,
  // UPDATE_TASK_ORDER,
  // COMPLETE_TASK
} from '@/store/mutation-types'

export default {
  name: 'WeeklyTask',
  components: {
    draggable,
    WeeklyForm
  },
  data() {
    return {
      newFormIsOpen: false,
      onUpdatedTaskId: null
    }
  },
  computed: {
    ...mapGetters('weekly', ['weeklyTasks', 'newTaskId']),
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
  },
  methods: {
    ...mapActions('weekly', [ADD_NEW_TASK, SET_NEW_TASK_ID,
UPDATE_TASK_CONTENT,]),
    closeForm() {
      this.newFormIsOpen = false
      let self = this
      setTimeout(() => self.onUpdatedTaskId = null)
    },
    openForm() {
      this.newFormIsOpen = true
      let self = this
      setTimeout(() => self.$refs.newForm.focusForm())
    },
    openUpdateForm(taskId) {
      this.onUpdatedTaskId = taskId
      let self = this
      setTimeout(() => self.$refs.updateForm[0].focusForm())
    },
    addTask(e) { // e: { content }
      let tasks = this.weeklyTasks(this.weekRange.monday)
      let newOrder = 0
      if (tasks.length) {
        newOrder = 1 + Math.max.apply(null,
          tasks.map(task => task.order)
        )
      }
      let newTask = {
        id: this.newTaskId,
        content: e.content,
        isChecked: false,
        startDate: this.weekRange.monday,
        order: newOrder
      }
      this[ADD_NEW_TASK](newTask)
      this[SET_NEW_TASK_ID]()
      this.$refs.newForm.focusForm()
    },
    updateTask(e, task_id) {
      let task = Object.assign(e, {id: task_id})
      this[UPDATE_TASK_CONTENT](task)
      this.closeForm()
    },
  }
}
</script>

<style scoped>
.week-task-board {
  background-color: azure;
  width: 320px;
  margin: 0 8px 15px;
  padding: 10px 12px;
}
h2 {
  text-align: center;
  margin: 0 0 6px;
  font-size: 16px;
}
ul {
  list-style-type: none;
  padding-left: 0;
}
li {
  cursor: pointer;
  border: solid #ddd 1px;
}
p {
  margin: 0;
  padding: 10px;
}
</style>