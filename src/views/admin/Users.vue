<template>
  <v-container>
    <v-card class="mt-5">
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
        :items="items"
        :search="search"
      >
        <template v-slot:[`item.active`]="props">
          <v-icon small v-if="props" color="green">mdi-check-circle</v-icon>
          <v-icon small v-if="!props" color="red">mdi-close-circle</v-icon>
        </template>
        <template v-slot:[`item.emailConfirmed`]="props">
          <v-icon small v-if="props" color="green">mdi-check-circle</v-icon>
          <v-icon small v-if="!props" color="red">mdi-close-circle</v-icon>
        </template>
        <template v-slot:[`item.roleCode`]="props">
          <v-edit-dialog
            :return-value.sync="props.item.roleCode"
            large
            persistent
            @save="saveRole"
            @open="loadRoles"
          >
            <div>{{ props.item.roleCode }}</div>
            <template v-slot:input>
              <div class="mt-4"></div>
              <v-select
                :items="roles"
                v-model="props.item.roleCode"
                @click="updatedUser=props.item"
                label="Role"
                dense
                item-text="name"
                item-value="code"
              ></v-select>
            </template>
          </v-edit-dialog>
      </template>
      </v-data-table>
    </v-card>
    <!-- ERROR ALERT -->
      <v-alert
        v-if="this.showError"
        color="red"
        dense
        dismissible
        outlined
        type="error"
      >
        Oops! Something went wrong
      </v-alert>
  </v-container>
</template>

<script>
import { jellytoringApi } from "@/services/jellytoringApi";

export default {
  name: "Users",
  data: () => ({
    search: "",
    headers: [
      { text: "Active", value: "active" },
      { text: "Id", value: "id" },
      { text: "Full name", value: "fullName" },
      { text: "Email", value: "email" },
      { text: "Institution", value: "institution" },
      { text: "Email confirmed", value: "emailConfirmed" },
      { text: "Interest", value: "interestName" },
      { text: "Country", value: "countryName" },
      { text: "Role", value: "roleCode" },
      { text: "# inferences", value: "inferencesCount" },
    ],
    items: [],
    showError: false,
    roles: [],
    updatedUser: null,
  }),
  created(){
    this.fetchUsers();
  },
  methods: {
    async fetchUsers(){
      try {
        const response = await jellytoringApi.get("/api/users")
        console.log(response.data)
        this.items = response.data
      } catch (error) {
        this.showError = true;
      }
    },
    loadRoles(){
      this.roles = [{id: 1, code: 'ADM', name: 'Administrator'}, {id: 2, code: 'USR', name: 'User'}]
    },
    async saveRole(){
      var newRoleCode = this.updatedUser.roleCode;
      var userId = this.updatedUser.id;
      var role = this.roles.find(r => r.code == newRoleCode);

      try {
        await jellytoringApi.post(`/api/users/${userId}/role`, role)
      } catch (error) {
        this.showError = true;
      }
    }
  },
};
</script>
