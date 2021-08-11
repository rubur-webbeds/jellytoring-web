<template>
  <v-container>
    <h1>Email confirmation</h1>
    <div class="text-center mt-15">
      <v-progress-circular
        v-if="waitingApiResponse"
        indeterminate
      ></v-progress-circular>
      <!-- ERROR ALERT -->
      <v-alert
        v-if="this.showErrorAlert"
        color="red"
        dense
        dismissible
        outlined
        type="error"
      >
        Oops! Something went wrong
      </v-alert>
      <!-- SUCCESS ALERT -->
      <div v-if="this.showConfirmedAlert">
        <v-alert color="green" dense dismissible outlined type="success">
          Email confirmed successfully
        </v-alert>
        <v-btn large to="/login" class="mt-3">Sign in</v-btn>
      </div>
    </div>
  </v-container>
</template>

<script>
import { jellytoringApi } from "@/jellytoringApi";
export default {
  name: "EmailConfirmation",
  data: () => ({
    waitingApiResponse: true,
    showConfirmedAlert: false,
    showErrorAlert: false,
  }),
  computed: {
    confirmationCode: function () {
      return this.$route.params.confirmationCode;
    },
  },
  created() {
    jellytoringApi
      .get(`/api/emailconfirmations/${this.confirmationCode}`)
      .then(() => {
        this.waitingApiResponse = false;
        this.showConfirmedAlert = true;
      })
      .catch(() => {
        this.waitingApiResponse = false;
        this.showErrorAlert = true;
      });
  },
};
</script>
