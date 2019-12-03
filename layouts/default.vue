<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>


      <v-btn block color="blue" class="white--text" @click.stop="dialog = true">
        Add Collections
        <v-icon right>mdi-plus-circle</v-icon>
      </v-btn>



      <v-treeview
        activatable
        hoverable
        :items="treeItems"
        :active.sync="active"
      ></v-treeview>


    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <!--
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="clipped = !clipped"
      >
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="fixed = !fixed"
      >
        <v-icon>mdi-minus</v-icon>
      </v-btn>
    -->
      <v-toolbar-title v-text="title" />
      <v-spacer />
<!--
      <v-btn
        icon
        @click.stop="rightDrawer = !rightDrawer"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    -->
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />

        <edit-collections :dialog="dialog" @closeDialog="closeDialog" />

      </v-container>
    </v-content>

  </v-app>
</template>

<script>

import EditCollections from '~/components/EditCollections.vue'
import cloneDeep from 'lodash/clonedeep'

export default {
  components: {
    EditCollections
  },
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'New Images',
          to: '/collections/0'
        },
        /*
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
        */
      ],
      miniVariant: false,
      title: 'Image Gallery Extension',

      active: [],

      dialog: false,

    }
  },
  computed: {
    treeItems () {
      let allCollections = cloneDeep(this.$store.state.collections.list)

      let findParent = (collections, collection) => {
        let result = collections.find((coll) => {
          return coll.id == collection.parentId
        })
        if (result) {
          if (!result.children) result.children = [];
          result.children.push(collection)
          return true
        }

        for (let i in collections) {
          let coll = collections[i]
          if (coll.children && coll.children.length > 0) {
            let resultChild = findParent(coll.children, collection)
            if (resultChild) {
              return true
              break
            }
          }
        }

        return false
      }

      let i = allCollections.length
      while (i--) {
        let collection = allCollections[i]
        if (collection.parentId != 0) {
          let result = findParent(allCollections, collection)
          if (result) {
            allCollections.splice(i, 1)
          }
        }
      }
      return allCollections
    }
  },
  watch: {
    active: function(value) {
      this.$router.push({
        path: '/collections/'+value[0]
      })
    }
  },
  created() {
    /*
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.type == 'getImages' && request.images) {
        console.log('Image-Gallery Got Images')
        console.log(request.images)
        sendResponse({farewell: 'Got Images on Image-Gallery!'})
      } else {
        sendResponse({farewell: 'No Images!'})
      }

    });
    */
    let self = this
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.type == 'savedImageToIndexedDB') {
        console.log('Image-Gallery Got Images')
        self.$store.commit('images/loadAllFromIndexedDB')
        sendResponse({farewell: 'Got Images on Image-Gallery!'})
      }

    });
    if (window.location.href.search('index.html') > -1) {
      this.$router.replace({
        path: '/'
      })
    }
  },
  methods: {
    closeDialog() {
      this.dialog = false
    }
  }
}
</script>
