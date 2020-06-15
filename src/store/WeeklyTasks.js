// import {
// } from './mutation-types'

export default {
  state: {
    weeklyTasks: [
      // startDate: Date,
      // content: String,
      // order: Number,
      // isChecked: Boolean
    ],
    newTaskId: 1,
  },
  getters: {
    weeklyTasks(state) {
      return date => {
        return state.weeklyTasks(task =>
          task.startDate === date
        )
      }
    }
  },
  newTaskId(state) {
    return state.newTaskId
  },
}
