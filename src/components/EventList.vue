<template>
  <div>
    <div v-if="isLoading" class="event-preview">Loading events...</div>
    <div v-else>
      <div v-if="events.length === 0" class="event-preview">
        No events are here... yet.
      </div>
      <EventPreview
        v-for="(event, index) in events"
        :event="event"
        :key="event.title + index"
      />
      <VPagination :pages="pages" :currentPage.sync="currentPage" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import EventPreview from "./VEventPreview";
import VPagination from "./VPagination";
import { FETCH_EVENTS } from "../store/actions.type";

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
      const filters = {
        offset: (this.currentPage - 1) * this.itemsPerPage,
        limit: this.itemsPerPage
      };
      if (this.author) {
        filters.author = this.author;
      }
      if (this.tag) {
        filters.tag = this.tag;
      }
      if (this.favorited) {
        filters.favorited = this.favorited;
      }
      return {
        type,
        filters
      };
    },
    pages() {
      if (this.isLoading || this.eventsCount <= this.itemsPerPage) {
        return [];
      }
      return [
        ...Array(Math.ceil(this.eventsCount / this.itemsPerPage)).keys()
      ].map(e => e + 1);
    },
    ...mapGetters(["eventsCount", "isLoading", "events"])
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
  },
  methods: {
    fetchEvents() {
      this.$store.dispatch(FETCH_EVENTS, this.listConfig);
    },
    resetPagination() {
      this.listConfig.offset = 0;
      this.currentPage = 1;
    }
  }
};
</script>
