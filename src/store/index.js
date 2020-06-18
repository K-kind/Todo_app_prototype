import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import DailyTasks from './DailyTasks'
import WeeklyTasks from './WeeklyTasks'
import MonthlyTasks from './MonthlyTasks'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    daily: DailyTasks,
    weekly: WeeklyTasks,
    monthly: MonthlyTasks,
  },
  plugins: [createPersistedState({
    key: 'todo',
    storage: localStorage
  })]
})
