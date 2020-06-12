<template>
  <div>
    現在のタスク
    <draggable tag="ul" group="ITEMS" @end="onDragEnd" class="working-task" :data-working="true">
      <li v-if="currentTask">
        <p v-if="!formIsOpen" @click="openForm()">
          {{ currentTask.order }}: ID.{{ currentTask.id }}: {{ currentTask.content }} ({{ currentTask.startDate }}日)
          <span v-if="currentTask.expectedTime">({{ currentTask.expectedTime }}分)</span>
        </p>
        <TaskForm
          v-else
          :formIsOpen="true"
          :taskId="currentTask.id"
          :taskContent="currentTask.content"
          :taskExpectedTime="`${currentTask.expectedTime}`"
          :isNewTask="false"
          ref="updateForm"
          @close-form="closeForm"
          @update-task="updateTask($event, currentTask.id)"
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
  UNSET_CURRENT_TASK
} from '@/store/mutation-types'

export default {
  name: 'WorkingTask',
  data() {
    return {
      formIsOpen: false
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
    ...mapActions([UPDATE_TASK_CONTENT, UNSET_CURRENT_TASK]),
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
      if (e.to.dataset.working) return false
      let [toYear, toMonth, toDate] = e.to.dataset.date.split('-')
      let payload = {
        toYear,
        toMonth,
        toDate,
        newIndex: e.newIndex,
        taskId: this.currentTask.id
      }
      this[UNSET_CURRENT_TASK](payload)
    }
  }
}
</script>

<style scoped>
.working-task {
  min-height: 24px;
  background-color: bisque;
}
</style>
