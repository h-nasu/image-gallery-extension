
import commonConfig from '~/public/commonConfig'

export const state = () => ({
  schema: commonConfig.schema.images,
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
  deleteFromIndexedDB (state, image) {
    state.list.splice(state.list.indexOf(image), 1)
  },
  editFromIndexedDB (state, image, name) {
    image.name = name
  }
}