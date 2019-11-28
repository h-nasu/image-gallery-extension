<template>
  <div>
    id is {{ id }}

    <v-container fluid>
      <div ref="lightgallery">
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
    </v-container>
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

export default {
  asyncData({params}) {
    return {
      id: params.id
    }
  },
  computed: {
    images: function() {
      let images = []
      if (this.id == 0 || this.id == 1) {
        images = this.$store.state.images.list
      }
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
    }
  },
}

</script>