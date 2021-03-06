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
    console.log('Setting Restaurant Data from Vue Action', existingData, restaurantData)
    commit('setRestaurants', restaurantData)
  },
  async setPage ({commit}, newpage) {

    commit('setPage', newpage)
  },
  async setRestaurantReviews ({commit, state}, {id, currentkey, reviews}) {
    let prevRestaurants = state.restaurants;
    let arr = await dbPromise.then( async db => {

      return db.transaction("pending", "readwrite").objectStore("pending").getAll().then( async pendingItems => {
        let newReviews = await reviews
        pendingItems.forEach( pendingItem => {
          if (pendingItem.data.body != undefined) {
            console.log('Pushing to reviews', pendingItem.data.body, newReviews)
            newReviews.push(pendingItem.data.body)
          } else if (pendingItem.data.body === undefined && pendingItem.data.method === 'PUT') {
            let idd = pendingItem.data.url.split('?')[0].split('restaurants/')[1]
            idd = parseInt(idd)
            let isFav = pendingItem.data.url.split('?')[1].split('=')[1]
            prevRestaurants.find( restaurant => restaurant.id === idd ? restaurant.is_favorite = isFav : null  )
            console.log('yep, right here. It\'s a like', idd, isFav)
          } else {
            console.log('not doing it')
          }
        })
        return newReviews
      })
    }).then( async data => {
      console.log({data})
      return await prevRestaurants.map( obj => {
        if (obj.id == id) {
          obj.reviews = data
        }
        return obj
      })
    })

    // let arr2 = state.restaurants.map( obj => {
    //   if (obj.id == id) {
    //     obj.reviews = reviews
    //   }
    //   return obj
    // })
    dbPromise.then( db => {
      console.log('saving to idb', {arr})
      const tx = db.transaction("restaurants", "readwrite").objectStore("restaurants").put({
        id: 'all',
        data: arr
      })
    })
    commit('setRestaurantReviews', arr)
  },
  async updateRestaurantData ({commit, state}, {id, currentkey, newstate}) {
    console.log({id, currentkey, newstate})
    // let index = state.restaurants.findIndex( restaurant => {
    //   return restaurant.id == id
    // })


    let url, method, body, newRestaurantData

    if (currentkey === 'is_favorite') {
      url = `http://localhost:1337/restaurants/${id}/?is_favorite=${newstate}`
      method = 'PUT'
      newRestaurantData = state.restaurants.filter( restaurant => restaurant.id == id)[0]
      newRestaurantData[currentkey] = newstate
    } else if (currentkey === 'reviews') {
      url = `http://localhost:1337/reviews`
      method = 'POST'
      body = {...newstate}
      newRestaurantData = state.restaurants.filter( restaurant => restaurant.id == id)[0]
      Array.isArray(newRestaurantData[currentkey]) ? console.log('Reviews exist!') : newRestaurantData[currentkey] = []
      newRestaurantData[currentkey].push({
        name: newstate.name,
        restaurant_id: id,
        rating: newstate.rating,
        comments: newstate.comments,
        createdAt: newstate.createdAt
      })
      console.log({newRestaurantData})
    }

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
          // if (currentkey === 'is_favorite') {
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
          // } else if (currentkey === 'reviews') {

          // }
        })
      } else {
        // if (currentkey === 'is_favorite') {
          console.log('%c [STORE WARNING] Not connected to the Internet. Saving to idb', 'background-color: yellow; padding: 5px;')
          dbPromise.then( db => {
            const tx = db.transaction("pending", "readwrite").objectStore('pending')
            tx.put({
              data: {
                url,
                method,
                body
              }
            }).then( () => {
              //TODO: update global state
              console.log('%c [STORE WARNING] Data saved in pending', 'background-color: yellow; padding: 5px;', {newRestaurantData})
              commit('updateRestaurantData', {id, newRestaurantData})
              return
            }).catch( error => console.log('%c [STORE ERROR] saving to idb pending', 'background-color: red; padding: 5px;'))
          }).catch( error => console.log('%c [STORE ERROR] could not connect to idb pending', 'background-color: red; padding: 5px;'))
        // } else if (currentkey === 'reviews') {

        // }
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
  setRestaurantReviews(state, arr) {
    state.restaurants = [...arr]
  },
  updateRestaurantData(state, {id, newRestaurantData}) {
    console.log('[STORE MUTATION] Updating restaurants')
    let arr = state.restaurants.map( obj => obj.id == id ? newRestaurantData : obj)
    state.restaurants = [...arr]
  }
}


//helper functions

function todaysDate (d) {
  let monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  d = new Date(d)
  let day = d.getDate()
  let year = d.getFullYear()
  return monthNames[d.getMonth()] + ' ' + day + ', ' + year
}
