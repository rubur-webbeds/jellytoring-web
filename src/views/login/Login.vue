<template>
  <v-container>
    <v-card class="elevation-12">
      <v-toolbar dark>
        <v-toolbar-title>Login form</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form @submit.prevent>
          <v-text-field
            prepend-icon="mdi-account"
            name="login"
            label="Login"
            type="email"
            v-model="email"
          ></v-text-field>
          <v-text-field
            id="password"
            prepend-icon="mdi-lock"
            name="password"
            label="Password"
            type="password"
            v-model="password"
          ></v-text-field>
        </v-form>
        <v-alert
          v-if="showError"
          dense
          outlined
          type="error"
          transition="scale-transition"
          dismissible
        >
          Please check your email and password and try again.
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="this.login" :loading="buttonLoading" :disabled="buttonLoading">Login</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>

import auth from "@/services/auth";

export default {
  name: "Login",
  data: () => ({
    email: "",
    password: "",
    showError: false,
    buttonLoading: false
  }),
  methods: {
    async login() {
      this.showError = false;
      this.buttonLoading = true;
      try {
        const response = await auth.login(this.email, this.password);

        const jwt = response.data;
        auth.setUserLogged(jwt);
        this.$router.push("/");
      } catch (error) {
        this.showError = true;
        this.buttonLoading = false;
      }
    }
  },
};
</script>
