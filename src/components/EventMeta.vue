<template>
  <div class="event-meta">
    <div class="d-flex justify-content-between align-items-center flex-wrap">
      <div>
        <router-link
          :to="{ name: 'profile', params: { username: event.author.username } }"
        >
          <img :src="event.author.image" />
        </router-link>
        <div class="info">
          <router-link
            :to="{
              name: 'profile',
              params: { username: event.author.username }
            }"
            class="author"
          >
            {{ event.author.username }}
          </router-link>
          <span class="date">{{ event.createdAt | date }}</span>
        </div>
      </div>
      <template v-if="actions">
        <event-actions
          :event="event"
          :canModify="isCurrentUser()"
        ></event-actions>
      </template>
      <template v-else>
        <b-button
          size="sm"
          v-if="!actions"
          v-on:click="toggleFavorite"
          :class="{
            'btn-info': event.favorited,
            'btn-outline-info': !event.favorited
          }"
        >
          <i class="ion-heart"></i>
          <span class="counter"> {{ event.favoritesCount }} </span>
        </b-button>
      </template>
    </div>
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

<style scoped>
.event-meta {
  display: block;
  position: relative;
  font-weight: 300;
}
.event-meta img {
  display: inline-block;
  vertical-align: middle;
  height: 32px;
  width: 32px;
  border-radius: 30px;
}
.event-meta .info {
  margin: 0 1.5rem 0 0.3rem;
  display: inline-block;
  vertical-align: middle;
  line-height: 1rem;
}
.event-meta .info .author {
  display: block;
  font-weight: 500 !important;
}
.event-meta .info .date {
  color: #bbb;
  font-size: 0.8rem;
  display: block;
}
</style>
