
import vuexIndexedDBPlugin from '~/plugins/vuexIndexedDBPlugin'

export const plugins = [ vuexIndexedDBPlugin('chrome-image-extension-db', 1) ]

export const state = () => ({
  counter: 0
})

export const mutations = {
  increment (state) {
    state.counter++
  }
}