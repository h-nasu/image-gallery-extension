
export const state = () => ({
  list: []
})

export const mutations = {
  initFromIndexedDB (state, list) {
    state.list = list
  },
  addToIndexedDB () {},
  addedToIndexedDB (state, data) {
    state.list.push(data)
  },
  deleteFromIndexedDB (state, collection) {
    state.list.splice(state.list.indexOf(collection), 1)
  },
  editFromIndexedDB (state, collection, name) {
    collection.name = name
  }
}