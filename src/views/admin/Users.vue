<template>
  <v-container>
    <h1>Users Management</h1>
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
        :items="desserts"
        :search="search"
      ></v-data-table>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "Users",
  data: () => ({
    search: "",
  }),
};
</script>
