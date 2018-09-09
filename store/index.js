export const state = () => ({
  isLoading: true,
  restaurants: null,
  page: 'index'
})
export const getters = {
  isLoading (state) {
    return state.isLoading
  },
  getRestaurants (state) {
    return state.getRestaurants
  },
  getPage (state) {
    return state.getPage
  }
}
export const actions = {
  async isLoading ({commit}, newstate) {
    commit('isLoading', newstate)
  },
  async setRestaurants ({commit}, existingData) {
    // compare data or just fetch new stuff? idk
    let restaurantData = existingData
    commit('setRestaurants', restaurantData)
  },
  async setPage ({commit}, newpage) {
    // compare data or just fetch new stuff? idk
    commit('setPage', newpage)
  }
}
export const mutations = {
  isLoading(state, newstate) {
    state.isLoading = newstate
  },
  setRestaurants(state, restaurantData) {
    state.restaurants = restaurantData
  },
  setPage(state, newpage) {
    state.page = newpage
  }
}
