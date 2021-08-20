<template>
  <div class="text-center">
    <v-pagination
      v-model="page"
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
      type: Object,
      required: true
    },
    itemsTotalCount: {
      type: Number,
      required: true
    }
  },
  computed: {
    culculatePageCount () {
      return Math.ceil(this.itemsTotalCount / Number(this.value.pageSize))
    },
    page: {
      get () {
        return Number(this.value.page)
      },
      set (value) {
        this.$emit("get_data_per_page", value)
      }
    }
  },
  methods: {
    getDataPerPage (page) {
      this.value.page = page
      this.SetQueryParamsFromSearchConditions(this.value)
    }
  }
}
</script>

