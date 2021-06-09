<template>
  <v-app>
    <v-app-bar app dark>
      <div class="d-flex align-center">Jellytoring</div>

      <v-spacer></v-spacer>

      <v-btn text to="login">Sign in</v-btn>
      <v-btn text to="signup">Sign up</v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>
