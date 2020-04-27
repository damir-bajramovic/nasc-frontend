<template>
  <div>
    <div v-if="isLoading" class="event-preview">Loading events...</div>
    <div v-else>
      <div v-if="events.length === 0" class="my-3 mx-2">
        No events are here... yet.
      </div>
      <EventPreview
        v-for="(event, index) in events"
        :event="event"
        :key="event.title + index"
        class="my-2"
      />
      <VPagination :config="listConfig" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import EventPreview from "./VEventPreview";
import VPagination from "./VPagination";
import { FETCH_EVENTS } from "../store/actions.type";
import { UPDATE_CURRENT_PAGE } from "@/store/mutations.type";

export default {
  name: "EventList",
  components: {
    EventPreview,
    VPagination
  },
  props: {
    type: {
      type: String,
      required: false,
      default: "all"
    },
    author: {
      type: String,
      required: false
    },
    tag: {
      type: String,
      required: false
    },
    favorited: {
      type: String,
      required: false
    },
    itemsPerPage: {
      type: Number,
      required: false,
      default: 10
    }
  },
  data() {
    return {
      currentPage: 1
    };
  },
  computed: {
    listConfig() {
      const { type } = this;
      const filters = { };

      if (this.author)
        filters.author = this.author;
      
      if (this.tag)
        filters.tag = this.tag;

      if (this.favorited)
        filters.favorited = this.favorited;

      return {
        type,
        filters
      };
    },
    ...mapGetters(["isLoading", "events"])
  },
  watch: {
    currentPage(newValue) {
      this.listConfig.filters.offset = (newValue - 1) * this.itemsPerPage;
      this.fetchEvents();
    },
    type() {
      this.resetPagination();
      this.fetchEvents();
    },
    author() {
      this.resetPagination();
      this.fetchEvents();
    },
    tag() {
      this.resetPagination();
      this.fetchEvents();
    },
    favorited() {
      this.resetPagination();
      this.fetchEvents();
    }
  },
  mounted() {
    this.fetchEvents();
    this.resetPagination();
  },
  methods: {
    fetchEvents() {
      this.$store.dispatch(FETCH_EVENTS, this.listConfig);
    },
    resetPagination() {
      this.$store.commit(UPDATE_CURRENT_PAGE, 1);
    }
  }
};
</script>
