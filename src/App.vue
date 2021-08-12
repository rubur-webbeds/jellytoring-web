<template>
  <v-app>
    <v-app-bar app dark>
      <v-icon large>mdi-jellyfish</v-icon>
      <h2 class="ml-3">Jellytoring</h2>

      <v-spacer></v-spacer>

      <template v-if="!this.isUserLogged()">
        <v-btn text outlined @click="showUploadForm = true">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn text to="login">Sign in</v-btn>
        <v-btn text outlined to="signup">Sign up</v-btn>
      </template>
      <template v-else>
        <v-avatar color="purple" size="36">
          <span class="white--text text-h5">{{ this.getUserCapitalLetter() }}</span>
        </v-avatar>
      </template>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <Upload :show.sync="showUploadForm" />
  </v-app>
</template>

<script>
import authService from "@/services/authService.js";
import Upload from './views/Upload.vue'

export default {
  name: "App",
  components: {
    Upload,
  },
  data: () => ({
    showUploadForm: false,
  }),
  methods: {
    isUserLogged() {
      return authService.isUserLogged();
    },
    getUserCapitalLetter() {
      // TODO: improve logic and syntax sugar
      return authService.getUserLogged().full_name.split("")[0].toUpperCase();
    },
  }
};
</script>
