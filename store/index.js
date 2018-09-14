import idb from 'idb'
import Vue from 'vue'

export const state = () => ({
  isLoading: true,
  restaurants: null,
  page: 'index'
})
export const getters = {
  isLoading (state) {
    return state.isLoading
  },
  async restaurants (state) {
    let resp = await state.restaurants
    return resp
  },
  page (state) {
    return state.page
  }
}
export const actions = {
  async isLoading ({commit}, newstate) {
    commit('isLoading', newstate)
  },
  async setRestaurants ({commit}, existingData) {

    let restaurantData = existingData
    commit('setRestaurants', restaurantData)
  },
  async setPage ({commit}, newpage) {

    commit('setPage', newpage)
  },
  async updateRestaurantData ({commit, state}, {id, currentkey, newstate}) {
    let index = state.restaurants.findIndex( restaurant => {
      return restaurant.id == id
    })
    let newRestaurantData = state.restaurants.filter( restaurant => restaurant.id == id)[0]
    newRestaurantData[currentkey] = newstate
    // console.log({index, newRestaurantData})
    // 1) save data in pending if not connected to the internet
    if (navigator.onLine) {

      console.log('[STORE] online')
      commit('updateRestaurantData', {id, index, currentkey, newstate, newRestaurantData})
    } else {
      console.log('[STORE] not online')
    }
    // 2) undate global state object
    // 3) update in database
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
  },
  updateRestaurantData(state, {id, index, currentkey, newstate, newRestaurantData}) {
    let arr = state.restaurants.map( obj => obj.id == id ? newRestaurantData : obj)
    // console.log({arr, index, currentkey, newstate, newRestaurantData})
    // Vue.set(state, 'restaurants', arr )
    state.restaurants = [...arr]
  }
}
