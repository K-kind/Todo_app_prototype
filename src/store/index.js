import Vue from 'vue'
import Vuex from 'vuex'
import { ADD_NEW_TASK, SET_NEW_TASK_ID } from './mutation-types'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tasks: [
      {
        id: 0,
        content: 'Vueを学ぶ',
        expectedTime: 30,
        isCompleted: false,
        elapsedTime: 0,
        startYear: 2020,
        startMonth: 5,
        startDate: 12
      },
      {
        id: 1,
        content: 'Terraformを学ぶ',
        expectedTime: 20,
        isCompleted: false,
        elapsedTime: 0,
        startYear: 2020,
        startMonth: 5,
        startDate: 12
      },
      {
        id: 2,
        content: 'Design patternを学ぶ',
        expectedTime: 10,
        isCompleted: false,
        elapsedTime: 0,
        startYear: 2020,
        startMonth: 5,
        startDate: 12
      },
      {
        id: 3,
        content: 'GitHubを学ぶ',
        expectedTime: 10,
        isCompleted: false,
        elapsedTime: 0,
        startYear: 2020,
        startMonth: 5,
        startDate: 13
      },
      {
        id: 4,
        content: 'Linuxを学ぶ',
        expectedTime: 10,
        isCompleted: false,
        elapsedTime: 0,
        startYear: 2020,
        startMonth: 5,
        startDate: 13
      },
    ],
    newTaskId: '',
    currentTaskId: 0
  },
  getters: {
    dailyTasks(state) {
      return date => {
        return state.tasks.filter(task =>
          task.startYear === date.getFullYear() &&
          task.startMonth === date.getMonth() &&
          task.startDate === date.getDate()
        )
      }
    },
    newTaskId(state) {
      return state.newTaskId
    },
    currentTaskId(state) {
      return state.currentTaskId
    },
  },
  mutations: {
    [ADD_NEW_TASK](state, payload) {
      state.tasks.push(payload)
    },
    [SET_NEW_TASK_ID](state) {
      let latestId = Math.max.apply(null, state.tasks.map(item => item.id))
      state.newTaskId = latestId + 1
    }
  },
  actions: {
    [ADD_NEW_TASK]({ commit }, payload) {
      commit(ADD_NEW_TASK, payload)
    },
    [SET_NEW_TASK_ID]({ commit }) {
      commit(SET_NEW_TASK_ID)
    },
  },
  modules: {
  }
})
