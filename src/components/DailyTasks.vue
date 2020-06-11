<template>
  <div class="task-board">
    <h2>{{ dateString }}のタスク</h2>
    <draggable tag="ul" group="ITEMS">
      <li v-for="task of dailyTasks(date)" :key="task.id">
        <p v-if="onUpdatedTaskId !== task.id" @click="openUpdateForm(task.id)">
          ID.{{ task.id }}: {{ task.content }}
          <span v-if="task.expectedTime">({{ task.expectedTime }}分)</span>
        </p>
        <form v-else>
          <div>
            <input
              v-model="OnUpdatedTaskContent"
              ref="content_field"
              @blur="formBlur"
              type="text"
              id="new-content"
              placeholder="タスク内容"
            />
            <input
              v-model="onUpdatedTaskExpectedTime"
              @blur="formBlur"
              type="number"
              id="new-expected-time"
              placeholder="予定(分)"
            />
          </div>
          <div>
            <input @click.prevent="addTask" type="submit" value="追加">
            <a @click="toggleForm" href="Javascript:void(0)">x</a>
          </div>
        </form>
      </li>
    </draggable>
    <a @click="openForm" v-show="!formIsOpen" href="Javascript:void(0)">+タスクを追加</a>
    <form v-show="formIsOpen">
      <div>
        <input
          v-model="newTaskContent"
          ref="content_field"
          @blur="formBlur"
          type="text"
          id="new-content"
          placeholder="タスク内容"
        />
        <input
          v-model="newTaskExpectedTime"
          @blur="formBlur"
          type="number"
          id="new-expected-time"
          placeholder="予定(分)"
        />
      </div>
      <div>
        <input @click.prevent="addTask" type="submit" value="追加">
        <a @click="toggleForm" href="Javascript:void(0)">x</a>
      </div>
    </form>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapGetters, mapActions } from 'vuex'
import { ADD_NEW_TASK, SET_NEW_TASK_ID, UPDATE_TASK_CONTENT } from '@/store/mutation-types'

export default {
  name: 'DailyTasks',
  data() {
    return {
      formIsOpen: false,
      newTaskContent: '',
      newTaskExpectedTime: '',
      onUpdatedTaskId: ''
    }
  },
  props: {
    date: Date
  },
  components: {
    draggable
  },
  computed: {
    ...mapGetters(['dailyTasks', 'newTaskId']),
    dateString() {
      let weekDay = ["日", "月", "火", "水", "木", "金", "土"]
      let month =  this.date.getMonth() + 1
      let date =  this.date.getDate()
      let day = weekDay[this.date.getDay()]
      return `${month}/${date}(${day})`
    }
  },
  methods: {
    ...mapActions([ADD_NEW_TASK, SET_NEW_TASK_ID, UPDATE_TASK_CONTENT]),
    toggleForm() {
      this.formIsOpen = !this.formIsOpen
    },
    openForm() {
      this.formIsOpen = true
      let self = this
      setTimeout(() => { self.$refs.content_field.focus() }, 0)
    },
    formBlur() {
      if (!this.newTaskContent && !this.newTaskExpectedTime) {
        this.formIsOpen = false
      }
    },
    addTask() {
      if (this.newTaskContent) {
        let newTask = {
          id: this.newTaskId,
          content: this.newTaskContent,
          expectedTime: this.newTaskExpectedTime,
          isCompleted: false,
          elapsedTime: 0,
          startYear: this.date.getFullYear(),
          startMonth: this.date.getMonth(),
          startDate: this.date.getDate()
        }
        this[ADD_NEW_TASK](newTask)
        this[SET_NEW_TASK_ID]()
        this.newTaskContent = ''
        this.newTaskExpectedTime = ''
        this.$refs.content_field.focus()
      }
    },
    openUpdateForm(taskId) {
      this.onUpdatedTaskId = taskId
    },
    updateTask() {
      this[UPDATE_TASK_CONTENT]()
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
  padding: 10px;
  border: solid #ddd 1px;
}
p {
  margin: 5px 0;
}
</style>