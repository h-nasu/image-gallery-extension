<template>
  <div>
    <div class="floatButton">
      <v-btn color="primary" @click="toggleEdit()">
        {{ editFlag ? 'Finish Edit Image' : 'Edit Image' }}
      </v-btn>

      <span v-if="editFlag">
        <span v-if="editImages.length > 0">
          <v-btn color="info" @click="AddToCollections()">
            Add to Collections
          </v-btn>
          <v-btn small color="warning" @click="deleteSelectedImages()">
            Delete Images
          </v-btn>
        </span>
        <v-btn small color="error" @click="deleteCurrentCollection()">
          Delete this Collection
        </v-btn>
      </span>
    </div>

    <div style="height: 25px;"></div>

    <v-container fluid>
      <div ref="lightgallery" v-if="!editFlag">
      <v-row>
        <v-col
          v-for="(image, index) in images"
          :key="index"
          class="d-flex child-flex"
          cols="4"
        >
        <v-card flat tile class="d-flex">
        <div class="imageItem" :data-src="image.url">
          <img :src="image.url" style="width:100%; cursor: pointer;"/>
        </div>
        </v-card>
        </v-col>
      </v-row>
      </div>
      <div v-else>
        <v-row>
          <v-col
            v-for="(image, index) in images"
            :key="index"
            class="d-flex child-flex"
            cols="4"
          >
          <v-card flat tile class="d-flex">
          <div>
            <img :class="editImages.indexOf(image.id) > -1 ? editImageClass : '' " @click="addOrRemoveEdit(image.id)" :src="image.url" style="width:100%; cursor: pointer;"/>
          </div>
          </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>

    <add-to-collections :current-id="id" :image-ids="editImages" :dialog="addToCollectionDialog" @closeDialog="addToCollectionCloseDialog" />
  </div>
</template>

<script>

// http://sachinchoolur.github.io/lightGallery/docs/
import $ from "jquery"
import 'lightgallery'
import 'lightgallery/dist/css/lightgallery.css'
import 'lg-thumbnail'
import 'lg-autoplay'
import 'lg-fullscreen'
import 'lg-pager'
import 'lg-zoom'

import AddToCollections from '~/components/AddToCollections.vue'

export default {
  components: {
    AddToCollections
  },
  asyncData({params}) {
    return {
      id: params.id
    }
  },
  data() {
    return {
      editFlag: false,
      editImages: [],
      editImageClass: 'editImageClass',
      addToCollectionDialog: false,
    }
  },
  computed: {
    images: function() {
      let images = []
      let list = this.$store.state.images.list
      let checkAdd = (value) => {
        switch (this.id) {
          case '0':
            if (!value.collectionIds) {
              images.push(value)
            }
            break;
          default:
            if (value.collectionIds) {
              let foundValue = value.collectionIds.find((collectionId) => {
                return collectionId == parseInt(this.id)
              })
              if (foundValue) {
                images.push(value)
              }
            }
        }
      }

      list.forEach((value) => {
        checkAdd(value)
      })
      this.loadLightbox()
      return images
    }
  },
  methods: {
    loadLightbox() {
      this.$nextTick(function () {
        $(this.$refs.lightgallery).lightGallery({
          selector: '.imageItem',
          thumbnail: true,
          pause: 2000
        })

      })
    },
    toggleEdit() {
      this.editFlag = !this.editFlag
      this.loadLightbox()
      if (!this.editFlag) {
        this.editImages = []
      }
    },
    addOrRemoveEdit(id) {
      let foundId = this.editImages.indexOf(id)
      if (foundId > -1) {
        this.editImages.splice(foundId, 1)
      } else {
        this.editImages.push(id)
      }
    },
    AddToCollections() {
      this.addToCollectionDialog = true
    },
    addToCollectionCloseDialog() {
      this.addToCollectionDialog = false
    },
    deleteSelectedImages() {
      let result = confirm('Are you sure to delete all selected images?')
      if (result) {
        this.editImages.forEach((editImageId) => {
          let foundImage = this.images.find((image) => {
            return image.id == editImageId
          })
          if (foundImage) {
            this.$store.commit('images/deleteFromIndexedDB', foundImage)
          }
        })

      }
    },
    deleteCurrentCollection() {
      let collections = this.$store.state.collections.list
      let foundCollection = collections.find((collection) => {
        return collection.id == this.id
      })
      if (foundCollection) {
        let result = confirm(`Are you sure to delete "${foundCollection.name}" Collection?`)
        if (result) {
          this.$store.commit('collections/deleteFromIndexedDB', foundCollection)
          this.$router.replace({
            path: '/collections/1'
          })
        }
      }
    }
  },
}

</script>


<style scoped>
.editImageClass {
  border: 5px solid #1C6EA4;
}
.floatButton {
  z-index: 999;
  position: fixed;
}
</style>
