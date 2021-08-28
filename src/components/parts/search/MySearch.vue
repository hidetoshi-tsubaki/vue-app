<template>
  <v-card
    class="mb-3 px-5 pt-5"
  >
    <p class="mb-0">
      Ascending: 
      <v-switch
        v-model="searchConditions.ascending"
        :label="searchConditions.ascending ? 'On': 'Off'"
        class="ml-3 my-0 py-0 d-inline-flex"
        inset
        dense
        hide-details
      >
      </v-switch>
    </p>
    <MyInput
      v-model="searchConditions.keywords"
      label="Keyword"
    />
    <div style="max-width: 600px;">
      <slot name="selectCategory"></slot>
    </div>
    <v-row class="mt-1 mb-3">
      <v-col cols="12" sm="6">
        <p class="mb-0">Creation Date</p>
        <v-row>
          <v-col cols="12" sm="6" class="pt-md-0 py-0 pxsm-1">
            <MyDatepickerInput
              v-model="searchConditions.fromCreationDate"
              label="From"
              :max="searchConditions.toCreationDate"
            />
          </v-col>
          <v-col cols="12" sm="6" class="pt-md-0 py-0 px-sm-1">
            <MyDatepickerInput
              v-model="searchConditions.toCreationDate"
              label="To"
              :min="searchConditions.fromCreationDate"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" sm="6">
        <p class="mb-0">Update Date</p>
        <v-row>
          <v-col cols="12" sm="6" class="pt-md-0 py-0 px-sm-1">
            <MyDatepickerInput
              v-model="searchConditions.fromUpdateDate"
              label="From"
              :max="searchConditions.toUpdateDate"
            />
          </v-col>
          <v-col cols="12" sm="6" class="pt-md-0 py-0 px-sm-1">
            <MyDatepickerInput
              v-model="searchConditions.toUpdateDate"
              label="To"
              :min="searchConditions.fromUpdateDate"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        @click="ClearSearchConditions(defaultSearchConditions)"
        plain
        class="mx-3"
      >Clear</v-btn>
      <v-btn
        color="primary"
        small
        @click="Search(searchConditions, searchUrl, 1)"
      >
        <v-icon left>
          mdi-magnify
        </v-icon>
        Search
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import mixin from '../../../mixins/globalMethods.js'
import MyInput from '../form/MyInput'
import MyDatepickerInput from '../form/MyDatepickerInput'
export default {
  name: "MySearch",
  mixins: [mixin],
  components: {
    MyInput,
    MyDatepickerInput
  },
  props: {
    value: {
      type: Object,
      required: true
    },
    defaultSearchConditions: {
      type: Object,
      required: true
    },
    url: {
      type: String,
      required: true
    },
  },
  computed: {
    searchConditions: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
      }
    },
    searchUrl () {
      return this.url + "/search"
    }
  },
  methods: {
    Search (searchConditions, url, page) {
      searchConditions.page = page
      searchConditions = this.RemoveEmptyValue(searchConditions)
      this.$router.push({ query: searchConditions })
    },
    ClearSearchConditions() {
      if (window.confirm("Are you sure you wnat to clear 'All' search conditions")) {
        this.searchConditions = Object.assign({}, this.defaultSearchConditions)
      }
    }
  }
}
</script>
