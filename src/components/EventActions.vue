<template>
  <!-- Used when user is also author -->
  <span v-if="canModify">
    <b-button
      :to="editEventLink"
      variant="outline-secondary"
      size="sm"
      class="mr-2"
    >
      <i class="ion-edit"></i> <span>&nbsp;Edit Event</span>
    </b-button>
    <b-button @click="deleteEvent" variant="outline-danger" size="sm">
      <i class="ion-trash-a"></i> <span>&nbsp;Delete Event</span>
    </b-button>
  </span>
  <!-- Used in EventView when not author -->
  <span v-else>
    <b-button
      variant="outline-secondary"
      size="sm"
      @click="toggleFollow"
      class="mr-2"
    >
      <i class="ion-plus-round"></i> <span>&nbsp;</span>
      <span v-text="followUserLabel" />
    </b-button>
    <b-button
      size="sm"
      @click="toggleFavorite"
      :class="toggleFavoriteButtonClasses"
    >
      <i class="ion-heart"></i> <span>&nbsp;</span>
      <span v-text="favoriteEventLabel" /> <span>&nbsp;</span>
      <span class="counter" v-text="favoriteCounter" />
    </b-button>
  </span>
</template>

<script>
import { mapGetters } from "vuex";
import {
  FAVORITE_ADD,
  FAVORITE_REMOVE,
  EVENT_DELETE,
  FETCH_PROFILE_FOLLOW,
  FETCH_PROFILE_UNFOLLOW
} from "@/store/actions.type";

export default {
  name: "EventActions",
  props: {
    event: { type: Object, required: true },
    canModify: { type: Boolean, required: true }
  },
  computed: {
    ...mapGetters(["profile", "isAuthenticated"]),
    editEventLink() {
      return { name: "event-edit", params: { slug: this.event.slug } };
    },
    toggleFavoriteButtonClasses() {
      return {
        "btn-primary": this.event.favorited,
        "btn-outline-primary": !this.event.favorited
      };
    },
    followUserLabel() {
      return `${this.profile.following ? "Unfollow" : "Follow"} ${
        this.event.author.username
      }`;
    },
    favoriteEventLabel() {
      return this.event.favorited ? "Unfavorite Event" : "Favorite Event";
    },
    favoriteCounter() {
      return `(${this.event.favoritesCount})`;
    }
  },
  methods: {
    toggleFavorite() {
      if (!this.isAuthenticated) {
        this.$router.push({ name: "login" });
        return;
      }
      const action = this.event.favorited ? FAVORITE_REMOVE : FAVORITE_ADD;
      this.$store.dispatch(action, this.event.slug);
    },
    toggleFollow() {
      if (!this.isAuthenticated) {
        this.$router.push({ name: "login" });
        return;
      }
      const action = this.event.following
        ? FETCH_PROFILE_UNFOLLOW
        : FETCH_PROFILE_FOLLOW;
      this.$store.dispatch(action, {
        username: this.profile.username
      });
    },
    async deleteEvent() {
      try {
        await this.$store.dispatch(EVENT_DELETE, this.event.slug);
        this.$router.push("/");
      } catch (err) {
        console.error(err);
      }
    }
  }
};
</script>
