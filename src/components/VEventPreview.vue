<template>
  <div class="event-preview">
    <b-card no-body>
      <b-card-header>
        <EventMeta isPreview :event="event" />
      </b-card-header>
      <b-card-body>
        <br />
        <!-- class="d-flex justify-content-between align-items-center flex-wrap" -->
        <div class="d-flex flex-column">
          <div>
            <h1 v-text="event.title" />
            <p v-text="event.description" />
          </div>
          <b-button
            size="sm"
            variant="info"
            :to="eventLink"
            class="mt-auto ml-auto"
          >
            Show Event&nbsp;<i class="ion-android-arrow-dropright"></i>
          </b-button>
        </div>
      </b-card-body>
      <b-card-footer>
        <TagList :tags="event.tagList" />
      </b-card-footer>
    </b-card>
  </div>
</template>

<script>
import EventMeta from "./EventMeta";
import TagList from "./TagList";

export default {
  name: "EventPreview",
  components: {
    EventMeta,
    TagList
  },
  props: {
    event: { type: Object, required: true }
  },
  computed: {
    eventLink() {
      return {
        name: "event",
        params: {
          slug: this.event.slug
        }
      };
    }
  }
};
</script>
