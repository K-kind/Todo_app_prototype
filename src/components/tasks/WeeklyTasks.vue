<template>
  <div class="task-board">
    <div class="task-board__header">
      <a v-if="daysFromToday !== 0 || isArchive" href="Javascript:void(0)" @click="weekFoward(false)"><i class="el-icon-caret-left"></i></a>
      <span class="this-week"><h2 class="task-board__heading">{{ weekString }}</h2></span>
      <a v-if="daysFromToday !== 0 || !isArchive" href="Javascript:void(0)" @click="weekFoward(true)"><i class="el-icon-caret-right"></i></a>
    </div>
    <draggable tag="ul" group="WEEK" @end="onDragEnd" draggable=".draggable">
      <li v-for="task of weeklyTasks(weekRange.monday)" :key="task.id"  class="task-board__li" :class="{ draggable: !onUpdatedTaskId }">
        <div v-if="onUpdatedTaskId !== task.id" class="task-board__task">
          <input type="checkbox" v-model="task.isChecked" @change="checkTask(task)" />
          <p class="task-board__p" @click="openUpdateForm(task.id)">
            {{ task.order }}: ID.{{ task.id }}: {{ task.content }}
            <span >完了({{ task.isChecked }})</span>
          </p>
        </div>
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
    <a @click="openForm" v-show="!newFormIsOpen" href="Javascript:void(0)" class="task-board__add">+週目標を追加</a>
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
  name: 'WeeklyTask',
  components: {
    draggable,
    LongTermForm
  },
  data() {
    return {
      newFormIsOpen: false,
      onUpdatedTaskId: null,
      daysFromToday: 0,
    }
  },
  props: {
    monthStartDate: Date,
    isArchive: Boolean
  },
  computed: {
    ...mapGetters('weekly', ['weeklyTasks', 'newTaskId']),
    weekRange() {
      let today = new Date()
      let year = today.getFullYear()
      let month = today.getMonth()
      let date = today.getDate() + this.daysFromToday
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
UPDATE_TASK_CONTENT, DELETE_TASK_BY_ID, COMPLETE_TASK, UPDATE_TASK_ORDER]),
    weekFoward(toFoward) {
      if (toFoward) {
        this.daysFromToday += 7
      } else {
        this.daysFromToday -= 7
      }
      let startDate = (this.daysFromToday === 0 ? null : this.weekRange.monday)
      this.$emit('change-week', startDate)
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
      let tasks = this.weeklyTasks(this.weekRange.monday)
      let newOrder = tasks.length
      let newTask = {
        id: this.newTaskId,
        content: e.content,
        isChecked: false,
        startDate: this.weekRange.monday.toISOString(), // vuexpersistedの自動変換に合わせる
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
        startDate: this.weekRange.monday.toISOString()
      }
      this[UPDATE_TASK_ORDER](payload)
    }
  },
  watch: {
    monthStartDate(firstDate) {
      if (firstDate) {
        let year = firstDate.getFullYear()
        let month = firstDate.getMonth()
        let date = firstDate.getDate()
        let day_num = firstDate.getDay()
        let sundayDate = date - day_num + 7
        let sunday = new Date(year, month, sundayDate)
        this.daysFromToday += (sunday - this.weekRange.sunday) / (1000 * 60 * 60 * 24)
      } else {
        this.daysFromToday = 0
      }
      let startDate = (this.daysFromToday === 0 ? null : this.weekRange.monday)
      this.$emit('change-week', startDate)
    }
  }
}
</script>

<style scoped>
.task-board {
  background-color: rgb(242, 255, 240);
}
.task-board__header {
  display: block;
  text-align: center;
}
.this-week {
  padding: 0 10px;
}
h2 {
  display: inline-block;
}
.task-board__task {
  display: flex;
  align-items: center;
}
.task-board__p {
  margin-left: 10px;
  width: 100%;
}
</style>
