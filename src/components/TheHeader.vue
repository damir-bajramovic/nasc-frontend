<template>
  <b-navbar toggleable="lg" type="dark" variant="info">
    <b-navbar-brand :to="{ name: 'home' }">NASC Inc.</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav v-if="!isAuthenticated" class="ml-auto">
        <b-nav-item :to="{ name: 'home' }">Home</b-nav-item>
        <b-nav-item :to="{ name: 'login' }">Login</b-nav-item>
        <b-nav-item :to="{ name: 'register' }">Register</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav v-else class="ml-auto">
        <b-nav-item :to="{ name: 'home' }">Home</b-nav-item>
        <b-nav-item :to="{ name: 'event-edit' }"
          ><i class="ion-compose"></i>&nbsp;New Event</b-nav-item
        >
        <b-nav-item exact :to="{ name: 'settings' }"
          ><i class="ion-gear-a"></i>&nbsp;Settings</b-nav-item
        >
        <b-nav-item
          exact
          :to="{
            name: 'profile',
            params: { username: currentUser.username }
          }"
          >{{ currentUser.username }}</b-nav-item
        >
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <!-- TODO: Implement the search functionality. -->
      <!-- <b-navbar-nav class="ml-1" v-if="isAuthenticated">
        <b-nav-form>
          <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
          <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
        </b-nav-form>
      </b-navbar-nav> -->
    </b-collapse>
  </b-navbar>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Header",
  computed: {
    ...mapGetters(["currentUser", "isAuthenticated"])
  }
};
</script>
