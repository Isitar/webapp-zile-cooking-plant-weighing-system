<template>
  <v-app>
    <v-app-bar
        app
        color="primary"
        dark
        dense
    >
      <v-app-bar-nav-icon
          @click="$router.push({name: 'Home'})"

      >
        <v-icon>mdi-home</v-icon>
      </v-app-bar-nav-icon>


      <v-app-bar-title>
        Zile Bonbons AG
      </v-app-bar-title>
      <v-spacer />
      <span>
      Kochanlagen-Wägesystem</span>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',

  data: () => ({
    //
  }),
});
</script>
