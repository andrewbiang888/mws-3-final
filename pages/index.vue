<template lang='pug'>
main#maincontent
  transition.transition(name="pagetran" mode="out-in")
    div.nodata(v-if="isLoading" key="nodata" style="background: white")
        h1 Loading or no data
    div(v-if="!isLoading" key="havedata")
      section(id="map-container" aria-labelledby="map-aria-description" role="application" :class="isOnline ? '' : 'offline-sad' ")
        div.offline-notification(v-if="!isOnline")
          h1 Currently Offline
        div#map(:class="isOnline ? '' : 'offline-sad' ")
      label(id="map-aria-description" class="map-aria-description") Google Map Application
      section
        div.filter-options
          h2 Filter Results
          div.filter-selects
            select(id="neighborhoods-select" name="neighborhoods"  aria-label="neighborhoods-label" v-model="selectedNeighborhood")
              //- option(value="all") All Neighborhoods
              option(v-for="neighborhood in filteredNeighborhood" :value="neighborhood") {{neighborhood}}
            label(id="neighborhoods-label" class="filter-label") by neighborhoods
            select(id="cuisines-select" name="cuisines" aria-label="cuisines-label" v-model="selectedCuisine")
              //- option(value="all") All Cuisines
              option(v-for="cuisine in filteredCuisine" :value="cuisine") {{cuisine}}
            label(id="cuisines-label" class="filter-label") by cuisines
        transition-group(name="pagetran" mode="out-in" tag="ul" id="restaurants-list")
          li( v-if="filteredList" v-for="restaurant in filteredList" :key="restaurant.name")
            img(class="restaurant-img" src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" :data-src="'/img/tiles/' + restaurant.id + '_1x.jpg'" :data-srcset="'/img/tiles/' + restaurant.id + '_1x.jpg 300w, /img/tiles/' + restaurant.id + '_2x.jpg 600w'" :alt="restaurant.name + ' restaurant promotion'")
            div.restaurant-text-area
              h2 {{restaurant.name}}
              div.favorite-icon
                button(:id="'favorite-icon' + restaurant.id" @click="changeFavoriteState(restaurant.id, restaurant.is_favorite)" v-if="restaurant.is_favorite === true || restaurant.is_favorite === 'true'" style="background: url('/img/icons/filled-fav-icon.svg') no-repeat;") {{restaurant.name}} is a favorite
                button(:id="'favorite-icon' + restaurant.id" @click="changeFavoriteState(restaurant.id, restaurant.is_favorite)" v-if="restaurant.is_favorite === false || restaurant.is_favorite === 'false'" style="background: url('/img/icons/fav-icon.svg') no-repeat;") {{restaurant.name}} is not a favorite
              p {{restaurant.neighborhood}}
              p {{restaurant.address}}
              nuxt-link.view-more-btn(:to="'/restaurant?id=' + restaurant.id") View Details
</template>

<script>

export default {
  data () {
    return {
      selectedNeighborhood: 'All Neighborhoods',
      selectedCuisine: 'All Cuisines',
      markers: [],
      isLoading: true
    }
  },
  computed: {
    isOnline () {
      return navigator.onLine
    },
    restaurantList () {
      return this.$store.state.restaurants
    },
    filteredList () {
      let self = this
      if (self.restaurantList != null) {
        return self.restaurantList.filter( (restaurant) => {
          if (self.selectedNeighborhood === 'All Neighborhoods' && self.selectedCuisine === 'All Cuisines' ) {
            return restaurant
          } else if (self.selectedNeighborhood != 'All Neighborhoods' && self.selectedCuisine === 'All Cuisines') {
            return restaurant.neighborhood === self.selectedNeighborhood
          } else if (self.selectedNeighborhood === 'All Neighborhoods' && self.selectedCuisine != 'All Cuisines') {
            return restaurant.cuisine_type === self.selectedCuisine
          } else {
            return restaurant.neighborhood === self.selectedNeighborhood && restaurant.cuisine_type === self.selectedCuisine
          }
        })
      } else {
        return null
      }
    },
    filteredNeighborhood () {
      let self = this
      let list1 = self.restaurantList.map( (restaurant) => {
        return restaurant.neighborhood
      })
      let list2 = Array.from(new Set(list1)).sort()
      list2.unshift('All Neighborhoods')
      return list2
    },
    filteredCuisine () {
      let self = this
      let list1 = self.restaurantList.map( (restaurant) => {
        return restaurant.cuisine_type
      })
      let list2 = Array.from(new Set(list1)).sort()
      list2.unshift('All Cuisines')
      return list2
    }
  },
  methods: {
    lazyLoadImgs () {
      let imgDefer = document.getElementsByTagName('img')
      setTimeout(function(){
        for (var i=0; i < imgDefer.length; i++) {
          if ( imgDefer[i].getAttribute('data-src') ) {
            imgDefer[i].setAttribute('src',imgDefer[i].getAttribute('data-src'))
            if ( imgDefer[i].getAttribute('data-srcset') ) {
              imgDefer[i].setAttribute('srcset',imgDefer[i].getAttribute('data-srcset'))
            }
          }
        }
      }, 300)
    },
    initMap () {
      window.newMap = L.map('map', {
        center: [40.722216, -73.987501],
        zoom: 12,
        attributionControl: false,
        scrollWheelZoom: false
      });
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
        mapboxToken: 'pk.eyJ1IjoiYW5kcmV3YmlhbmciLCJhIjoiY2preTMycnFkMDAzODN2bzR6MzE2NGl3cyJ9.-cT6arYid1JT1hByODt8-g',
        maxZoom: 18,
        id: 'mapbox.streets'
      }).addTo(window.newMap);
    },
    addMarkersToMap () {
      if (this.markers != []) {
        this.markers.forEach( oldrestaurant => {
          window.newMap.removeLayer(oldrestaurant)
        })
        this.markers = []
      }
      this.filteredList.forEach( restaurant => {
        const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng], {
          title: restaurant.name,
          alt: restaurant.name + ' location',
          url: '/restaurant?id=' + restaurant.id
        })
        if (navigator.onLine) {
          marker.on("click", onClick);
          function onClick() {
            window.location.href = marker.options.url;
          }
        }
        marker.addTo(window.newMap);
        this.markers.push(marker);
      })
    },
    changeFavoriteState (id, oldstate) {
      let newRestaurantData = this.filteredList.filter( restaurant => restaurant.id == id)[0]
      let newstate = oldstate === false || oldstate === 'false' ? true : false
      let currentkey = "is_favorite"
      // newRestaurantData[currentkey] = newstate
      // console.log({currentkey})
      this.$store.dispatch('updateRestaurantData', {id, currentkey, newstate})
      this.$forceUpdate()
      // console.log('[index.vue] changing state', id, key, newRestaurantData)
    },
    init () {
      self = this
      this.lazyLoadImgs()
      this.initMap()
      if (!window.newMap)  {
        console.log('map did not exist')
        setTimeout( function () {
          self.addMarkersToMap()
        }, 200)
      } else {
        this.addMarkersToMap()
      }
    }
  },
  watch: {
    filteredList () {
      console.log('watch filteredList')
      this.lazyLoadImgs()
      this.addMarkersToMap()
    },
    isLoading () {
      self = this
      setTimeout(() => {
        console.log('Watcher is loading')
        self.init()
      }, 1000);
    }
  },
  mounted () {
    let self = this
    this.isLoading = false
    // this.init()
  }
}
</script>

<style lang="scss">
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
.offline-notification {
  display: none;
}
#map-container.offline-sad:hover {
  position: relative;
  .offline-notification {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
      h1 {
        font-size: 50px;
        text-shadow: 2px 2px whitesmoke;
      }
  }
  #map.offline-sad {
    filter: blur(2px);
  }
}

</style>

