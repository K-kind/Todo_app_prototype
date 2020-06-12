<template>
  <div class="task-board">
    <h2>{{ dateString }}のタスク</h2>
    <draggable tag="ul" group="ITEMS" @end="onDragEnd" :data-date="separatedDate">
      <li v-for="task of dailyTasks(date)" :key="task.id">
        <p v-if="onUpdatedTaskId !== task.id" @click="openUpdateForm(task.id)">
          {{ task.order }}: ID.{{ task.id }}: {{ task.content }} ({{ task.startDate }}日)
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
import {
  ADD_NEW_TASK,
  SET_NEW_TASK_ID,
  UPDATE_TASK_CONTENT,
  UPDATE_TASK_ORDER,
  MOVE_TASK_TO_ANOTER
} from '@/store/mutation-types'

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
    },
    separatedDate() {
      let year = this.date.getFullYear()
      let month = this.date.getMonth()
      let date = this.date.getDate()
      return `${year}-${month}-${date}`
    }
  },
  methods: {
    ...mapActions([ADD_NEW_TASK, SET_NEW_TASK_ID, UPDATE_TASK_CONTENT, UPDATE_TASK_ORDER, MOVE_TASK_TO_ANOTER]),
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
      let tasks = this.dailyTasks(this.date)
      let newOrder
      if (tasks.length === 0) {
        newOrder = 0
      } else {
        newOrder = 1 + Math.max.apply(null,
          tasks.map(task => task.order)
        )
      }
      let newTask = {
        id: this.newTaskId,
        content: e.content,
        expectedTime: e.expectedTime,
        isCompleted: false,
        elapsedTime: 0,
        startYear: this.date.getFullYear(),
        startMonth: this.date.getMonth(),
        startDate: this.date.getDate(),
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
    onDragEnd(e) {
      let fromDateString = e.from.dataset.date
      let toDateString = e.to.dataset.date
      let [fromYear, fromMonth, fromDate] = fromDateString.split('-')
      if (fromDateString === toDateString) {
        let payload = {
          fromYear,
          fromMonth,
          fromDate,
          oldIndex: e.oldIndex,
          newIndex: e.newIndex,
        }
        this[UPDATE_TASK_ORDER](payload)
      } else {
        let [toYear, toMonth, toDate] = toDateString.split('-')
        let payload = {
          fromYear,
          fromMonth,
          fromDate,
          toYear,
          toMonth,
          toDate,
          oldIndex: e.oldIndex,
          newIndex: e.newIndex,
        }
        this[MOVE_TASK_TO_ANOTER](payload)
      }
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