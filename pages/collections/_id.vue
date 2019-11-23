<template>
  <div>
    id is {{ id }}
  </div>
</template>

<script>

export default {
  asyncData({params}) {
    return {
      id: params.id
    }
  }
}

</script>