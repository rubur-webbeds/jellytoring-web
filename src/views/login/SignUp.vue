<template>
  <v-container>
    <v-card class="elevation-12">
      <v-toolbar dark>
        <v-toolbar-title>Sign up form</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form
          @submit.prevent="createUser"
          id="create-user-form"
          v-model="validForm"
        >
          <v-text-field
            v-model="newUser.fullName"
            label="Full Name"
            type="text"
            :rules="[validationRules.required]"
          ></v-text-field>
          <v-text-field
            v-model="newUser.email"
            label="Email"
            type="email"
            :rules="[validationRules.required, validationRules.email]"
          ></v-text-field>
          <v-select
            v-model="newUser.interestId"
            :items="interests"
            item-text="name"
            item-value="id"
            label="Interest"
            :rules="[validationRules.required]"
          ></v-select>
          <v-select
            v-model="newUser.countryCode"
            :items="countries"
            item-text="countryName"
            item-value="countryCode"
            label="Country"
            :rules="[validationRules.required]"
          ></v-select>
          <v-text-field
            v-model="newUser.institution"
            label="Institution"
            type="text"
            :rules="[validationRules.required]"
          ></v-text-field>
          <v-text-field
            v-model="newUser.password"
            label="Password"
            type="password"
            :rules="[validationRules.required]"
          ></v-text-field>
          <v-text-field
            v-model="newUser.repeatPassword"
            label="Repeat Password"
            type="password"
            :rules="[
              newUser.password === newUser.repeatPassword ||
                'Passwords must match',
              validationRules.required,
            ]"
            required
          ></v-text-field>
          <v-checkbox
            v-model="newUser.grantContactInfoPermission"
            :readonly="true"
          >
            <template v-slot:label>
              Grant access to your contact information
            </template>
          </v-checkbox>
          <v-checkbox v-model="newUser.grantUibPermission" :readonly="true">
            <template v-slot:label>
              Grant UIB access to the provided multimedia for academic use
            </template>
          </v-checkbox>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-alert
          v-if="this.errorCreatingUser"
          color="red"
          dense
          dismissible
          outlined
          type="error"
        >
          Oops! Something went wrong
        </v-alert>
        <v-spacer></v-spacer>
        <v-btn
          :loading="waitingApiResponse"
          type="submit"
          form="create-user-form"
          :disabled="!validForm"
        >
          Create account</v-btn
        >
      </v-card-actions>
    </v-card>

    <v-dialog v-model="showResponseDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>Almost there!</v-card-title>
        <v-card-text>
          Check your inbox. We've sent a confirmation email to
          <strong>{{ this.newUser.email }}</strong>
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
import authService from "@/services/authService.js";
import { jellytoringApi } from "@/services/jellytoringApi.js";

export default {
  name: "SignUp",
  data: () => ({
    interests: [],
    countries: [],
    newUser: {
      fullName: "",
      email: "",
      interestId: 0,
      countryCode: "",
      institution: "",
      password: "",
      repeatPassword: "",
      grantContactInfoPermission: true,
      grantUibPermission: true,
    },
    validationRules: {
      required: (value) => !!value || "This field is required",
      email: (value) => {
        const pattern =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "Invalid e-mail";
      },
    },
    validForm: false,
    showResponseDialog: false,
    errorCreatingUser: false,
    waitingApiResponse: false,
  }),
  created() {
    jellytoringApi
      .get("api/countries")
      .then((res) => (this.countries = res.data));
    jellytoringApi
      .get("api/interests")
      .then((res) => (this.interests = res.data));
  },
  methods: {
    async createUser() {
      this.waitingApiResponse = true;
      try {
        await authService.register(this.newUser);
        this.showResponseDialog = true;
        this.waitingApiResponse = false;
      } catch (error) {
        this.errorCreatingUser = true;
        this.waitingApiResponse = false;
      }
    }
  },
};
</script>