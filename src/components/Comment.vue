<template>
  <div>
    <b-card no-body class="my-2">
      <b-card-body>
        <b-card-text>
          {{ comment.body }}
        </b-card-text>
      </b-card-body>
      <b-card-footer>
        <router-link
          class="comment-author"
          :to="{
            name: 'profile',
            params: { username: comment.author.username }
          }"
        >
          <img :src="comment.author.image" class="comment-author-img mr-1" />
        </router-link>
        <router-link
          class="comment-author"
          :to="{
            name: 'profile',
            params: { username: comment.author.username }
          }"
        >
          {{ comment.author.username }}
        </router-link>
        <span class="date-posted">{{ comment.createdAt | date }}</span>
        <span v-if="isCurrentUser" class="mod-options">
          <i class="ion-trash-a" v-on:click="destroy(slug, comment.id)"></i>
        </span>
      </b-card-footer>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { COMMENT_DESTROY } from "@/store/actions.type";

export default {
  name: "Comment",
  props: {
    slug: { type: String, required: true },
    comment: { type: Object, required: true }
  },
  computed: {
    isCurrentUser() {
      if (this.currentUser.username && this.comment.author.username) {
        return this.comment.author.username === this.currentUser.username;
      }
      return false;
    },
    ...mapGetters(["currentUser"])
  },
  methods: {
    destroy(slug, commentId) {
      this.$store.dispatch(COMMENT_DESTROY, { slug, commentId });
    }
  }
};
</script>

<style>
.comment-author-img {
  display: inline-block;
  vertical-align: middle;
  height: 20px;
  width: 20px;
  border-radius: 30px;
}

.comment-author {
  display: inline-block;
  vertical-align: middle;
}

.date-posted {
  display: inline-block;
  vertical-align: middle;
  margin-left: 5px;
  color: #bbb;
}

.mod-options {
  float: right;
  color: #333;
  font-size: 1rem;
}
</style>
