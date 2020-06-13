import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import {
  ADD_NEW_TASK,
  SET_NEW_TASK_ID,
  UPDATE_TASK_CONTENT,
  DELETE_TASK_BY_ID,
  UPDATE_TASK_ORDER,
  MOVE_TASK_TO_ANOTER,
  SET_CURRENT_TASK,
  UNSET_CURRENT_TASK,
  START_TASK,
  STOP_TASK,
} from './mutation-types'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tasks: [
    //   {
    //     id: 1,
    //     content: 'Vueを学ぶ',
    //     expectedTime: 30,
    //     isCompleted: false,
    //     elapsedTime: 0,
    //     startYear: 2020,
    //     startMonth: 5,
    //     startDate: 12,
    //     order: 1
    //   },
    //   {
    //     id: 2,
    //     content: 'Terraformを学ぶ',
    //     expectedTime: 20,
    //     isCompleted: false,
    //     elapsedTime: 0,
    //     startYear: 2020,
    //     startMonth: 5,
    //     startDate: 12,
    //     order: 2
    //   },
    //   {
    //     id: 3,
    //     content: 'Design patternを学ぶ',
    //     expectedTime: 10,
    //     isCompleted: false,
    //     elapsedTime: 0,
    //     startYear: 2020,
    //     startMonth: 5,
    //     startDate: 12,
    //     order: 3
    //   },
    //   {
    //     id: 4,
    //     content: 'GitHubを学ぶ',
    //     expectedTime: 10,
    //     isCompleted: false,
    //     elapsedTime: 0,
    //     startYear: 2020,
    //     startMonth: 5,
    //     startDate: 13,
    //     order: 4
    //   },
    //   {
    //     id: 5,
    //     content: 'Linuxを学ぶ',
    //     expectedTime: 10,
    //     isCompleted: false,
    //     elapsedTime: 0,
    //     startYear: 2020,
    //     startMonth: 5,
    //     startDate: 13,
    //     order: 5
    //   },
    ],
    newTaskId: 1,
    currentTaskId: null
  },
  getters: {
    dailyTasks(state) {
      return date => {
        return state.tasks.filter(task =>
          task.startYear === date.getFullYear() &&
          task.startMonth === date.getMonth() &&
          task.startDate === date.getDate() &&
          !task.isCurrent
        ).sort((a, b) => {
          if (a.order < b.order) return -1;
          if (a.order > b.order) return 1;
          return 0;
        });
      }
    },
    completedTasks(state) {
      return date => {
        return state.tasks.filter(task =>
          task.completedYear === date.getFullYear() &&
          task.completedMonth === date.getMonth() &&
          task.completedDate === date.getDate()
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
    currentTask(state) {
      return state.tasks.find(task => task.id === state.currentTaskId)
    },
    // getTaskById(state) {
    //   return  taskId => {
    //     state.tasks.find(task => task.id === taskId)
    //   }
    // }
  },
  mutations: {
    [ADD_NEW_TASK](state, payload) {
      state.tasks.push(payload)
    },
    [SET_NEW_TASK_ID](state) {
      let latestId
      if (state.tasks.length === 0) {
        latestId = 0
      } else {
        latestId = Math.max.apply(null, state.tasks.map(item => item.id))
      }
      state.newTaskId = latestId + 1
    },
    [UPDATE_TASK_CONTENT](state, payload) {
      state.tasks.map(function(task) {
        if (task.id === payload.id) {
          task.content = payload.content
          task.expectedTime = payload.expectedTime
          return task
        }
      })
    },
    // 全部taskをfilterすると時間がかかるので要改善
    [DELETE_TASK_BY_ID](state, taskId) {
      let deletedTask = state.tasks.find(task => task.id === taskId)
      state.tasks = state.tasks.filter(task => task.id !== taskId)

      if (deletedTask.isCurrent) {
        state.currentTaskId = null
      }

      state.tasks = state.tasks.map(task => {
        if (
          task.startDate === deletedTask.startDate &&
          task.startMonth === deletedTask.startMonth &&
          task.startYear === deletedTask.startYear &&
          task.order > deletedTask.order
        ) { task.order-- }
        return task
      })
    },
    [UPDATE_TASK_ORDER](state, payload) {
      let oldIndex = payload.oldIndex
      let newIndex = payload.newIndex
      if (oldIndex === newIndex) { return false }

      state.tasks = state.tasks.map(task => {
        if (
          task.startDate != payload.fromDate ||
          task.startMonth != payload.fromMonth ||
          task.startYear != payload.fromYear
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
    [MOVE_TASK_TO_ANOTER](state, payload) {
      let oldIndex = payload.oldIndex
      let newIndex = payload.newIndex

      state.tasks = state.tasks.map(task => {
        if (
          task.startDate == payload.fromDate &&
          task.startMonth == payload.fromMonth &&
          task.startYear == payload.fromYear
        ) {
          if (task.order > oldIndex) {
            task.order--
          } else if (task.order === oldIndex) {
            task.order = newIndex
            task.startDate = Number.parseInt(payload.toDate)
            task.startMonth = Number.parseInt(payload.toMonth)
            task.startYear = Number.parseInt(payload.toYear)
          }
        } else if (
          task.startDate == payload.toDate &&
          task.startMonth == payload.toMonth &&
          task.startYear == payload.toYear &&
          task.order >= newIndex
        ) {
          task.order++
        }

        return task
      })
    },
    [SET_CURRENT_TASK](state, { fromYear, fromMonth, fromDate, oldIndex }) {
      let currentTask = state.tasks.find(task =>
        task.startDate == fromDate &&
        task.startMonth == fromMonth &&
        task.startYear == fromYear &&
        task.order === oldIndex
      )
      state.currentTaskId = currentTask.id
      state.tasks = state.tasks.map(task => {
        if (
          task.startDate == fromDate &&
          task.startMonth == fromMonth &&
          task.startYear == fromYear &&
          task.order > oldIndex
        ) {
          task.order--
        } else if (task.id === currentTask.id) {
          task.isCurrent = true
        }
        return task
      })
    },
    [UNSET_CURRENT_TASK](state, { toYear, toMonth, toDate, newIndex, taskId }) {
      state.tasks = state.tasks.map(task => {
        if (
          task.startDate == toDate &&
          task.startMonth == toMonth &&
          task.startYear == toYear &&
          task.order >= newIndex
        ) { task.order++ }

        if (task.id === taskId) {
          task.isCurrent = false
          task.order = newIndex
          task.startDate = Number.parseInt(toDate)
          task.startMonth = Number.parseInt(toMonth)
          task.startYear = Number.parseInt(toYear)
        }

        return task
      })
      state.currentTaskId = null
    },
    [START_TASK](state) {
      let currentTask = state.tasks.find(task => task.id === state.currentTaskId)
      if (currentTask.onProgress) return false;

      if (currentTask.startedTime) {
        currentTask.stoppedTime = Date.now()
      } else {
        currentTask.startedTime = Date.now()
      }
      currentTask.onProgress = true
    },
    [STOP_TASK](state) {
      let currentTask = state.tasks.find(task => task.id === state.currentTaskId)
      if (!currentTask.onProgress) return false;

      currentTask.onProgress = false
      let stoppedTime = currentTask.stoppedTime
      let fromTime = stoppedTime || currentTask.startedTime
      currentTask.elapsedTime += (Date.now() - fromTime)
      currentTask.stoppedTime = Date.now()
    }
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
    [MOVE_TASK_TO_ANOTER]({ commit }, payload) {
      commit(MOVE_TASK_TO_ANOTER, payload)
    },
    [SET_CURRENT_TASK]({ commit }, payload) {
      commit(SET_CURRENT_TASK, payload)
    },
    [UNSET_CURRENT_TASK]({ commit }, payload) {
      commit(UNSET_CURRENT_TASK, payload)
    },
    [START_TASK]({ commit }, payload) {
      commit(START_TASK, payload)
    },
    [STOP_TASK]({ commit }, payload) {
      commit(STOP_TASK, payload)
    },
  },
  modules: {
  },
  plugins: [createPersistedState({
    key: 'todo',
    storage: localStorage
  })]
})
