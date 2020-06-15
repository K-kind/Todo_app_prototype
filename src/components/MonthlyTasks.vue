<template>
  <div class="month-task-board">
    <div class="month-task-buttons">
      <a v-if="monthsFromToday !== 0" href="Javascript:void(0)" @click="monthFoward(false)">&lt;</a>
      <span class="this-month"><h2>{{ monthString }}</h2></span>
      <a href="Javascript:void(0)" @click="monthFoward(true)">&gt;</a>
    </div>
    <draggable tag="ul" group="MONTH" @end="onDragEnd">
      <li v-for="task of monthlyTasks(startDate)" :key="task.id">
        <input type="checkbox" v-model="task.isChecked" @change="checkTask(task)"/>
        <p v-if="onUpdatedTaskId !== task.id" @click="openUpdateForm(task.id)">
          {{ task.order }}: ID.{{ task.id }}: {{ task.content }}
          <span >完了({{ task.isChecked }})</span>
        </p>
        <LongTermForm
          v-else
          :formIsOpen="true"
          :taskId="task.id"
          :taskContent="task.content"
          :isNewTask="false"
          ref="updateForm"
          @close-form="closeForm"
          @update-task="updateTask($event, task.id)"
          @delete-task="deleteTask"
        ></LongTermForm>
      </li>
    </draggable>
    <a @click="openForm" v-show="!newFormIsOpen" href="Javascript:void(0)">+月目標を追加</a>
    <LongTermForm
      :formIsOpen="newFormIsOpen"
      taskContent=""
      :isNewTask="true"
      ref="newForm"
      @close-form="closeForm"
      @add-task="addTask"
    ></LongTermForm>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapGetters, mapActions } from 'vuex'
import LongTermForm from '@/components/LongTermForm.vue'
import {
  ADD_NEW_TASK,
  SET_NEW_TASK_ID,
  UPDATE_TASK_CONTENT,
  DELETE_TASK_BY_ID,
  COMPLETE_TASK,
  UPDATE_TASK_ORDER,
} from '@/store/mutation-types'

export default {
  name: 'MonthlyTask',
  components: {
    draggable,
    LongTermForm
  },
  data() {
    return {
      newFormIsOpen: false,
      onUpdatedTaskId: null,
      monthsFromToday: 0
    }
  },
  props: {
    weekStartDate: Date
  },
  computed: {
    ...mapGetters('monthly', ['monthlyTasks', 'newTaskId']),
    startDate() {
      let today = new Date()
      let year = today.getFullYear()
      let month = today.getMonth() + this.monthsFromToday
      return new Date(year, month, 1)
    },
    monthString() {
      let month = this.startDate.getMonth() + 1
      return `${month}月`
    }
  },
  methods: {
    ...mapActions('monthly', [ADD_NEW_TASK, SET_NEW_TASK_ID,
UPDATE_TASK_CONTENT, DELETE_TASK_BY_ID, COMPLETE_TASK, UPDATE_TASK_ORDER]),
    monthFoward(toFoward) {
      if (toFoward) {
        this.monthsFromToday++
      } else {
        this.monthsFromToday--
      }
      let startDate = (this.monthsFromToday === 0 ? null : this.startDate)
      this.$emit('change-month', startDate)
    },
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
      let tasks = this.monthlyTasks(this.startDate)
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
        startDate: this.startDate.toISOString(), // vuexpersistedの自動変換に合わせる
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
    deleteTask(taskId) {
      this[DELETE_TASK_BY_ID](taskId)
    },
    checkTask(task) {
      this[COMPLETE_TASK]({ taskId: task.id, taskIsChecked: task.isChecked })
    },
    onDragEnd(e) {
      if (e.oldIndex === e.newIndex) { return false }

      let payload = {
        oldIndex: e.oldIndex,
        newIndex: e.newIndex,
        startDate: this.startDate.toISOString()
      }
      this[UPDATE_TASK_ORDER](payload)
    }
  },
  watch: {
    weekStartDate(firstDate) {
      if (firstDate) {
        let year = firstDate.getFullYear()
        let month = firstDate.getMonth()
        let date = firstDate.getDate()
        let day_num = firstDate.getDay()
        let sundayDate = date - day_num + 7
        let sunday = new Date(year, month, sundayDate)
        // this.daysFromToday += (sunday - this.weekRange.sunday) / (1000 * 60 * 60 * 24)
        let gap = sunday.getMonth() - this.startDate.getMonth()
        if (gap === 1 || gap === -11) {
          this.monthsFromToday++
        } else if (gap === -1 || gap === 11) {
          this.monthsFromToday--
        }
      } else {
        this.monthsFromToday = 0
      }
    }
  }
}
</script>

<style scoped>
.month-task-board {
  background-color: azure;
  width: 320px;
  margin: 0 8px 15px;
  padding: 10px 12px;
}
.month-task-buttons {
  text-align: center;
}
.this-month {
  padding: 0 10px;
}
h2 {
  display: inline-block;
  margin: 0;
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
  display: inline-block;
}
</style>
