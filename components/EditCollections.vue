<template>
  <v-dialog
    v-model="dialog"
    max-width="450"
    persistent
  >
    <v-card>
      <v-card-title class="headline">Edit Collections</v-card-title>

      <v-card-text>

        <v-text-field
          v-model="newCollection"
          filled
          clear-icon="mdi-close-circle"
          clearable
          label="Collection Name"
          type="text"
        ></v-text-field>

        <v-select
          :items="selectCollections"
          v-model="parentId"
          label="Parent Collection"
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
  props: ['dialog'],
  data() {
    return {
      newCollection: '',
      parentId: 0,
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
      let collections = [
        {
          value: 0,
          text: 'None'
        }
      ]
      let allCollections = this.$store.state.collections.list.map((collection) => {
        return {
          value: collection.id,
          text: collection.name
        }
      })
      return [...collections, ...allCollections]
    }
  },
  methods: {
    addCollection() {
      console.log(this.newCollection)
      if (this.newCollection) {
        this.$store.commit('collections/addToIndexedDB', {
          name: this.newCollection,
          parentId: this.parentId
        } )
      }
      this.$emit('closeDialog')
    },
  }
}

</script>
