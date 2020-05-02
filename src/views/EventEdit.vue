<template>
  <b-container class="bv-example-row">
    <b-row align-h="center" class="my-5">
      <b-col sm="12" md="10" offset-md="1">
        <b-card class="p-3">
          <ListErrors :errors="errors" />
          <h3 class="mb-4">Event Editor</h3>
          <b-form @submit.prevent="onPublish(event.slug)">
            <b-form-group
              id="input-group-1"
              label="Event Title"
              label-for="input-1"
              description="Title of the event that you are creating."
            >
              <b-form-input
                id="input-1"
                v-model="event.title"
                type="text"
                required
                trim
                placeholder="Big Bad Event"
                :disabled="inProgress"
                @focus="formEdited"
              >
              </b-form-input>
            </b-form-group>
            <b-form-group
              id="input-group-2"
              label="Event Description"
              label-for="input-2"
              description="What's this event about? Write a short description."
            >
              <b-form-input
                id="input-2"
                v-model="event.description"
                type="text"
                required
                trim
                placeholder="See Big Bad Gladiators clash! Only in the Big Bad Event!"
                :disabled="inProgress"
                @focus="formEdited"
              >
              </b-form-input>
            </b-form-group>
            <b-form-group
              id="input-group-3"
              label="Event Stream Name"
              label-for="input-3"
              description="Name of the Stream created on our Servers."
            >
              <b-form-input
                id="input-3"
                v-model="event.stream"
                type="text"
                required
                trim
                placeholder="BigBadEvent-1"
                :disabled="inProgress"
                @focus="formEdited"
              >
              </b-form-input>
            </b-form-group>
            <b-form-group
              id="input-group-4"
              label="Event Details"
              label-for="input-4"
              description="Write more interesting details about your event."
            >
              <b-form-textarea
                id="input-4"
                v-model="event.body"
                type="text"
                rows="8"
                required
                trim
                placeholder="Big Bad Event is happening at X. Y is finally clashing with Z in W arena."
                :disabled="inProgress"
                @focus="formEdited"
              >
              </b-form-textarea>
            </b-form-group>
            <b-form-group
              id="input-group-5"
              label="Event Price"
              label-for="input-5"
              description="Price in US Dollars."
            >
              <b-form-input
                id="input-5"
                v-model="event.price"
                type="number"
                step="0.01"
                required
                no-wheel
                placeholder="Big Bad Event"
                :disabled="inProgress"
                @focus="formEdited"
              >
              </b-form-input>
            </b-form-group>
            <b-form-group
              id="input-group-6"
              label="Event Tags"
              label-for="input-6"
              description="Type in a tag. Press enter after typing the tag."
            >
              <b-form-input
                id="input-6"
                v-model="tagInput"
                type="text"
                placeholder="BigBadEvent"
                :disabled="inProgress"
                @keypress.enter.prevent="addTag(tagInput)"
                @focus="formEdited"
              >
              </b-form-input>
            </b-form-group>
            <fieldset :disabled="inProgress">
              <div class="tag-list mb-3">
                <span
                  class="tag-default tag-pill"
                  v-for="(tag, index) of event.tagList"
                  :key="tag + index"
                >
                  <i class="ion-close-round" @click="removeTag(tag)"></i>
                  {{ tag }}
                </span>
              </div>
            </fieldset>
            <b-button
              :disabled="inProgress"
              size="lg"
              variant="info"
              type="submit"
            >
              Publish Event
            </b-button>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
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
import { LOADING_START, LOADING_FINISH } from "@/store/mutations.type";

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
    store.commit(LOADING_START);
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
  mounted() {
    store.commit(LOADING_FINISH);
  },
  async beforeRouteLeave(to, from, next) {
    if (
      this.showExitDialog &&
      !confirm("Are you sure you want to leave this page?")
    ) {
      return next(false);
    }
    await store.dispatch(EVENT_RESET_STATE);
    next();
  },
  data() {
    return {
      tagInput: null,
      inProgress: false,
      showExitDialog: false,
      errors: {}
    };
  },
  computed: {
    ...mapGetters(["event"])
  },
  methods: {
    async onPublish(slug) {
      const action = slug ? EVENT_EDIT : EVENT_PUBLISH;
      this.showExitDialog = false; // Exiting the route. Don't show confirmation dialog.
      this.inProgress = true;
      try {
        const { data } = await this.$store.dispatch(action);
        this.inProgress = false;
        // await this.$store.dispatch(EVENT_RESET_STATE);
        this.$router.push({
          name: "event",
          params: { slug: data.event.slug }
        });
      } catch (error) {
        console.log(error);
        const { response } = error;
        this.inProgress = false;
        this.errors = response.data.errors;
      }
    },
    removeTag(tag) {
      this.$store.dispatch(EVENT_EDIT_REMOVE_TAG, tag);
    },
    addTag(tag) {
      this.$store.dispatch(EVENT_EDIT_ADD_TAG, tag);
      this.tagInput = null;
    },
    formEdited() {
      this.showExitDialog = true;
    }
  }
};
</script>
