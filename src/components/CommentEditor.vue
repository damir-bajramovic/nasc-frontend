<template>
  <div>
    <list-errors :errors="errors"> </list-errors>
    <validation-observer v-slot="{ invalid }">
      <b-form @submit.prevent="onSubmit(slug, comment)">
        <b-card no-body>
          <validation-provider rules="limit-length">
            <b-form-textarea
              v-model="comment"
              placeholder="Write a comment..."
              rows="3"
              required
            ></b-form-textarea>
            <div class="m-1 d-flex flex-column">
              <small class="ml-auto form-text" :class="commentMessageTextColor"
                >{{ comment.length }}/200</small
              >
            </div>
          </validation-provider>
          <b-card-footer>
            <div
              class="d-flex justify-content-between align-items-center flex-wrap"
            >
              <img :src="userImage" class="comment-author-img mr-1" />
              <b-button
                size="sm"
                variant="info"
                type="submit"
                :disabled="invalid"
                >Post Comment</b-button
              >
            </div>
          </b-card-footer>
        </b-card>
      </b-form>
    </validation-observer>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { extend } from "vee-validate";

import { COMMENT_CREATE } from "@/store/actions.type.js";

export default {
  name: "CommentEditor",
  components: {
    ValidationProvider,
    ValidationObserver
  },
  props: {
    slug: { type: String, required: true },
    content: { type: String, required: false },
    userImage: { type: String, required: false }
  },
  data() {
    return {
      comment: this.content || "",
      errors: {}
    };
  },
  methods: {
    onSubmit(slug, comment) {
      this.$store
        .dispatch(COMMENT_CREATE, { slug, comment })
        .then(() => {
          this.comment = "";
          this.errors = {};
        })
        .catch(({ response }) => {
          this.errors = response.data.errors;
        });
    }
  },
  computed: {
    commentMessageTextColor() {
      return this.comment.length <= 200 ? "text-muted" : "text-danger";
    }
  }
};

extend("limit-length", {
  validate(value) {
    return value.length != 0 && value.length < 200;
  },
  message: "Exceeded maximum number of 200 characters."
});
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
