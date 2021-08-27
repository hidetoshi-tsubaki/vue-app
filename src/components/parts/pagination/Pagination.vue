<template>
  <div class="text-center">
    <v-pagination
      v-model="value"
      :length="culculatePageCount"
      @input="getDataPerPage"
      class="my-4"
    />
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    value: {
      type: Number,
      required: true
    },
    pageSize: {
      type: Number,
      required: true
    },
    itemsTotalCount: {
      type: Number,
      required: true
    }
  },
  computed: {
    culculatePageCount () {
      return Math.ceil(this.itemsTotalCount / Number(this.pageSize))
    }
  },
  methods: {
    getDataPerPage (page) {
      var query = Object.assign({}, this.$route.query)
      if (query["page"] != page) {
        query["page"] = page
        this.$router.push({ query: query})
      }
    }
  }
}
</script>

