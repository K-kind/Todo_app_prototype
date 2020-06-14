<template>
  <div class="working-task">
    <h2>現在のタスク</h2>
    <div v-if="currentTask">
      <button @click.prevent="start" v-if="!timerId">スタート</button>
      <button @click.prevent="stop" v-else>一時停止</button>
      <span>経過時間: {{ elapsedTime }}</span>
      <button @click.prevent="complete()">完了</button>
    </div>
    <draggable tag="ul" :group="draggableGroup" @end="onDragEnd" :data-working="true" @add="onAdd" @clone="onClone">
      <li v-if="currentTask">
        <p v-if="!formIsOpen" @click="openForm()">
          {{ currentTask.order }}: ID.{{ currentTask.id }}: {{ currentTask.content }} ({{ currentTask.date }}日)
          <span>({{ toMinutes(currentTask.expectedTime) }}分)</span>
        </p>
        <TaskForm
          v-else
          :formIsOpen="true"
          :taskId="currentTask.id"
          :taskContent="currentTask.content"
          :taskExpectedTime="currentTask.expectedTime"
          :isNewTask="false"
          ref="updateForm"
          @close-form="closeForm"
          @update-task="updateTask($event, currentTask.id)"
          @delete-current-task="disableDrag(false)"
        ></TaskForm>
      </li>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapGetters, mapActions } from 'vuex'
import TaskForm from '@/components/TaskForm.vue'
import {
  UPDATE_TASK_CONTENT,
  UNSET_CURRENT_TASK,
  START_TASK,
  STOP_TASK,
  COMPLETE_TASK
} from '@/store/mutation-types'

export default {
  name: 'WorkingTask',
  data() {
    return {
      formIsOpen: false,
      timerId: null,
      elapsedTime: null,
      draggableGroup: 'TASKS'
    }
  },
  components: {
    draggable,
    TaskForm
  },
  computed: {
    ...mapGetters(['currentTask']),
  },
  methods: {
    ...mapActions([UPDATE_TASK_CONTENT, UNSET_CURRENT_TASK, START_TASK, STOP_TASK, COMPLETE_TASK]),
    toMinutes(time) {
      return Math.ceil(time / (1000 * 60))
    },
    closeForm() {
      this.formIsOpen = false
    },
    openForm() {
      let self = this
      this.formIsOpen = true
      setTimeout(() => self.$refs.updateForm.focusForm())
    },
    updateTask(e, task_id) {
      let task = Object.assign(e, {id: task_id})
      this[UPDATE_TASK_CONTENT](task)
      this.closeForm()
    },
    onDragEnd(e) {
      if (e.to.dataset.working) {
        this.disableDrag(true)
        return false
      } else if (e.to.dataset.completed) {
        this.complete(e.newIndex)
        return false
      }

      if (this.currentTask.onProgress) {
        this.stop()
      }
      let [toYear, toMonth, toDate] = e.to.dataset.date.split('-')
      let payload = {
        toYear,
        toMonth,
        toDate,
        newIndex: e.newIndex,
        taskId: this.currentTask.id
      }
      this[UNSET_CURRENT_TASK](payload)
      this.disableDrag(false)
    },
    computeElapsedTime() {
      let elapsed = this.currentTask.elapsedTime
      if (this.currentTask.onProgress) {
        let started = this.currentTask.stoppedTime || this.currentTask.startedTime
        elapsed += (Date.now() - started)
      }
      let h = Math.floor(elapsed / (1000 * 60 * 60))
      h = (h > 0) ? `${h}:` : ''
      let m = Math.floor(elapsed / (1000 * 60)) % 60
      m = (m < 10) ? `0${m}` : m
      let s = Math.floor(elapsed / 1000) % 60
      s = (s < 10) ? `0${s}` : s
      this.elapsedTime = `${h}${m}:${s}`
    },
    setTimer() {
      if (!this.currentTask.onProgress) return false;

      let self = this
      this.timerId = setInterval(() => {
        self.computeElapsedTime()
      }, 1000)
    },
    start() {
      this[START_TASK]()
      this.setTimer()
    },
    stop() {
      this[STOP_TASK]()
      clearInterval(this.timerId)
      this.timerId = null
    },
    complete(newIndex) {
      if (this.currentTask.onProgress) {
        this.stop()
      }
      let payload = { taskId: this.currentTask.id }
      if (newIndex) { Object.assign(payload, { newIndex }) }
      this[COMPLETE_TASK](payload)
      this[UNSET_CURRENT_TASK]({ taskId: this.currentTask.id })
      this.disableDrag(false)
    },
    onAdd() {
      this.disableDrag(true)
      let self = this
      setTimeout(() => { // onEndの後にするため
        self.computeElapsedTime()
        self.start()
      })
    },
    onClone() {
      this.disableDrag(false)
    },
    disableDrag(boolean) {
      let groupName = (boolean ? '' : 'TASKS')
      this.draggableGroup = groupName
    }
  },
  mounted() {
    if (!this.currentTask) return false;

    this.disableDrag(true)
    this.computeElapsedTime()
    if (this.currentTask.startedTime) {
      this.setTimer()
    }
  }
}
</script>

<style scoped>
.working-task {
  min-height: 140px;
  background-color: bisque;
  padding: 10px 12px;
  margin: 0 8px 15px;
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
h2 {
  font-size: 16px;
  margin: 0 0 6px;
  text-align: center;
}
</style>
