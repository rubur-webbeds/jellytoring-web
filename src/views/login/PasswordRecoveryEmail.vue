<template>
  <v-container>
    <v-card class="elevation-12">
      <v-toolbar dark>
        <v-toolbar-title>
          <v-icon>mdi-account</v-icon>
          <span class="ml-3"> Reset your password </span>
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
            @keyup.enter="sendResetEmail"
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
          Oops! Something went wrong
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          @click="this.sendResetEmail"
          :loading="buttonLoading"
          :disabled="buttonLoading || !validForm"
          >Send password reset email</v-btn
        >
      </v-card-actions>
    </v-card>

    <v-dialog v-model="showResponseDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>Almost there!</v-card-title>
        <v-card-text>
          Check your inbox. We've sent a reset email to
          <strong>{{ this.email }}</strong>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="showResponseDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import passwordResetService from "@/services/passwordResetService.js";

export default {
  name: "PasswordRecoveryEmail",
  data: () => ({
    email: "",
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
    showResponseDialog: false
  }),
  methods: {
    async sendResetEmail() {
      if (this.validForm) {
        this.showError = false;
        this.buttonLoading = true;
        try {
          await passwordResetService.sendResetEmail(this.email);
          this.showResponseDialog = true;
          this.buttonLoading = false;
        } catch (error) {
          this.showError = true;
          this.buttonLoading = false;
        }
      }
    }
  }
};
</script>
