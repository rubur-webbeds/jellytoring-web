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
        <!-- <v-menu bottom
      offset-y :nudge-width="200">
          <template v-slot:activator="{ on, attrs }">
            <v-avatar color="purple" size="36" v-bind="attrs" v-on="on">
              <span class="white--text text-h5">{{
                getUserCapitalLetter()
              }}</span>
            </v-avatar>
          </template>

          <v-list>
            <v-list-item>
              <v-list-item-title @click="logout()">Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu> -->
        <v-menu bottom min-width="200px" rounded offset-y>
          <template v-slot:activator="{ on }">
            <v-btn icon x-large v-on="on">
              <v-avatar color="purple" size="38">
                <span class="white--text text-h5">{{
                  getUserCapitalLetter()
                }}</span>
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-list-item-content class="justify-center">
              <div class="mx-auto text-center">
                <v-avatar color="purple" size="48">
                  <span class="white--text text-h5">{{
                    getUserCapitalLetter()
                  }}</span>
                </v-avatar>
                <h3>{{ user.full_name }}</h3>
                <p class="text-caption mt-1">
                  {{ user.email }}
                </p>
                <v-divider class="my-3"></v-divider>
                <!-- <v-btn
                depressed
                rounded
                text
              >
                Edit Account
              </v-btn> -->
                <!-- <v-divider class="my-3"></v-divider> -->
                <v-btn depressed rounded text @click="logout()"> Sign out </v-btn>
              </div>
            </v-list-item-content>
          </v-card>
        </v-menu>
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
import Upload from "./views/Upload.vue";

export default {
  name: "App",
  components: {
    Upload,
  },
  data: () => ({
    showUploadForm: false,
    user: null,
  }),
  methods: {
    isUserLogged() {
      return authService.isUserLogged();
    },
    logout() {
      authService.logout();
      this.$router.push("/login");
    },
    getUserLogged() {
      this.user = authService.getUserLogged();
    },
    getUserCapitalLetter() {
      return this.user.full_name.split("")[0].toUpperCase();
    },
  },
  created() {
    document.title = "Jellytoring";
    this.getUserLogged();
  },
};
</script>
