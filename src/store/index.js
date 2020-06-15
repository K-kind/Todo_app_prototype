import Vue from 'vue'
import Vuex from 'vuex'
// import { } from './mutation-types'
import createPersistedState from 'vuex-persistedstate'
import DailyTasks from './DailyTasks'
import WeeklyTasks from './WeeklyTasks'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    daily: DailyTasks,
    weekly: WeeklyTasks
  },
  plugins: [createPersistedState({
    key: 'todo',
    storage: localStorage
  })]
})
