<template>
  <v-card>
    <v-card-title>
      Users
      <v-spacer></v-spacer>
      <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="users"
      sort-by="headers"
      :search="search"
    >
      <v-toolbar>
       <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
      <template v-slot:top>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          small
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'Mytable',
  data: () => ({
    users: [],
    headers: [
      { text: 'ID',
        value: 'ID'
      },
      {
        text: 'Name',
        value: 'Name'
      },
      {
        text: 'Experience',
        value: 'Experience'
      },
      {
        text: 'Created Date',
        value: 'CreatedAt'
      },
      {
        text: 'Updated Date',
        value: 'UpdatedAt'
      },
      {
        text: 'Actions',
        value: 'actions',
        sortable: false
      }
    ],
    dialog: false,
    dialogDelete: false,
    search: '',
    selected: [],
    editedItem: {
      Name: ''
    },
    defaultItem: {
      Name: ''
    },
  }),
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },
  created () {
    this.fetchData()
  },
  methods: {
    ...mapActions({ setFlashMessage: 'flashMessage/set' }),
    fetchData: function () {
      this.$adminHttp.get('/admin/users')
        .then((response) => {
          if (response.data.ErrorMessages != null) {
            console.log(response.data.ErrorMessages)
            this.setFlashMessage({ type: 'error', message: 'Failed to fetch data ...'})
            this.$router.push({ path: '/admin/home'})
            }
            this.users = response.data.Users
        })
        .catch(error => {
          console.log(error)
        })
    },
    deleteItem (item) {
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    deleteItemConfirm () {
      this.$adminHttp.delete(`/admin/users/${this.editedItem.ID}`)
      .then(response => {
        if (response.data != null) {
          console.log(response.data)
          this.setFlashMessage("error", "Failed to delete ...")
        } else {
          this.users.splice(this.editedIndex, 1)
          this.closeDelete()
        }
      })
      .catch(error => {
        console.log(error)
        this.setFlashMessage("error", "Failed to delete ...")
      })

    },
    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.users[this.editedIndex], this.editedItem)
      } else {
        this.users.push(this.editedItem)
      }
      this.close()
    }
  }
}
</script>
