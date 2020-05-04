<template>
  <div>
    <div v-if="isLoading" class="venue-preview">Loading venues...</div>
    <div v-else>
      <div v-if="venues.length === 0" class="my-3 mx-2">
        No venues are here... yet.
      </div>
      <VenuePreview
        v-for="(venue, index) in venues"
        :venue="venue"
        :key="venue.name + index"
        class="my-2"
      />
      <VPagination :config="listConfig" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import VenuePreview from "./VVenuePreview";
import VPagination from "./VPagination";
import { FETCH_VENUES } from "../store/actions.type";
import { UPDATE_CURRENT_PAGE } from "@/store/mutations.type";

export default {
  name: "VenueList",
  components: {
    VenuePreview,
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
      const filters = {};

      if (this.author) filters.author = this.author;

      if (this.tag) filters.tag = this.tag;

      if (this.favorited) filters.favorited = this.favorited;

      return {
        type,
        filters
      };
    },
    ...mapGetters(["isLoading", "venues"])
  },
  watch: {
    currentPage(newValue) {
      this.listConfig.filters.offset = (newValue - 1) * this.itemsPerPage;
      this.fetchVenues();
    },
    type() {
      this.resetPagination();
      this.fetchVenues();
    },
    author() {
      this.resetPagination();
      this.fetchVenues();
    },
    tag() {
      this.resetPagination();
      this.fetchVenues();
    },
    favorited() {
      this.resetPagination();
      this.fetchVenues();
    }
  },
  mounted() {
    this.fetchVenues();
    this.resetPagination();
  },
  methods: {
    fetchVenues() {
      this.$store.dispatch(FETCH_VENUES, this.listConfig);
    },
    resetPagination() {
      this.$store.commit(UPDATE_CURRENT_PAGE, 1);
    }
  }
};
</script>
