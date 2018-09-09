export default function(context) {
  // go tell the store to update the page name
  context.store.commit('setPage', context.route.name)
}
