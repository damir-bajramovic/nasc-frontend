<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <ListErrors :errors="errors" />
          <form v-on:submit.prevent="onPublish(event.slug);">
            <fieldset :disabled="inProgress">
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  v-model="event.title"
                  placeholder="Event Title"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  v-model="event.description"
                  placeholder="What's this event about? Write a catchy short description."
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  v-model="event.stream"
                  placeholder="Event stream name."
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  v-model="event.body"
                  placeholder="Write more interesting things about your event."
                >
                </textarea>
              </fieldset>
              <fieldset class="form-group">
                <input 
                  v-model.number="event.price" 
                  type="number" 
                  class="form-control"
                  step="0.01"
                  placeholder="Price in dollars"> <!-- TODO: Validation. Can I send request that is not rounded to 2 decimals? Check on server as well. -->
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Type in the tag. Press enter after inputing the tag."
                  v-model="tagInput"
                  v-on:keypress.enter.prevent="addTag(tagInput);"
                />
                <div class="tag-list">
                  <span
                    class="tag-default tag-pill"
                    v-for="(tag, index) of event.tagList"
                    :key="tag + index"
                  >
                    <i class="ion-close-round" v-on:click="removeTag(tag);">
                    </i>
                    {{ tag }}
                  </span>
                </div>
              </fieldset>
            </fieldset>
            <button
              :disabled="inProgress"
              class="btn btn-lg pull-xs-right btn-primary"
              type="submit"
            >
              Publish Event
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import store from "@/store";
import ListErrors from "@/components/ListErrors";
import {
  EVENT_PUBLISH,
  EVENT_EDIT,
  FETCH_EVENT,
  EVENT_EDIT_ADD_TAG,
  EVENT_EDIT_REMOVE_TAG,
  EVENT_RESET_STATE
} from "@/store/actions.type";

export default {
  name: "EventEdit",
  components: { ListErrors },
  props: {
    previousEvent: {
      type: Object,
      required: false
    }
  },
  async beforeRouteUpdate(to, from, next) {
    // Reset state if user goes from /editor/:id to /editor
    // The component is not recreated so we use to hook to reset the state.
    await store.dispatch(EVENT_RESET_STATE);
    return next();
  },
  async beforeRouteEnter(to, from, next) {
    // SO: https://github.com/vuejs/vue-router/issues/1034
    // If we arrive directly to this url, we need to fetch the event
    await store.dispatch(EVENT_RESET_STATE);
    if (to.params.slug !== undefined) {
      await store.dispatch(
        FETCH_EVENT,
        to.params.slug,
        to.params.previousEvent
      );
    }
    return next();
  },
  async beforeRouteLeave(to, from, next) {
    await store.dispatch(EVENT_RESET_STATE);
    next();
  },
  data() {
    return {
      tagInput: null,
      inProgress: false,
      errors: {}
    };
  },
  computed: {
    ...mapGetters(["event"])
  },
  methods: {
    onPublish(slug) {
      let action = slug ? EVENT_EDIT : EVENT_PUBLISH;
      this.inProgress = true;
      this.$store
        .dispatch(action)
        .then(({ data }) => {
          this.inProgress = false;
          this.$router.push({
            name: "event",
            params: { slug: data.event.slug }
          });
        })
        .catch(({ response }) => {
          this.inProgress = false;
          this.errors = response.data.errors;
        });
    },
    removeTag(tag) {
      this.$store.dispatch(EVENT_EDIT_REMOVE_TAG, tag);
    },
    addTag(tag) {
      this.$store.dispatch(EVENT_EDIT_ADD_TAG, tag);
      this.tagInput = null;
    }
  }
};
</script>
