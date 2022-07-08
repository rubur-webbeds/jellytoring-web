<template>
  <v-app>
    <v-app-bar app dark>
      <v-icon large @click="redirectTo('/dashboard')">mdi-jellyfish</v-icon>
      <div
        class="text-h4 ml-3 active pointer"
        v-text="this.title"
        @click="redirectTo('/dashboard')"
      ></div>
      <div
        v-if="this.$router.currentRoute.path.includes('admin')"
        class="text-h8 ml-3 mt-3"
        v-text="this.adminPanelPlaceholder"
      ></div>

      <v-spacer></v-spacer>
      <template v-if="!this.isUserLogged()">
        <!-- <v-btn text outlined @click="showUploadForm = true">
          <v-icon>mdi-plus</v-icon>
        </v-btn> -->
        <v-btn text to="login">Sign in</v-btn>
        <v-btn text outlined to="signup">Sign up</v-btn>
      </template>
      <template v-else>
        <v-menu bottom min-width="200px" rounded offset-y>
          <template v-slot:activator="{ on }">
            <v-btn icon x-large v-on="on">
              <v-avatar color="purple" size="38">
                <span class="white--text text-h5">{{ user.firstInitial }}</span>
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-list-item-content class="justify-center">
              <div class="mx-auto text-center">
                <v-avatar color="purple" size="48">
                  <span class="white--text text-h5">{{
                    user.firstInitial
                  }}</span>
                </v-avatar>
                <h3>{{ user.full_name }}</h3>
                <p class="text-caption mt-1">
                  {{ user.email }}
                </p>
                <div v-if="user.roleCode == 'ADM'">
                  <v-divider class="my-3"></v-divider>
                  <v-btn depressed rounded text @click="redirectTo('admin/pending')">
                    Admin panel
                  </v-btn>
                </div>
                <v-divider class="my-3"></v-divider>
                <v-btn depressed rounded text @click="logout()">
                  Sign out
                </v-btn>
              </div>
            </v-list-item-content>
          </v-card>
        </v-menu>
      </template>
    </v-app-bar>

    <v-main>
      <div class="text-center mt-8" v-if="this.showLoading">
        <v-progress-circular
          indeterminate
        ></v-progress-circular>
      </div>
      <div v-else>
        <router-view />
      </div>
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
    title: "Jellytoring",
    adminPanelPlaceholder: "Admin Panel",
    user: null,
    showLoading: false,
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
    async redirectTo(url) {
      this.showLoading = true;
      await new Promise(r => setTimeout(r, 1000));
      this.showLoading = false;
      this.$router.push(url);
    },
  },
  created() {
    document.title = this.title;
    this.getUserLogged();
  },
  watch: {
    $route: "getUserLogged",
  },
};
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
