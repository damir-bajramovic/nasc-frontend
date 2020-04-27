<template>
  <div>
    <b-container class="bv-example-row">
      <b-row align-h="center" class="my-5">
        <b-col sm="4" md="6" offset-md="3">
          <img :src="profile.image" class="user-img" />
          <h4>{{ profile.username }}</h4>
          <p>{{ profile.bio }}</p>
          <div v-if="isCurrentUser()">
            <b-button
              size="sm"
              variant="outline-secondary"
              class="action-btn"
              :to="{ name: 'settings' }"
            >
              <i class="ion-gear-a"></i> Edit Profile Settings
            </b-button>
          </div>
          <div v-else>
            <b-button
              variant="secondary"
              size="sm"
              class="action-btn"
              v-if="profile.following"
              @click.prevent="unfollow();"
            >
              <i class="ion-plus-round"></i> &nbsp;Unfollow
              {{ profile.username }}
            </b-button>
            <b-button
              variant="outline-secondary"
              size="sm"
              class="action-btn"
              v-if="!profile.following"
              @click.prevent="follow();"
            >
              <i class="ion-plus-round"></i> &nbsp;Follow
              {{ profile.username }}
            </b-button>
          </div>
        </b-col>
      </b-row>
    </b-container>

    <b-container class="bv-example-row">
      <b-row>
        <b-col sm="12" md="10" offset-md="1">
          <b-tabs>
            <b-nav tabs>
              <b-nav-item 
                exact-active-class="active"
                exact
                :to="{ name: 'profile' }"
              >My Events
              </b-nav-item>
              <b-nav-item
                exact-active-class="active"
                exact
                :to="{ name: 'profile-favorites' }"
              >Favorited Events
              </b-nav-item>
            </b-nav>
            <router-view></router-view>
          </b-tabs>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  FETCH_PROFILE,
  FETCH_PROFILE_FOLLOW,
  FETCH_PROFILE_UNFOLLOW
} from "@/store/actions.type";

export default {
  name: "Profile",
  mounted() {
    this.$store.dispatch(FETCH_PROFILE, this.$route.params);
  },
  computed: {
    ...mapGetters(["currentUser", "profile", "isAuthenticated"])
  },
  methods: {
    isCurrentUser() {
      if (this.currentUser.username && this.profile.username) {
        return this.currentUser.username === this.profile.username;
      }
      return false;
    },
    follow() {
      if (!this.isAuthenticated) return;
      this.$store.dispatch(FETCH_PROFILE_FOLLOW, this.$route.params);
    },
    unfollow() {
      this.$store.dispatch(FETCH_PROFILE_UNFOLLOW, this.$route.params);
    }
  },
  watch: {
    $route(to) {
      this.$store.dispatch(FETCH_PROFILE, to.params);
    }
  }
};
</script>

<style>
.user-img {
  width: 100px;
  height: 100px;
  border-radius: 100px;
  margin-bottom: 1rem;
}

.col-centered{
  float: none;
  margin: 0 auto;
}
</style>