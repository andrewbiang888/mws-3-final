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


let nextPending = () => {
  attemptPending(nextPending)
}
function attemptPending (callback) {
  dbPromise.then( db => {
    //Check to see if any db exists, if not exit
    if (!db || !db.objectStoreNames.length) {
      console.log("DB not available");
      // db.close()
      return
    }
    const tx = db.transaction("pending", "readwrite")

    tx.objectStore("pending").openCursor().then( cursor => {
      console.log('[MIDDLEWARE PAGES] Opening pending idb', cursor.value)
      if (!cursor || !cursor.value) {
        console.log('%c [MIDDLEWARE PAGES] Opening pending no cursor', 'background-color: red;', 'this is chill if you did not save anything in pending')
        return;
      }
      // const value = cursor.value;
      let url = cursor.value.data.url;
      let method = cursor.value.data.method;
      let body = cursor.value.data.body;
      console.log('%c [MIDDLEWARE]', 'background: blue;', {url, method, body})
      // If we don't have a parameter then we're on a bad record that should be tossed
      // and then move on
      if ((!url || !method) || (method === "POST" && !body)) {
        console.log('%c [MIDDLEWARE PAGES] Opening pending no cursor', 'background-color: red;')
        cursor.delete().then(callback())
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
            console.log(cursor)
            cursor.delete().then(() => {
              callback()
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
      console.log("Error reading cursor", error);
      return;
    })

  })
}

export default function(context) {
  let returnedRoute = context.query.id ? context.query.id : context.route.name
  let currentPage = context.store.state.restaurants
  // go tell the store to update the page name
  nextPending()
  console.log('[MIDDLEWARE] current page is', currentPage)
  context.store.commit('setPage', returnedRoute)
}
