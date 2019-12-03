<template>
  <v-dialog
    v-model="dialog"
    max-width="450"
    persistent
  >
    <v-card>
      <v-card-title class="headline">Add to Collections</v-card-title>

      <v-card-text>

        <v-select
          :items="selectCollections"
          v-model="selecteds"
          multiple
          chips
          label="Collections"
        ></v-select>

      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          color="green lighten-1"
          text
          @click="$emit('closeDialog')"
        >
          Cancel
        </v-btn>

        <v-btn
          color="green darken-4"
          text
          @click="addCollection"
        >
          Add
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  props: [
    'dialog',
    'imageIds'
  ],
  data() {
    return {
      selecteds: [1],
    }
  },
  watch: {
    dialog: function(value) {
      if (!value) {
        this.newCollection = ''
        this.parentId = 0
      }
    }
  },
  computed: {
    selectCollections () {
      let collections = []
      this.$store.state.collections.list.forEach((collection) => {
        if (collection.id == 1) return
        collections.push({
          value: collection.id,
          text: collection.name
        })
      })
      return collections
    }
  },
  methods: {
    addCollection() {
      if (this.selecteds.length > 1) {
        let allImages = this.$store.state.images.list
        this.imageIds.forEach((imageid) => {
          let foundImage = allImages.find((image) => {
            return image.id == imageid
          })
          if (foundImage) {
            this.$store.commit('images/editFromIndexedDB', {
              object: foundImage,
              params: {
                collectionIds: this.selecteds
              }
            })
          }
        })
      }
      this.$emit('closeDialog')
    },
  }
}

</script>
