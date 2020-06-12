<template>
  <form v-show="formIsOpen">
    <div>
      <input
        v-model="taskContentData"
        ref="contentForm"
        @blur="formBlur"
        type="text"
        id="new-content"
        placeholder="タスク内容"
      />
      <input
        v-model="taskExpectedTimeData"
        ref="timeForm"
        @blur="formBlur"
        type="number"
        id="new-expected-time"
        placeholder="予定(分)"
      />
    </div>
    <div>
      <input @click.prevent="changeTask" type="submit" :value="buttonText" ref="submitButton">
      <button v-if="!isNewTask" @click.prevent="deleteTask" ref="deleteButton">削除</button>
      <a @click="closeForm" href="Javascript:void(0)">x</a>
    </div>
  </form>
</template>

<script>
import { mapActions } from 'vuex'
import { DELETE_TASK_BY_ID } from '@/store/mutation-types'

export default {
  name: 'TaskForm',
  props: {
    formIsOpen: Boolean,
    taskId: Number,
    taskContent: String,
    taskExpectedTime: String,
    isNewTask: Boolean
  },
  data() {
    return {
      taskContentData: this.taskContent,
      taskExpectedTimeData: this.taskExpectedTime,
    }
  },
  computed: {
    buttonText() {
      if (this.isNewTask) {
        return '追加'
      } else {
        return '変更'
      }
    }
  },
  methods: {
    ...mapActions([DELETE_TASK_BY_ID]),
    formBlur() {
      let self = this
      setTimeout(() => {
        if (
          self.taskContentData === self.taskContent &&
          self.taskExpectedTimeData === self.taskExpectedTime &&
          document.activeElement !== self.$refs.timeForm &&
          document.activeElement !== self.$refs.contentForm &&
          document.activeElement !== self.$refs.submitButton &&
          document.activeElement !== self.$refs.deleteButton
          ) {
          self.$emit('close-form')
        }
      })
    },
    closeForm() {
      this.taskContentData = ''
      this.taskExpectedTimeData = ''
      this.$emit('close-form')
    },
    focusForm() {
      this.$refs.contentForm.focus()
    },
    changeTask() {
      if (!this.taskContentData) { return false }

      if (this.isNewTask) {
        this.$emit('add-task',
          {
            content: this.taskContentData,
            expectedTime: this.taskExpectedTimeData
          }
        )
        this.taskContentData = ''
        this.taskExpectedTimeData = ''
      } else {
        this.$emit('update-task',
          {
            content: this.taskContentData,
            expectedTime: this.taskExpectedTimeData
          }
        )
      }
    },
    deleteTask() {
      this[DELETE_TASK_BY_ID](this.taskId)
      console.log(this.taskId)
      this.closeForm()
    }
  }
}
</script>