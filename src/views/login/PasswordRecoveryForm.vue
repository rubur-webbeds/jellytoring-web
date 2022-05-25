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
            id="password"
            prepend-icon="mdi-lock"
            name="password"
            label="New password"
            type="password"
            v-model="password"
            :rules="[validationRules.required]"
          ></v-text-field>
          <v-text-field
            id="password"
            prepend-icon="mdi-lock"
            name="passwordRepeated"
            label="Repeat new password"
            type="password"
            v-model="passwordRepeated"
            :rules="[
              password === passwordRepeated ||
                'Passwords must match',
              validationRules.required,
            ]"
            @keyup.enter="resetPassord"
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
          @click="this.resetPassord"
          :loading="buttonLoading"
          :disabled="buttonLoading || !validForm"
          >Save new password</v-btn
        >
      </v-card-actions>
    </v-card>

    <v-dialog v-model="showResponseDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>Password changed successfully!</v-card-title>
        <v-card-text>
          Now you can sign in with the new password
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text to="/login">Sign in</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import passwordResetService from "@/services/passwordResetService.js";

export default {
  name: "PasswordRecoveryForm",
  data: () => ({
    password: "",
    passwordRepeated: "",
    showError: false,
    buttonLoading: false,
    validForm: false,
    validationRules: {
      required: (value) => !!value || "This field is required",
    },
    showResponseDialog: false
  }),
  computed: {
    confirmationCode: function () {
      return this.$route.params.confirmationCode;
    },
  },
  methods: {
    async resetPassord() {
      if (this.validForm) {
        this.showError = false;
        this.buttonLoading = true;
        try {
          await passwordResetService.saveNewPassword(this.password, this.confirmationCode);
          this.showResponseDialog = true;
        } catch (error) {
          this.showError = true;
          this.buttonLoading = false;
        }
      }
    }
  }
};
</script>
