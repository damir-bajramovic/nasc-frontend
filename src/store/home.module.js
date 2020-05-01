import { TagsService, EventsService } from "@/common/api.service";
import { FETCH_EVENTS, FETCH_TAGS } from "./actions.type";
import {
  FETCH_START,
  FETCH_END,
  SET_TAGS,
  UPDATE_EVENT_IN_LIST
} from "./mutations.type";

const state = {
  tags: [],
  events: [],
  isLoading: true,
  eventsCount: 0,
  itemsPerPage: 10, // TODO: Maybe make this configurable
  currentPage: 1
};

const getters = {
  eventsCount(state) {
    return state.eventsCount;
  },
  events(state) {
    return state.events;
  },
  isLoading(state) {
    return state.isLoading;
  },
  tags(state) {
    return state.tags;
  },
  itemsPerPage(state) {
    return state.itemsPerPage;
  },
  currentPageStore(state) {
    return state.currentPage;
  }
};

const actions = {
  [FETCH_EVENTS]({ commit }, params) {
    commit(FETCH_START);
    return EventsService.query(params.type, params.filters)
      .then(({ data }) => {
        commit(FETCH_END, data);
      })
      .catch(error => {
        throw new Error(error);
      });
  },
  [FETCH_TAGS]({ commit }) {
    return TagsService.get()
      .then(({ data }) => {
        commit(SET_TAGS, data.tags);
      })
      .catch(error => {
        throw new Error(error);
      });
  }
};

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations = {
  [FETCH_START](state) {
    state.isLoading = true;
  },
  [FETCH_END](state, { events, eventsCount }) {
    state.events = events;
    state.eventsCount = eventsCount;
    state.isLoading = false;
  },
  [SET_TAGS](state, tags) {
    state.tags = tags;
  },
  [UPDATE_EVENT_IN_LIST](state, data) {
    state.events = state.events.map(event => {
      if (event.slug !== data.slug) {
        return event;
      }
      // We could just return data, but it seems dangerous to
      // mix the results of different api calls, so we
      // protect ourselves by copying the information.
      event.favorited = data.favorited;
      event.favoritesCount = data.favoritesCount;
      return event;
    });
  },
  updateCurrentPage(state, data) {
    state.currentPage = data;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
