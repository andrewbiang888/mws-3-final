<template lang='pug'>
  header
    nav
      h1
        nuxt-link(to="/") Restaurant Reviews
    transition(name="pagetran" mode="out-in")
      nav(aria-label="Breadcrumb" v-if="page != 'index' && currentPageName")
        ol(id="breadcrumb")
          li
            nuxt-link(to="/") Home
          li
            nuxt-link(:to="'/restaurant/?id=' + page" v-if="currentPageName") {{currentPageName}}
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'HeaderItem',
  props: {
    pages: {
      type: String,
      default: '/'
    }
  },
  data () {
    return {
      currentPageName: null
    }
  },
  methods: {
    async currentPage () {
      let page = await this.page
      let restaurantarr = await this.$store.state.restaurants
      let data = await restaurantarr.filter( (rest) => {
        return rest.id == page
      })[0]

      if (data) {
        this.currentPageName = await data.name
      }
    }
  },
  computed: {
    ...mapState(['page'])
  },
  mounted () {
    this.currentPage()
  }
}
</script>

<style lang='scss'>

</style>
