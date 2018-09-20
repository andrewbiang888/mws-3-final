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

              // for (let i = 0; i < restaurants.length; i++) {
              //   const restaurant = restaurants[i];
              //   let url2 = 'http://localhost:1337/reviews/?restaurant_id=' + restaurant.id
              //   restaurant.reviews = await fetch(url2, {method: "GET"}).then( response => {
              //     if (!response.clone().ok && !response.clone().redirected) {
              //       throw "No reviews available";
              //     }
              //     console.log('Yoo Im in fetch');

              //     return response.json();


              //   })
              // }


              // restaurants.forEach( async restaurant => {
              //   let url2 = 'http://localhost:1337/reviews/?restaurant_id=' + restaurant.id
              //   let reviews = await fetch(url2, {method: "GET"}).then( response => {
              //     if (!response.clone().ok && !response.clone().redirected) {
              //       throw "No reviews available";
              //     }
              //     return response.json()
              //   })
              //   // console.log({reviews})
              //   // console.log({restaurant})
              //   restaurant.reviews = await reviews
              // })
              console.log(`%c First Fetch`, 'background: green; color: white; padding: 10px;', returnedRestaurantData)

              console.log({restaurants})
              return restaurants
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
        return await dbPromise.then( async db2 => {
          let tx2 = db2.transaction("pending", "readwrite")
          return await tx2.objectStore("pending").getAll().then( async results => {
            if (!results) {
              console.log('no existing data in idb pending')
              return
            }
            let allRestaurantsClone = await allRestaurants.data

            // console.log('checking pending', results, allRestaurants)
            if (Array.isArray(results) && results.length > 0) {
              // console.log('option 1', results, results.length)

              results.forEach( result => {
                if (!result.data.body) {
                  let id = result.data.url.split('?')[0].split('restaurants/')[1]
                  id = parseInt(id)
                  let isFav = result.data.url.split('?')[1].split('=')[1]
                  allRestaurantsClone.find( restaurant => {
                    if (restaurant.id === id) {
                      restaurant.is_favorite = isFav
                    }
                  })
                }
              })
              return allRestaurantsClone
            } else {
              // console.log('here I am now')
              return allRestaurants.data
            }
          }).then( data => {
            console.log(data)
            if (data.length) {
              returnedRestaurantData = data
              console.log('%c [PLUGIN] From idb', 'background: blue;', {returnedRestaurantData})
              return returnedRestaurantData
              // store.dispatch('setRestaurants', returnedRestaurantData)
            } else {
              return ['existing data in db', 'is not array']
            }
          })
        })
      }
    })
    // return tx.complete
  }).catch( error => {
    console.log('ERROR WITH DB FETCH IN PLUGIN')
    console.log('%c' + error, 'background: red;')
  })

  dbPromise.then( dbb => {
    dbb.transaction("restaurants", "readwrite").objectStore("restaurants").put({
      id: 'all',
      data: returnData
    })
  }).catch(error => {
    console.log('%c' + error, 'background: red;')
  })
  store.dispatch('setRestaurants', returnData)
  store.dispatch('isLoading', false)
}
