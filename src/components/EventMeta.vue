<template>
  <div class="event-meta">
    <router-link
      :to="{ name: 'profile', params: { username: event.author.username } }"
    >
      <img :src="event.author.image" />
    </router-link>
    <div class="info">
      <router-link
        :to="{ name: 'profile', params: { username: event.author.username } }"
        class="author"
      >
        {{ event.author.username }}
      </router-link>
      <span class="date">{{ event.createdAt | date }}</span>
    </div>
    <template v-if="actions">
      <rwv-event-actions
        :event="event"
        :canModify="isCurrentUser()"
      ></rwv-event-actions>
    </template>
    <template v-else>
      <button
        class="btn btn-sm pull-xs-right"
        v-if="!actions"
        v-on:click="toggleFavorite"
        :class="{
          'btn-primary': event.favorited,
          'btn-outline-primary': !event.favorited
        }"
      >
        <i class="ion-heart"></i>
        <span class="counter"> {{ event.favoritesCount }} </span>
      </button>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import EventActions from "@/components/EventActions";
import { FAVORITE_ADD, FAVORITE_REMOVE } from "@/store/actions.type";

export default {
  name: "EventMeta",
  components: {
    EventActions
  },
  props: {
    event: {
      type: Object,
      required: true
    },
    actions: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    ...mapGetters(["currentUser", "isAuthenticated"])
  },
  methods: {
    isCurrentUser() {
      if (this.currentUser.username && this.event.author.username) {
        return this.currentUser.username === this.event.author.username;
      }
      return false;
    },
    toggleFavorite() {
      if (!this.isAuthenticated) {
        this.$router.push({ name: "login" });
        return;
      }
      const action = this.event.favorited ? FAVORITE_REMOVE : FAVORITE_ADD;
      this.$store.dispatch(action, this.event.slug);
    }
  }
};
</script>
