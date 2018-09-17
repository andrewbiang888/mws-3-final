<template lang='pug'>
div
  transition-group(name="pagetran" mode="out-in")
    div(v-if="currentRestaurant != null" key="withdata")
      section#restaurant-container
        div(style="position: relative;")
          h2#restaurant-name {{currentRestaurant.name}}
          div.favorite-icon
            button(:id="'favorite-icon' + currentRestaurant.id" @click="changeFavoriteState(currentRestaurant.id, currentRestaurant.is_favorite)" v-if="currentRestaurant.is_favorite === true || currentRestaurant.is_favorite === 'true'" style="background: url('/img/icons/filled-fav-icon.svg') no-repeat;") {{currentRestaurant.name}} is a favorite
            button(:id="'favorite-icon' + currentRestaurant.id" @click="changeFavoriteState(currentRestaurant.id, currentRestaurant.is_favorite)" v-if="currentRestaurant.is_favorite === false || currentRestaurant.is_favorite === 'false'" style="background: url('/img/icons/fav-icon.svg') no-repeat;") {{currentRestaurant.name}} is not a favorite
        img#restaurant-img(src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" :data-src="'/img/tiles/' + currentRestaurant.id + '_1x.jpg'" :data-srcset="'/img/tiles/' + currentRestaurant.id + '_1x.jpg 300w, /img/tiles/' + currentRestaurant.id + '_2x.jpg 600w'" :alt="currentRestaurant.name + ' currentRestaurant promotion'")
        p#restaurant-cuisine {{currentRestaurant.cuisine_type}}
      section#restaurant-address-and-hours
        p#restaurant-address(aria-labelledby="restaurant-address-label") {{currentRestaurant.address}}
        label(id="restaurant-address-label" class="restaurant-info-label") address
        section#map-container(aria-labelledby="map-aria-description" role="application")
          div#map
        label(id="map-aria-description" class="map-aria-description") Leaflet Map Application
        div#restaurant-hours-flex
        h3 Hours
        table(id="restaurant-hours" aria-labelledby="restaurant-hours-label")
          tr(v-for="(day, key) in currentRestaurant.operating_hours")
            td {{key}}
            td {{day}}
        label(id="restaurant-hours-label" class="restaurant-info-label") Hours of opperation
      section#reviews-container
        h3 Reviews
        button(@click="leavingReview = !leavingReview") {{ leavingReview ? 'Nevermind': 'Add a review'}}
        transition(name="pagetran" mode="out-in")
          div(v-if="leavingReview")
            p Leave a review for this restaurant below
            div.review-entry
              div
                label
                  span.label-text Your name
                  input(v-model="yourname" type="text" id="reviewName")
              div
                label
                  span.label-text Rating
                  select#reviewRating( v-model="yourrating" type="number")
                    option(value="1") 1
                    option(value="2") 2
                    option(value="3") 3
                    option(value="4") 4
                    option(value="5") 5
              div
                label
                  span.label-text Comments
                  textarea(id="reviewComment" rows="4" cols="30" v-model="yourcomment")
              button(id="btnSaveReview" @click="saveReview(currentRestaurant.id)") Save Review
        transition-group#reviews-list(tag="ul" name="pagetran" mode="out-in")
          li(v-for="(review, key) in currentRestaurant.reviews" :key="key" v-if="currentRestaurant.reviews")
            p.restaurant-review-user {{review.name}}
            p {{review.date}}
            p Rating: {{review.rating}}
            p {{review.comments}}
          li(v-if="!currentRestaurant.reviews" key="noreviews")
            p No reviews yet for this item
    div(v-else key="withoutdata")
</template>
<script>
  export default {
    watchQuery: ['page'],
    data () {
      return {
        leavingReview: false,
        yourname: '',
        yourrating: 5,
        yourcomment: ''
      }
    },
    computed: {
      restaurantList () {
        return this.$store.state.restaurants
      },
      currentRestaurant () {
        let self = this
        let currentRestaurant
        if (self.$store.state.restaurants) {
          currentRestaurant = self.$store.state.restaurants.filter( restaurant => restaurant.id == self.$store.state.page)[0]
        }
        return currentRestaurant
      },
      todaysDate () {
        let monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        let d = new Date()
        let day = d.getDate()
        let year = d.getFullYear()
        return monthNames[d.getMonth()] + ' ' + day + ', ' + year
      }
    },
    methods: {
      saveReview (id) {
        let currentkey = 'reviews'
        let newstate = {
          restaurant_id: id,
          name: this.yourname,
          rating: this.yourrating,
          comments: this.yourcomment,
          createdAt: Date.now()
        }
        // console.log('Save!', {id, currentkey, newstate})
        this.$store.dispatch('updateRestaurantData', {id, currentkey, newstate})
        // this.$forceUpdate()
        this.yourcomment = ''
        this.yourname = ''
        this.yourrating = 5
        this.leavingReview = false
      },
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
        let restaurant = this.currentRestaurant
        window.newMap = L.map('map', {
          center: [restaurant.latlng.lat, restaurant.latlng.lng],
          zoom: 16,
          attributionControl: false,
          scrollWheelZoom: false
        })
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
          mapboxToken: 'pk.eyJ1IjoiYW5kcmV3YmlhbmciLCJhIjoiY2preTMycnFkMDAzODN2bzR6MzE2NGl3cyJ9.-cT6arYid1JT1hByODt8-g',
          maxZoom: 18,
          id: 'mapbox.streets'
        }).addTo(window.newMap);
      },
      addMarkersToMap () {
        let restaurant = this.currentRestaurant
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
      },
      changeFavoriteState (id, oldstate) {
        let newstate = oldstate === false || oldstate === 'false' ? true : false
        let currentkey = "is_favorite"
        // newRestaurantData[currentkey] = newstate
        // console.log({currentkey})
        this.$store.dispatch('updateRestaurantData', {id, currentkey, newstate})
        this.$forceUpdate()
        // console.log('[index.vue] changing state', id, key, newRestaurantData)
      }
    },
    mounted () {
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
  }
</script>

<style lang='scss' scoped>
.favorite-icon {
    position: absolute;
    position: absolute;
    top: 4px;
    right: 20px;
    width: 25px;
    height: 25px;
}
</style>
