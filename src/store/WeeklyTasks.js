import {
  ADD_NEW_TASK,
  SET_NEW_TASK_ID,
  UPDATE_TASK_CONTENT,
  DELETE_TASK_BY_ID,
  UPDATE_TASK_ORDER
} from './mutation-types'

export default {
  namespaced: true,
  state: {
    tasks: [
      // id: Number,
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
        return state.tasks.filter(task =>
          task.startDate === date.toISOString()
        ).sort((a, b) => {
          if (a.order < b.order) return -1;
          if (a.order > b.order) return 1;
          return 0;
        });
      }
    },
    newTaskId(state) {
      return state.newTaskId
    },
  },
  mutations: {
    [ADD_NEW_TASK](state, payload) {
      state.tasks.push(payload)
    },
    [SET_NEW_TASK_ID](state) {
      let latestId = 0
      if (state.tasks.length) {
        latestId = Math.max.apply(null, state.tasks.map(task => task.id))
      }
      state.newTaskId = latestId + 1
    },
    [UPDATE_TASK_CONTENT](state, payload) { // { content, id }
      let updatedTask = state.tasks.find(task => task.id === payload.id)
      updatedTask.content = payload.content
    },
    // 全部taskをfilterすると時間がかかるので要改善
    [DELETE_TASK_BY_ID](state, taskId) {
      let deletedTask = state.tasks.find(task => task.id === taskId)
      state.tasks = state.tasks.filter(task => task.id !== taskId)

      if (deletedTask.isCurrent) {
        state.currentTaskId = null
        return false
      }

      state.tasks = state.tasks.map(task => {
        if (
          task.date === deletedTask.date &&
          task.month === deletedTask.month &&
          task.year === deletedTask.year &&
          task.order > deletedTask.order &&
          task.isCompleted === deletedTask.isCompleted
        ) { task.order-- }

        return task
      })
    },
    [UPDATE_TASK_ORDER](state, {
      oldIndex, newIndex, fromDate, fromMonth, fromYear, fromCompleted
    }) {
      state.tasks = state.tasks.map(task => {
        if (
          task.date != fromDate ||
          task.month != fromMonth ||
          task.year != fromYear ||
          task.isCompleted !== fromCompleted
        ) { return task }

        if (oldIndex < newIndex && task.order > oldIndex && task.order <= newIndex) { // 下げた時
          task.order--
        } else if (oldIndex > newIndex && task.order >= newIndex && task.order < oldIndex) { // 上げた時
          task.order++
        } else if (task.order === oldIndex) { // 移動主
          task.order = newIndex
        }
        return task
      })
    },
  },
  actions: {
    [ADD_NEW_TASK]({ commit }, payload) {
      commit(ADD_NEW_TASK, payload)
    },
    [SET_NEW_TASK_ID]({ commit }) {
      commit(SET_NEW_TASK_ID)
    },
    [UPDATE_TASK_CONTENT]({ commit }, payload) {
      commit(UPDATE_TASK_CONTENT, payload)
    },
    [DELETE_TASK_BY_ID]({ commit }, payload) {
      commit(DELETE_TASK_BY_ID, payload)
    },
    [UPDATE_TASK_ORDER]({ commit }, payload) {
      commit(UPDATE_TASK_ORDER, payload)
    },
  }
}
