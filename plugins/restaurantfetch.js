import idb from 'idb'
export default function ({query, store}) {
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
  dbPromise.then( db => {
    let tx = db.transaction("restaurants", "readwrite")
    let dbstore = tx.objectStore("restaurants")
    dbstore.get('all').then( allRestaurants => {
      if (!allRestaurants) {
        fetch(process.env.SERVERURL+ 'restaurants', {method: "GET"}).then( response => {
          response.json().then( restaurants => {
            if (restaurants.length) {
              // Get all neighborhoods from all restaurants
              // const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
              // Remove duplicates from neighborhoods
              // fetchedNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i);

              // Get all cuisines from all restaurants
              // const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
              // Remove duplicates from cuisines
              // fetchedCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i);
              store.dispatch('setRestaurants', restaurants)
            }
            console.log(`%c First Fetch`, 'background: green; color: white; padding: 10px;', restaurants)
            dbPromise.then( db => {
                db.transaction("restaurants", "readwrite").objectStore("restaurants").put({
                id: 'all',
                data: restaurants
              })
            })
          })
        }).catch(error => {
          console.log('%c' + error, 'background: red;')
        })
      } else {
        store.dispatch('setRestaurants', allRestaurants.data)
        console.log({allRestaurants})
      }
    })
  }).catch(error => {
    console.log('%c' + error, 'background: red;')
  })
  console.log('globals', process.env.SERVERURL)
  console.log('get query query', query)
  store.dispatch('setRestaurants', [])
  console.log('[PLUGIN] Fetching data if it does not exist', store)
}
