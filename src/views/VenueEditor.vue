<template>
  <b-container class="bv-example-row">
    <b-row align-h="center" class="my-5">
      <b-col sm="12" md="10" offset-md="1">
        <b-card class="p-3">
          <ListErrors :errors="errors" />
          <h3 class="mb-4">Venue Editor</h3>
          <b-form @submit.prevent="onPublish(venue.slug)">
            <b-form-group
              id="input-group-1"
              label="Venu name"
              label-for="input-1"
              description="Name of the venue that you are creating."
            >
              <b-form-input
                id="input-1"
                v-model="venue.name"
                type="text"
                required
                trim
                placeholder="Venue name"
                :disabled="inProgress"
                @focus="formEdited"
              >
              </b-form-input>
            </b-form-group>
            <b-form-group
              id="input-group-2"
              label="Venue location"
              label-for="input-2"
              description="Venue Location description."
            >
              <b-form-input
                id="input-2"
                v-model="venue.description"
                type="text"
                required
                trim
                placeholder="Enter venue location!"
                :disabled="inProgress"
                @focus="formEdited"
              >
              </b-form-input>
            </b-form-group>
            <b-form-group
              id="input-group-3"
              label="Enter venue capacity"
              label-for="input-3"
              description="Capacity of the venue."
            >
              <b-form-input
                id="input-3"
                v-model="venue.capacity"
                type="text"
                required
                trim
                placeholder="Number of places!"
                :disabled="inProgress"
                @focus="formEdited"
              >
              </b-form-input>
            </b-form-group>
            <b-form-group
              id="input-group-4"
              label="venue Details"
              label-for="input-4"
              description="Write more interesting details about your venue."
            >
              <b-form-textarea
                id="input-4"
                v-model="venue.details"
                type="text"
                rows="8"
                required
                trim
                placeholder="History of the Venue"
                :disabled="inProgress"
                @focus="formEdited"
              >
              </b-form-textarea>
            </b-form-group>
            <b-form-group
              id="input-group-6"
              label="Venue Tags"
              label-for="input-6"
              description="Type in a tag. Press enter after typing the tag."
            >
              <b-form-input
                id="input-6"
                v-model="tagInput"
                type="text"
                placeholder="Big venue"
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
                  v-for="(tag, index) of venue.tagList"
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
              Publish Venue
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
  VENUE_PUBLISH,
  VENUE_EDIT,
  FETCH_VENUE,
  VENUE_EDIT_ADD_TAG,
  VENUE_EDIT_REMOVE_TAG,
  VENUE_RESET_STATE
} from "@/store/actions.type";
import { LOADING_START, LOADING_FINISH } from "@/store/mutations.type";

export default {
  name: "VenueEdit",
  components: { ListErrors },
  props: {
    previousVenue: {
      type: Object,
      required: false
    }
  },
  async beforeRouteUpdate(to, from, next) {
    // Reset state if user goes from /editor/:id to /editor
    // The component is not recreated so we use to hook to reset the state.
    await store.dispatch(VENUE_RESET_STATE);
    return next();
  },
  async beforeRouteEnter(to, from, next) {
    store.commit(LOADING_START);
    // SO: https://github.com/vuejs/vue-router/issues/1034
    // If we arrive directly to this url, we need to fetch the venue
    await store.dispatch(VENUE_RESET_STATE);
    if (to.params.slug !== undefined) {
      await store.dispatch(
        FETCH_VENUE,
        to.params.slug,
        to.params.previousVenue
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
    await store.dispatch(VENUE_RESET_STATE);
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
    ...mapGetters(["venue"])
  },
  methods: {
    async onPublish(slug) {
      const action = slug ? VENUE_EDIT : VENUE_PUBLISH;
      this.showExitDialog = false; // Exiting the route. Don't show confirmation dialog.
      this.inProgress = true;
      try {
        const { data } = await this.$store.dispatch(action);
        this.inProgress = false;
        // await this.$store.dispatch(VENUE_RESET_STATE);
        this.$router.push({
          name: "venue",
          params: { slug: data.venue.slug }
        });
      } catch (error) {
        console.log(error);
        const { response } = error;
        this.inProgress = false;
        this.errors = response.data.errors;
      }
    },
    removeTag(tag) {
      this.$store.dispatch(VENUE_EDIT_REMOVE_TAG, tag);
    },
    addTag(tag) {
      this.$store.dispatch(VENUE_EDIT_ADD_TAG, tag);
      this.tagInput = null;
    },
    formEdited() {
      this.showExitDialog = true;
    }
  }
};
</script>
