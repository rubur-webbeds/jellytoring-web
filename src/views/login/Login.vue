<template>
  <v-container>
    <v-card class="elevation-12">
      <v-toolbar dark>
        <v-toolbar-title>
            <v-icon>mdi-account</v-icon>
          <span class="ml-3">
            Login
          </span>
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form @submit.prevent>
          <v-text-field
            prepend-icon="mdi-account"
            name="login"
            label="Email"
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

import authService from "@/services/authService.js";

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
        const response = await authService.login(this.email, this.password);

        const jwt = response.data;
        authService.setUserLogged(jwt);
        this.$router.push("/dashboard");
      } catch (error) {
        this.showError = true;
        this.buttonLoading = false;
      }
    }
  },
  created() {
    if (authService.isUserLogged()) {
      this.$router.push("/dashboard");
    }
  }
};
</script>
