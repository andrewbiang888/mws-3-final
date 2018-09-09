export default function(context) {
  // go tell the store to update the page name
  let returnedRoute = context.query.id ? context.query.id : context.route.name
  context.store.commit('setPage', returnedRoute)
}
