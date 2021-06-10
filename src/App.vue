<template>
  <v-app>
    <v-app-bar app dark>
      <v-icon large>mdi-jellyfish</v-icon>
      <h2 class="ml-3">Jellytoring</h2>

      <v-spacer></v-spacer>

      <v-btn text outlined @click="showUploadForm = true">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn text to="login">Sign in</v-btn>
      <v-btn text outlined to="signup">Sign up</v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <Upload :show.sync="showUploadForm" />
  </v-app>
</template>

<script>
import Upload from './views/Upload.vue'
export default {
  name: "App",
  components: {
    Upload,
  },
  data: () => ({
    showUploadForm: false,
  }),
};
</script>
