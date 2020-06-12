<template>
  <div class="task-board">
    <h2>{{ dateString }}のタスク</h2>
    <draggable tag="ul" group="ITEMS">
      <li v-for="task of dailyTasks(date)" :key="task.id">
        <p v-if="onUpdatedTaskId !== task.id" @click="openUpdateForm(task.id)">
          ID.{{ task.id }}: {{ task.content }}
          <span v-if="task.expectedTime">({{ task.expectedTime }}分)</span>
        </p>
        <TaskForm
          v-else
          :formIsOpen="true"
          :taskId="task.id"
          :taskContent="task.content"
          :taskExpectedTime="`${task.expectedTime}`"
          :isNewTask="false"
          ref="updateForm"
          @close-form="closeForm"
          @update-task="updateTask($event, task.id)"
        ></TaskForm>
      </li>
    </draggable>
    <a @click="openForm" v-show="!newFormIsOpen" href="Javascript:void(0)">+タスクを追加</a>
    <TaskForm
      :formIsOpen="newFormIsOpen"
      taskContent=""
      taskExpectedTime=""
      :isNewTask="true"
      ref="newForm"
      @close-form="closeForm"
      @add-task="addTask"
    ></TaskForm>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapGetters, mapActions } from 'vuex'
import TaskForm from '@/components/TaskForm.vue'
import { ADD_NEW_TASK, SET_NEW_TASK_ID, UPDATE_TASK_CONTENT } from '@/store/mutation-types'

export default {
  name: 'DailyTasks',
  data() {
    return {
      newFormIsOpen: false,
      onUpdatedTaskId: ''
    }
  },
  props: {
    date: Date
  },
  components: {
    draggable,
    TaskForm
  },
  computed: {
    ...mapGetters(['dailyTasks', 'newTaskId']),
    dateString() {
      let weekDay = ['日', '月', '火', '水', '木', '金', '土']
      let month =  this.date.getMonth() + 1
      let date =  this.date.getDate()
      let day = weekDay[this.date.getDay()]
      return `${month}/${date}(${day})`
    }
  },
  methods: {
    ...mapActions([ADD_NEW_TASK, SET_NEW_TASK_ID, UPDATE_TASK_CONTENT]),
    closeForm() {
      this.newFormIsOpen = false
      let self = this
      setTimeout(() => self.onUpdatedTaskId = '')
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
    addTask(e) {
      let newTask = {
        id: this.newTaskId,
        content: e.content,
        expectedTime: e.expectedTime,
        isCompleted: false,
        elapsedTime: 0,
        startYear: this.date.getFullYear(),
        startMonth: this.date.getMonth(),
        startDate: this.date.getDate()
      }
      this[ADD_NEW_TASK](newTask)
      this[SET_NEW_TASK_ID]()
      this.$refs.newForm.focusForm()
    },
    updateTask(e, task_id) {
      let task = Object.assign(e, {id: task_id})
      this[UPDATE_TASK_CONTENT](task)
      this.closeForm()
    }
  },
  mounted() {
    this[SET_NEW_TASK_ID]()
  }
}
</script>

<style scoped>
.task-board {
  background-color: azure;
  width: 320px;
  margin: 0 8px;
  padding: 0 12px 8px;
}
h2 {
  text-align: center;
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