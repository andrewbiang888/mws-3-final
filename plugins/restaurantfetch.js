import idb from 'idb'
export default async function ({query, store}) {
  let returnedRestaurantData = null
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

  let returnData = await dbPromise.then( db => {
    let tx = db.transaction("restaurants", "readwrite")
    let dbstore = tx.objectStore("restaurants")
    return dbstore.get('all').then( async allRestaurants => {

      if (!allRestaurants) {
        /* START FETCH */
        let fetchData = await fetch(process.env.SERVERURL + 'restaurants', {method: "GET"}).then( response =>
          response.json().then( async restaurants => {
            if (restaurants.length) {
              returnedRestaurantData = await restaurants
              console.log(`%c First Fetch`, 'background: green; color: white; padding: 10px;', restaurants)
              dbPromise.then( dbb => {
                  dbb.transaction("restaurants", "readwrite").objectStore("restaurants").put({
                  id: 'all',
                  data: returnedRestaurantData
                })
              }).catch(error => {
                console.log('%c' + error, 'background: red;')
              })
              return returnedRestaurantData
              // store.dispatch('setRestaurants', returnedRestaurantData)
            } else {
              console.log('%c [PLUGIN] no length on fetch ' + error, 'background: red;')
              return ['fetch data', 'was not an array']
              // store.dispatch('setRestaurants', null)
            }
          })
        ).catch(error => {
          console.log('%c FETCH ERR' + error, 'background: red;')
        })
        console.log({fetchData})
        return fetchData
      /* END FETCH */
      } else {
        if (allRestaurants.data.length) {
          returnedRestaurantData = allRestaurants.data
          console.log({returnedRestaurantData})
          return returnedRestaurantData
          // store.dispatch('setRestaurants', returnedRestaurantData)
        } else {
          return ['existing data in db', 'is not array']
        }
      }
    })
    // return tx.complete
  }).catch( error => {
    console.log('ERROR WITH DB FETCH IN PLUGIN')
    console.log('%c' + error, 'background: red;')
  })
  store.dispatch('setRestaurants', returnData)
  store.dispatch('isLoading', false)
}
