import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import DailyTasks from './modules/DailyTasks'
import WeeklyTasks from './modules/WeeklyTasks'
import MonthlyTasks from './modules/MonthlyTasks'
import Auth from './modules/Auth'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    daily: DailyTasks,
    weekly: WeeklyTasks,
    monthly: MonthlyTasks,
    auth: Auth
  },
  plugins: [createPersistedState({
    key: 'todo',
    storage: localStorage
  })]
})
