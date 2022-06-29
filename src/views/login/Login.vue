<template>
  <v-container>
    <v-card>
      <v-toolbar dark>
        <v-toolbar-title>
          <v-icon>mdi-account</v-icon>
          <span class="ml-3"> Sign in </span>
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form @submit.prevent v-model="validForm">
          <v-text-field
            prepend-icon="mdi-account"
            name="login"
            label="Email"
            type="email"
            v-model="email"
            :rules="[validationRules.required, validationRules.email]"
          ></v-text-field>
          <v-text-field
            id="password"
            prepend-icon="mdi-lock"
            name="password"
            label="Password"
            type="password"
            v-model="password"
            :rules="[validationRules.required]"
            @keyup.enter="login"
          ></v-text-field>
          <v-btn class="ml-5" plain text small color="blue darken-2" to="passwordrecoveryemail">Forgot my password</v-btn>
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
        <v-btn
          @click="this.login"
          :loading="buttonLoading"
          :disabled="buttonLoading || !validForm"
          >Sign in</v-btn
        >
      </v-card-actions>
    </v-card>
    <v-card>
      <v-container class="d-flex justify-center mt-3">
        <div class="my-3">
            <label>Don't have an account yet?</label>
            <v-btn plain text small color="blue darken-2" to="signup">Create one</v-btn>
        </div>
      </v-container>
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
    buttonLoading: false,
    validForm: false,
    validationRules: {
      required: (value) => !!value || "This field is required",
      email: (value) => {
        const pattern =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "Invalid e-mail";
      },
    },
  }),
  methods: {
    async login() {
      if (this.validForm) {
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
    }
  },
  created() {
    if (authService.isUserLogged()) {
      this.$router.push("/dashboard");
    }
  },
};
</script>
