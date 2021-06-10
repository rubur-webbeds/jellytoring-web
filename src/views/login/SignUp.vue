<template>
  <v-container>
    <v-card class="elevation-12">
      <v-toolbar dark>
        <v-toolbar-title>Sign up form</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form>
          <v-text-field
            name="name"
            label="Full Name"
            type="text"
          ></v-text-field>
          <v-text-field name="email" label="Email" type="email"></v-text-field>
          <v-select :items="interests" label="Interest"></v-select>
          <v-country-select v-model="country" />
          <v-text-field label="Institution" type="text"></v-text-field>
          <v-text-field
            name="password"
            label="Contraseña"
            type="password"
          ></v-text-field>
          <v-text-field
            name="password"
            label="Repeat Password"
            type="password"
          ></v-text-field>
          <v-checkbox v-model="checkbox">
            <template v-slot:label>
              Grant access to the uploaded images
            </template>
          </v-checkbox>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <GoogleLogin
          :params="params"
          :renderParams="renderParams"
          :onSuccess="onSuccess"
          :onFailure="onFailure"
        ></GoogleLogin>
        <GoogleLogin :params="params" :logoutButton="true">Logout</GoogleLogin>
        <v-btn to="/">Create account</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import GoogleLogin from "vue-google-login";
export default {
  name: "SignUp",
  components: {
    GoogleLogin,
  },
  data: () => ({
    interests: ["Científico", "Divulgativo", "Educación", "Otros"],
    country: "",
    checkbox: false,
    params: {
      client_id:
        "506237789723-mmco8u4jd0raiufch657j2ivu3ip8vbb.apps.googleusercontent.com",
    },
    renderParams: {
      width: 250,
      height: 50,
      longtitle: true,
    },
  }),
  methods: {
    onSuccess(idToken) {
      // Receive the idToken and make your magic with the backend
      console.log(idToken);
    },
    onFailure(error) {
      console.log(error);
    },
  },
};
</script>