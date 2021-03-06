import {
  REQUEST,
  POST,
  DELETE,
  CREATE
} from '../mutation-types'
import axios from 'axios'

export default {
  namespaced: true,
  actions: {
    async [REQUEST] ({ dispatch, rootState }, { method, url, data, error }) {
      const headers = {}
      headers['Content-Type'] = 'application/json'
      headers['Access-Control-Allow-Origin'] = '*' // 開発のみ
      // headers['Access-Control-Allow-Origin'] = 'localhost:3000' // 開発のみ
      if (rootState.auth.token) {
        headers['Authorization'] = `Token ${rootState.auth.token}`
        headers['User-Id'] = rootState.auth.userId // なくて良い
      }

      const options = {
        method,
        url: `http://localhost:3000${url}`,
        // url: `${process.env.API_URL}${url}`,
        headers,
        data,
        timeout: 15000
      }

      return axios(options)
        .then(res => res)
        .catch(err => {
          dispatch(
            'message/' + CREATE,
            { error: error, err },
            { root: true }
          )
        })
    },
    async [POST] ({ dispatch }, requests) {
      requests.method = 'post'
      return dispatch(REQUEST, requests)
    },
    async [DELETE] ({ dispatch }, requests) {
      requests.method = 'delete'
      return dispatch('request', requests)
    }
  }
}
