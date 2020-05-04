<template>
  <!-- Used when user is also author -->
  <span v-if="canModify">
    <b-button
      :to="editVenueLink"
      variant="outline-secondary"
      size="sm"
      class="mr-2"
    >
      <i class="ion-edit"></i> <span>&nbsp;Edit Venue</span>
    </b-button>
    <b-button @click="deleteVenue" variant="outline-danger" size="sm">
      <i class="ion-trash-a"></i> <span>&nbsp;Delete Venue</span>
    </b-button>
  </span>
  <!-- Used in VenueView when not author -->
  <span v-else>
    <b-button
      variant="outline-secondary"
      size="sm"
      @click="toggleFollow"
      class="mr-2 mt-2"
    >
      <i class="ion-plus-round"></i> <span>&nbsp;</span>
      <span v-text="followUserLabel" />
    </b-button>
    <b-button
      size="sm"
      @click="toggleFavorite"
      class="mt-2"
      :variant="toggleFavoriteButtonVariants"
    >
      <i class="ion-heart"></i> <span>&nbsp;</span>
      <span v-text="favoriteVenueLabel" /> <span>&nbsp;</span>
      <span class="counter" v-text="favoriteCounter" />
    </b-button>
  </span>
</template>

<script>
import { mapGetters } from "vuex";
import {
  FAVORITE_ADD,
  FAVORITE_REMOVE,
  VENUE_DELETE,
  FETCH_PROFILE_FOLLOW,
  FETCH_PROFILE_UNFOLLOW
} from "@/store/actions.type";

export default {
  name: "VenueActions",
  props: {
    venue: { type: Object, required: true },
    canModify: { type: Boolean, required: true }
  },
  computed: {
    ...mapGetters(["profile", "isAuthenticated"]),
    editVenueLink() {
      return { name: "venue-edit", params: { slug: this.venue.slug } };
    },
    toggleFavoriteButtonVariants() {
      return this.venue.favorited ? "secondary" : "outline-secondary";
    },
    followUserLabel() {
      return `${this.profile.following ? "Unfollow" : "Follow"} ${
        this.venue.author.username
      }`;
    },
    favoriteVenueLabel() {
      return this.venue.favorited ? "Unfavorite Venue" : "Favorite Venue";
    },
    favoriteCounter() {
      return `(${this.venue.favoritesCount})`;
    }
  },
  methods: {
    toggleFavorite() {
      if (!this.isAuthenticated) {
        this.$router.push({ name: "login" });
        return;
      }
      const action = this.venue.favorited ? FAVORITE_REMOVE : FAVORITE_ADD;
      this.$store.dispatch(action, this.venue.slug);
    },
    toggleFollow() {
      if (!this.isAuthenticated) {
        this.$router.push({ name: "login" });
        return;
      }
      const action = this.venue.following
        ? FETCH_PROFILE_UNFOLLOW
        : FETCH_PROFILE_FOLLOW;
      this.$store.dispatch(action, {
        username: this.profile.username
      });
    },
    async deleteVenue() {
      try {
        await this.$store.dispatch(VENUE_DELETE, this.venue.slug);
        this.$router.push("/");
      } catch (err) {
        console.error(err);
      }
    }
  }
};
</script>
