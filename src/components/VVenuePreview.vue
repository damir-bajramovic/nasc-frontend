<template>
  <div class="venue-preview">
    <b-card no-body>
      <b-card-header>
        <VenueMeta isPreview :venue="venue" />
      </b-card-header>
      <b-card-body>
        <br />
        <!-- class="d-flex justify-content-between align-items-center flex-wrap" -->
        <div class="d-flex flex-column">
          <div>
            <h1 v-text="venue.title" />
            <p v-text="venue.description" />
          </div>
          <b-button
            size="sm"
            variant="info"
            :to="venueLink"
            class="mt-auto ml-auto"
          >
            Show Venue&nbsp;<i class="ion-android-arrow-dropright"></i>
          </b-button>
        </div>
      </b-card-body>
      <b-card-footer>
        <TagList :tags="venue.tagList" />
      </b-card-footer>
    </b-card>
  </div>
</template>

<script>
import VenueMeta from "./VenueMeta";
import TagList from "./TagList";

export default {
  name: "VenuePreview",
  components: {
    VenueMeta,
    TagList
  },
  props: {
    venue: { type: Object, required: true }
  },
  computed: {
    venueLink() {
      return {
        name: "venue",
        params: {
          slug: this.venue.slug
        }
      };
    }
  }
};
</script>
