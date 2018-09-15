import idb from 'idb'
import Vue from 'vue'

let dbPromise = idb.open('restaurant-db', 1, (upgradeDb) => {
  switch (upgradeDb.oldVersion) {
    case 0:
      upgradeDb.createObjectStore('restaurants', {keyPath: 'id'});
    case 1:
      const reviewsStore = upgradeDb.createObjectStore("reviews", {keyPath: "id"});
      reviewsStore.createIndex("restaurant_id", "restaurant_id");
    case 2:
      upgradeDb.createObjectStore("pending", {
        keyPath: "id",
        autoIncrement: true
      });
  }
}).catch(error => {
  console.log('%c' + error, 'background: red;')
})

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
    console.log({id, currentkey, newstate})
    // let index = state.restaurants.findIndex( restaurant => {
    //   return restaurant.id == id
    // })
    let newRestaurantData = state.restaurants.filter( restaurant => restaurant.id == id)[0]
    newRestaurantData[currentkey] = newstate

    let url, method, body

    if (currentkey === 'is_favorite') {
      url = `http://localhost:1337/restaurants/${id}/?is_favorite=${newstate}`
      method = 'PUT'
    }

    // if (crrentKey === '') {}

    //Check data to see if it fits expected
    if(id && currentkey && newstate != null) {
      // if passes, see if there is internet
      if (navigator.onLine) {
        // if online, save in database. if successful, save in global store.
        const properties = {
          body: JSON.stringify(body),
          method
        }
        fetch(url, properties).then( response => {
          console.log(`%c [STORE FETCH] Saving data to db 1337 ${url}`, 'background-color: green;')
          if (!response.ok && !response.redirected) {
            return;
          }
        }).then( () => {
          console.log(`%c [STORE IDB] updating idb with new data in global store`, 'background-color: green;')
          dbPromise.then( db => {
            let arr = state.restaurants.map( obj => obj.id == id ? newRestaurantData : obj)
            const tx = db.transaction("restaurants", "readwrite").objectStore("restaurants").put({
              id: 'all',
              data: arr
            })
          })
          commit('updateRestaurantData', {id, newRestaurantData})
          return
        })
      } else {
        console.log('%c [STORE WARNING] Not connected to the Internet. Saving to idb', 'background-color: yellow; padding: 5px;')
        dbPromise.then( db => {
          const tx = db.transaction("pending", "readwrite")
          tx.objectStore('pending').put({
            data: {
              url,
              method,
              body
            }
          }).then( () => {
            //TODO: Delete idb restaurant data since it is out of date and trigger reload/fetch
          }).catch( error => console.log('%c [STORE ERROR] saving to idb pending', 'background-color: red; padding: 5px;'))
        }).catch( error => console.log('%c [STORE ERROR] could not connect to idb pending', 'background-color: red; padding: 5px;'))
      }

    } else {
      console.log('%c [STORE ERROR] id, currentkey or newstate variable missing', 'background-color: red; padding: 5px;')
    }




    // commit to global store
    // if (navigator.onLine) {
    //   console.log('[STORE] online')
    //   commit('updateRestaurantData', {id, newRestaurantData})
    // } else {
    //   console.log('[STORE] not online')
    // }
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
  updateRestaurantData(state, {id, newRestaurantData}) {
    console.log('[STORE MUTATION] Updating restaurants')
    let arr = state.restaurants.map( obj => obj.id == id ? newRestaurantData : obj)
    state.restaurants = [...arr]
  }
}
