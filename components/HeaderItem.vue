<template lang='pug'>
  header
    nav
      h1
        nuxt-link(to="/") Restaurant Reviews
    transition(name="pagetran" mode="out-in")
      nav(aria-label="Breadcrumb" v-if="page != 'index'")
        ol(id="breadcrumb")
          li
            nuxt-link(to="/") Home
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

    }
  },
  methods: {

  },
  computed: {
    ...mapState(['page']),
  },
}
</script>

<style lang='scss'>

</style>
