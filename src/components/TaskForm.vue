<template>
  <form v-show="formIsOpen">
    <div>
      <el-input
        v-model="taskContentData"
        ref="contentForm"
        @blur="formBlur"
        type="text"
        placeholder="タスク内容"
        autocomplete="off"
        clearable
        size="small"
      />
    </div>
    <div class="time-inputs">
      <label for="" class="time-label">{{ labelText }}</label>
      <input
        v-model="taskExpectedTimeData"
        ref="timeForm"
        @blur="formBlur"
        type="number"
        class="time-input"
        :min="0"
        :max="999"
        :step="10"
      />
    </div>
    <div>
      <input @click.prevent="changeTask" type="submit" :value="buttonText" ref="submitButton">
      <button v-if="!isNewTask" @click.prevent="deleteTask" ref="deleteButton">削除</button>
      <a @click="closeForm" href="Javascript:void(0)"><i class="el-icon-close"></i></a>
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
    taskExpectedTime: Number,
    isNewTask: Boolean,
    isCompletedTask: Boolean,
  },
  data() {
    return {
      taskContentData: this.taskContent,
      taskExpectedTimeData: this.taskExpectedTime,
    }
  },
  computed: {
    buttonText() {
      return this.isNewTask ? '追加' : '変更'
    },
    labelText() {
      return this.isCompletedTask ? '経過(分):' : '予定(分):'
    }
  },
  methods: {
    ...mapActions('daily', [DELETE_TASK_BY_ID]),
    formBlur() {
      let self = this
      setTimeout(() => {
        let activeElement = document.activeElement
        if (
          self.taskContentData === self.taskContent &&
          self.taskExpectedTimeData == self.taskExpectedTime &&
          activeElement !== self.$refs.timeForm &&
          // activeElement !== self.$refs.contentForm &&
          activeElement.className !== 'el-input__inner' &&
          activeElement !== self.$refs.submitButton &&
          activeElement !== self.$refs.deleteButton
          ) {
          self.$emit('close-form')
        }
      })
    },
    closeForm() {
      this.taskContentData = ''
      this.taskExpectedTimeData = 0
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

      let timeKey = (this.isCompletedTask ? 'elapsedTime' : 'expectedTime')
      this.taskExpectedTimeData *= (1000 * 60)

      if (this.isNewTask) {
        this.$emit('add-task',
          {
            content: this.taskContentData,
            [timeKey]: this.taskExpectedTimeData
          }
        )
        this.taskContentData = ''
        this.taskExpectedTimeData = 0
      } else {
        this.$emit('update-task',
          {
            content: this.taskContentData,
            [timeKey]: this.taskExpectedTimeData
          }
        )
      }
    },
    deleteTask() {
      this[DELETE_TASK_BY_ID](this.taskId)
      this.closeForm()
      this.$emit('delete-current-task')
    }
  }
}
</script>

<style scoped>
.time-input {
  width: 55px;
  padding: 3px 0 3px 6px;
}
.time-label {
  margin-right: 6px;
}
.time-inputs {
  margin: 5px 0;
  text-align: right;
}
form {
  padding: 6px 10px;
}
</style>
