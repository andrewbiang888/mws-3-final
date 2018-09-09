<template lang='pug'>
main(id="maincontent")
  section(id="map-container" aria-labelledby="map-aria-description" role="application")
    div#map
  label(id="map-aria-description" class="map-aria-description") Google Map Application
  section
    div.filter-options
      h2 Filter Results
      div.filter-selects
        select(id="neighborhoods-select" name="neighborhoods" onchange="updateRestaurants()" aria-label="neighborhoods-label" v-model="selectedNeighborhood")
          option(value="all") All Neighborhoods
          //- option(v-for="neighborhood in filteredNeighborhood" :value="neighborhood") {{neighborhood}}
        label(id="neighborhoods-label" class="filter-label") by neighborhoods
        select(id="cuisines-select" name="cuisines" onchange="updateRestaurants()" aria-label="cuisines-label" v-model="selectedCuisine")
          option(value="all") All Cuisines
          //- option(v-for="cuisine in filteredCuisine" :value="cuisine") {{cuisine}}
        label(id="cuisines-label" class="filter-label") by cuisines
    ul#restaurants-list
      li(v-for="restaurant in filteredList")
        img(class="restaurant-img" src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" :data-src="'/img/tiles/' + restaurant.id + '_1x.jpg'" :data-srcset="'/img/tiles/' + restaurant.id + '_1x.jpg 300w, /img/tiles/' + restaurant.id + '_2x.jpg 600w'" :alt="restaurant.name + ' restaurant promotion'")
        div.restaurant-text-area
          h2 {{restaurant.name}}
          div.favorite-icon
            button(:id="'favorite-icon' + restaurant.id" v-if="restaurant.is_favorite === true || restaurant.is_favorite === 'true'" style="background: url('/img/icons/filled-fav-icon.svg') no-repeat;") {{restaurant.name}} is a favorite
            button(:id="'favorite-icon' + restaurant.id" v-if="restaurant.is_favorite === false || restaurant.is_favorite === 'false'" style="background: url('/img/icons/fav-icon.svg') no-repeat;") {{restaurant.name}} is not a favorite
          p {{restaurant.neighborhood}}
          p {{restaurant.address}}
          nuxt-link.view-more-btn(:to="'/restaurant?id=' + restaurant.id") View Details
</template>

<script>

export default {
  data () {
    return {
      selectedNeighborhood: 'all',
      selectedCuisine: 'all',
      markers: []
    }
  },
  computed: {
    restaurantList () {
      return this.$store.state.restaurants
    },
    filteredList () {
      let self = this
      return self.restaurantList.filter( (restaurant) => {
        if (self.selectedNeighborhood === 'all' && self.selectedCuisine === 'all' ) {
          return restaurant
        } else if (self.selectedNeighborhood != 'all' && self.selectedCuisine === 'all') {
          return restaurant.neighborhood === self.selectedNeighborhood
        } else if (self.selectedNeighborhood === 'all' && self.selectedCuisine != 'all') {
          return restaurant.cuisine_type === self.selectedCuisine
        } else {
          return restaurant.neighborhood === self.selectedNeighborhood && restaurant.cuisine_type === self.selectedCuisine
        }
      })
    },
    filteredNeighborhood () {
      let self = this
      let list1 = self.restaurantList.map( (restaurant) => {
        return restaurant.neighborhood
      })

      return Array.from(new Set(list1)).sort()
    },
    filteredCuisine () {
      let self = this
      let list1 = self.restaurantList.map( (restaurant) => {
        return restaurant.cuisine_type
      })
      return Array.from(new Set(list1)).sort()
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
      // console.log('From addMarkersToMap', this.filteredList)
      this.filteredList.forEach( restaurant => {
        const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng], {
          title: restaurant.name,
          alt: restaurant.name,
          url: '/restaurant?id=' + restaurant.id
        })
        marker.on("click", onClick);
        function onClick() {
          window.location.href = marker.options.url;
        }
        marker.addTo(window.newMap);
        this.markers.push(marker);
      })
    }
  },
  watch: {
    filteredList () {
      this.lazyLoadImgs()
    }
  },
  mounted () {
    this.initMap()
    this.lazyLoadImgs()
    this.addMarkersToMap()
    console.log(process.env.SERVERURL)
  }

}
</script>

<style>
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
</style>

