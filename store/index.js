
import commonConfig from '~/public/commonConfig'
import vuexIndexedDBPlugin from '~/public/plugins/vuexIndexedDBPlugin'

export const plugins = [ vuexIndexedDBPlugin(commonConfig.dbname, commonConfig.dbversion) ]

export const state = () => ({
  counter: 0
})

export const mutations = {
  increment (state) {
    state.counter++
  }
}