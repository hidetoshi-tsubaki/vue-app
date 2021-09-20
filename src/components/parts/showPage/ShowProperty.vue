<template>
  <div style="max-width: 600px;">
    <p>
      <v-icon>mdi-clock-check-outline</v-icon>
      {{ ChangeFormat(item.CreatedAt, 'yyyy/MM/dd HH:mm') }}
      <br class="d-sm-none d-flex">
      <v-icon class="ml-sm-3">mdi-cached</v-icon>
      {{ ChangeFormat(item.UpdatedAt, 'yyyy/MM/dd HH:mm') }}
    </p>
    <p>ID: {{ item.ID }}</p>
    <ErrorMessages v-model="this.errorMessages" />
    <v-form ref="form" v-model="valid">
      <slot name="form"></slot>
      <div
        class="my-4"
        align="center"
      >
        <v-btn
          small
          class="mr-5"
          color="primary"
          :disabled="!postable"
          @click="update"
        >
          Update
        </v-btn>
        <v-btn
          small
          color="error"
          @click="deleteItem"
        >
        Delete
        </v-btn>
      </div>
    </v-form>
    <slot name="btn"></slot>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ErrorMessages from '../ErrorMessages'
export default {
  name: 'ShowProperty',
  components: {
    ErrorMessages
  },
  props: {
    value: { type: Object, required: true },
    formKeys: { type: Array, required: true },
    url: { type: String, required: true }
  },
  data: () => ({
    valid: true,
    errorMessages: [],
    itemBeforeEdit: null
  }),
  computed: {
    item: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
      }
    },
    defaultUrl () {
      return "/admin/" + this.url
    },
    formValues () {
      var formValues = {}
      this.formKeys.forEach(key => {
        formValues[key] = this.item[key]
      })
      return formValues
    },
    postable () {
      return this.IsFormValuesChanged(this.itemBeforeEdit, this.item, this.formKeys) && this.validation()
    }
  },
  created () {
    this.itemBeforeEdit = {...this.item}
  },
  methods: {
    ...mapActions({ setFlashMessage: 'flashMessage/set' }),
    validation () {
      return this.$refs.form.validate() ? true : false
    },
    update () {
      if (this.validation()) {
        this.$adminHttp.put(this.defaultUrl + "/" + this.$route.params.id, this.formValues)
        .then(response => {
          if (response.data.ErrorMessages != null) {
            this.errorMessages = response.data.ErrorMessages
          } else {
            this.itemBeforeEdit = response.data
            this.setFlashMessage({
              type: 'success', message: 'Changes have been saved'
            })
          }
        })
      }
    },
    deleteItem () {
      if (window.confirm("Are you sure you want to delete this item ?")) {
        this.$adminHttp.request({
          method: 'delete',
          url: this.defaultUrl,
          data: { SelectedItemIds: [ this.item.ID ] }
        })
        .then(response => {
          if (response.data != null) {
            console.log(response.data)
            this.setFlashMessage({
              type: 'warning', message: 'Failed to delete item'
            })
          } else {
            this.setFlashMessage({
              type: 'success', message: 'delte itemsuccessfully'
            })
            this.$router.push(this.defaultUrl)
          }
        })
      }
    }

  }
}
</script>

<style scoped>
.v-icon {
  padding-bottom: 5px;
}
</style>
