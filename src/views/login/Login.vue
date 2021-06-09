<template>
  <v-container>
    <v-card class="elevation-12">
      <v-toolbar dark>
        <v-toolbar-title>Login form</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form>
          <v-text-field
            prepend-icon="mdi-account"
            name="login"
            label="Login"
            type="text"
          ></v-text-field>
          <v-text-field
            id="password"
            prepend-icon="mdi-lock"
            name="password"
            label="Password"
            type="password"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn to="/">Login</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "Login",
};
</script>
