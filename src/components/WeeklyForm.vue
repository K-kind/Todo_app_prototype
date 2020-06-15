<template>
  <form v-show="formIsOpen">
    <div>
      <input
        v-model="taskContentData"
        ref="contentForm"
        @blur="formBlur"
        type="text"
        id="new-content"
        placeholder="週の目標"
        autocomplete="off"
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
  name: 'WeeklyForm',
  props: {
    formIsOpen: Boolean,
    taskId: Number,
    taskContent: String,
    isNewTask: Boolean,
  },
  data() {
    return {
      taskContentData: this.taskContent
    }
  },
  computed: {
    buttonText() {
      return this.isNewTask ? '追加' : '変更'
    },
  },
  methods: {
    ...mapActions('daily', [DELETE_TASK_BY_ID]),
    formBlur() {
      let self = this
      setTimeout(() => {
        if (
          self.taskContentData === self.taskContent &&
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
      this.$emit('close-form')
    },
    focusForm() {
      this.$refs.contentForm.focus()
    },
    changeTask() {
      if (!this.taskContentData) {
        this.focusForm()
        return false
      }

      if (this.isNewTask) {
        this.$emit('add-task', { content: this.taskContentData })
        this.taskContentData = ''
      } else {
        this.$emit('update-task', { content: this.taskContentData })
      }
    },
    deleteTask() {
      this[DELETE_TASK_BY_ID](this.taskId)
      this.closeForm()
    }
  }
}
</script>
