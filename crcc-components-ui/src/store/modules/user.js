import {getInfo, getMainPosition } from '@/api/user'

const state = {
  userId: '',
  userProviderId: '',
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  positions: [],
  mainPosition: {}
}

const mutations = {

  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_POSITIONS: (state, positions) => {
    state.positions = positions
  },
  SET_USER_ID: (state, userId) => {
    state.userId = userId
  },
  SET_USER_PROVIDER_ID: (state, userProviderId) => {
    state.userProviderId = userProviderId
  },
  SET_USER_MAIN_POSITION: (state, mainPosition) => {
    state.mainPosition = mainPosition
  }
}

const actions = {

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const data = response
        const { roles, name, avatar, introduction, positions, id, providerId } = data

        // roles must be a non-empty array
        // if (!roles || roles.length <= 0) {
        //   reject('getInfo: roles must be a non-null array!')
        // }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        if (!avatar) {
          commit('SET_AVATAR', '')
        }
        commit('SET_INTRODUCTION', introduction)
        commit('SET_POSITIONS', positions)
        commit('SET_USER_ID', id)
        commit('SET_USER_PROVIDER_ID', providerId)

        getMainPosition(providerId, id).then(mainOrg => {
          commit('SET_USER_MAIN_POSITION', mainOrg)
        })
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

 

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
