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
        <b-nav-item :to="{ name: 'event-edit' }" v-if="isAdmin"
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
        <b-nav-form>
          <b-button
            type="button"
            size="sm"
            variant="secondary"
            @click="logout"
            class="inline"
            >Log Out
          </b-button>
        </b-nav-form>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { mapGetters } from "vuex";
import { LOGOUT } from "@/store/actions.type";

export default {
  name: "Header",
  computed: {
    ...mapGetters(["currentUser", "isAuthenticated", "isAdmin"])
  },
  methods: {
    logout() {
      this.$store.dispatch(LOGOUT).then(() => {
        this.$router.push("/");
      });
    }
  }
};
</script>
