import idb from 'idb'
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
  console.log('%c [MIDDLEWARE ERROR]' + error, 'background: red;')
})


export default function(context) {
  // go tell the store to update the page name
  let returnedRoute = context.query.id ? context.query.id : context.route.name
  let currentPage = context.store.state.restaurants
  // TODO: Check to see if data exists in idb pending. If so check for interent connection. if interent connection, save data on database

  // TODO: 2 update live data? Delete restaurant idb?
  dbPromise.then( db => {
    //Check to see if any db exists, if not exit
    if (!db || !db.objectStoreNames.length) {
      console.log("DB not available");
      // db.close()
      return
    }
    const tx = db.transaction("pending", "readwrite")
    tx.objectStore("pending").openCursor().then( cursor => {
      console.log('[PLUGIN PAGES] Opening pending idb')
      if (!cursor) {
        return;
      }
      // const value = cursor.value;
      url = cursor.value.data.url;
      method = cursor.value.data.method;
      body = cursor.value.data.body;

      // If we don't have a parameter then we're on a bad record that should be tossed
      // and then move on
      if ((!url || !method) || (method === "POST" && !body)) {
        cursor.delete()
        return;
      };

      const properties = {
        body: JSON.stringify(body),
        method: method
      }
      if (navigator.onLine) {
        console.log("sending post from queue: ", properties)
        fetch(url, properties).then(response => {
          // If we don't get a good response then assume we're offline
          if (!response.ok && !response.redirected) {
            return;
          }
        }).then(() => {
            // Success! Delete the item from the pending queue
          const deltx = db.transaction("pending", "readwrite");
          deltx.objectStore("pending").openCursor().then(cursor => {
            cursor.delete().then(() => {
              return
            })
          })
          console.log("deleted pending item from queue")
        })
      } else {
        console.log('[MIDDLEWARE] Not online, data left in idb pending')
        return
      }
    })
    .catch(error => {
      console.log("Error reading cursor");
      return;
    })

  })

  console.log('[MIDDLEWARE] current page is', currentPage)
  context.store.commit('setPage', returnedRoute)
}
