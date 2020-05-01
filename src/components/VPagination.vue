<template>
  <b-pagination
    v-model="currentPageStore"
    :total-rows="eventsCount"
    :per-page="itemsPerPage"
    @input="paginate(currentPageStore)"
    first-text="First"
    prev-text="Previos"
    next-text="Next"
    last-text="Last"
  ></b-pagination>
</template>

<script>
import { mapGetters } from "vuex";
import { FETCH_EVENTS } from "@/store/actions.type";
import { UPDATE_CURRENT_PAGE } from "@/store/mutations.type";

export default {
  name: "Pagination",
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  methods: {
    paginate(pageNumber) {
      const fetchConfig = { ...this.config }; // Don't mutate the prop. Ever.
      fetchConfig.filters.offset = this.getOffset();
      fetchConfig.filters.limit = this.itemsPerPage; // TODO: Maybe make this configurable.

      this.$store.dispatch(FETCH_EVENTS, fetchConfig);
      this.$store.commit(UPDATE_CURRENT_PAGE, pageNumber);
    },
    getOffset() {
      return (this.currentPageStore - 1) * this.itemsPerPage;
    }
  },
  computed: {
    ...mapGetters({
      eventsCount: "eventsCount",
      itemsPerPage: "itemsPerPage",
      currentPage: "currentPageStore"
    }),
    currentPageStore: {
      get() {
        return this.currentPage;
      },
      set(newPageNumber) {
        this.$store.commit(UPDATE_CURRENT_PAGE, newPageNumber);
      }
    }
  }
};
</script>
