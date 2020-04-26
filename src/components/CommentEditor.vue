<template>
  <div>
    <list-errors :errors="errors"> </list-errors>
    <b-form @submit.prevent="onSubmit(slug, comment)">
      <b-card no-body>
        <b-form-textarea
          v-model="comment"
          placeholder="Write a comment..."
          rows="3"
        ></b-form-textarea>
        <b-card-footer>
          <div class="d-flex justify-content-between align-items-center flex-wrap">
            <img :src="userImage" class="comment-author-img mr-1" />
            <b-button size="sm" variant="info" type="submit">Post Comment</b-button>
          </div>
        </b-card-footer>
      </b-card>
    </b-form>
  </div>
</template>

<script>
import ListErrors from "./ListErrors.vue";
import { COMMENT_CREATE } from "../store/actions.type.js";

export default {
  name: "CommentEditor",
  components: { ListErrors },
  props: {
    slug: { type: String, required: true },
    content: { type: String, required: false },
    userImage: { type: String, required: false }
  },
  data() {
    return {
      comment: this.content || null,
      errors: {}
    };
  },
  methods: {
    onSubmit(slug, comment) {
      this.$store
        .dispatch(COMMENT_CREATE, { slug, comment })
        .then(() => {
          this.comment = null;
          this.errors = {};
        })
        .catch(({ response }) => {
          this.errors = response.data.errors;
        });
    }
  }
};
</script>

<style scoped>
.comment-author-img {
  display: inline-block;
  vertical-align: middle;
  height: 20px;
  width: 20px;
  border-radius: 30px;
}
</style>