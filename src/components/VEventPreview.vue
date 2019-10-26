<template>
  <div class="event-preview">
    <EventMeta isPreview :event="event" />
    <router-link :to="eventLink" class="preview-link">
      <h1 v-text="event.title" />
      <p v-text="event.description" />
      <span>See event...</span>
      <TagList :tags="event.tagList" />
    </router-link>
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
