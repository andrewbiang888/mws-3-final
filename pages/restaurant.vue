<template lang='pug'>
  div
    section#restaurant-container
      h2#restaurant-name {{currentRestaurant.name}}
</template>
<script>
  export default {
    data () {
      return {

      }
    },
    methods: {

    },
    computed: {
      currentRestaurant () {
        let self = this
        let currentRestaurant = self.$store.state.restaurants.filter( restaurant => restaurant.id == self.$store.state.page)
        return currentRestaurant[0]
      }
    },
    beforeMount () {
    }
  }
</script>

<style lang='scss'>

</style>
