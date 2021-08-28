<template>
  <div class="text-center">
    <v-pagination
      v-model="page"
      :length="length"
      @input="getDataPerPage"
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
    length: {
      type: Number,
      default: 1
    }
  },
  computed: {
    page: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit("input", value)
      }
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

