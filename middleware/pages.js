import idb from 'idb'

export default function(context) {
  // go tell the store to update the page name
  let returnedRoute = context.query.id ? context.query.id : context.route.name
  let currentPage = context.store.state.restaurants

  console.log('[MIDDLEWARE] current page is', currentPage)
  context.store.commit('setPage', returnedRoute)
}
