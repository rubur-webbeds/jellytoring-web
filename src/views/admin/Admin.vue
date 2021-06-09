<template>
  <div>
    <v-navigation-drawer app permanent expand-on-hover>
      <v-list nav dense>
        <v-list-item-group>
          <v-list-item
            v-for="nav in navigations"
            link
            :to="{ name: nav.to }"
            :key="nav.title"
          >
            <v-list-item-icon>
              <v-icon>{{ nav.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ nav.title }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "Admin",
  data: () => ({
    navigations: [
      { title: "Users", to: "manageUsers", icon: "mdi-account-group" },
      { title: "Activity", to: "activity", icon: "mdi-history" },
    ],
  }),
};
</script>
