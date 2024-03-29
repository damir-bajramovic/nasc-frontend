import {
  EventsService,
  CommentsService,
  FavoriteService,
  EventSubscriptionService
} from "@/common/api.service";
import {
  FETCH_EVENT,
  FETCH_COMMENTS,
  COMMENT_CREATE,
  COMMENT_DESTROY,
  FAVORITE_ADD,
  FAVORITE_REMOVE,
  EVENT_PUBLISH,
  EVENT_EDIT,
  EVENT_EDIT_ADD_TAG,
  EVENT_EDIT_REMOVE_TAG,
  EVENT_DELETE,
  EVENT_RESET_STATE,
  EVENT_SUBSCRIBE
} from "./actions.type";
import {
  RESET_STATE,
  SET_EVENT,
  SET_COMMENTS,
  TAG_ADD,
  TAG_REMOVE,
  UPDATE_EVENT_IN_LIST
} from "./mutations.type";

function initialState() {
  return {
    event: {
      author: {},
      title: "",
      description: "",
      body: "",
      tagList: []
    },
    comments: []
  };
}

export const state = { ...initialState() };

export const actions = {
  async [FETCH_EVENT](context, eventSlug, prevEvent) {
    // avoid extronuous network call if event exists
    if (prevEvent !== undefined) {
      return context.commit(SET_EVENT, prevEvent);
    }
    const { data } = await EventsService.get(eventSlug);
    context.commit(SET_EVENT, data.event);
    return data;
  },
  async [FETCH_COMMENTS](context, eventSlug) {
    const { data } = await CommentsService.get(eventSlug);
    context.commit(SET_COMMENTS, data.comments);
    return data.comments;
  },
  async [COMMENT_CREATE](context, payload) {
    await CommentsService.post(payload.slug, payload.comment);
    context.dispatch(FETCH_COMMENTS, payload.slug);
  },
  async [COMMENT_DESTROY](context, payload) {
    await CommentsService.destroy(payload.slug, payload.commentId);
    context.dispatch(FETCH_COMMENTS, payload.slug);
  },
  async [FAVORITE_ADD](context, slug) {
    const { data } = await FavoriteService.add(slug);
    context.commit(UPDATE_EVENT_IN_LIST, data.event, { root: true });
    context.commit(SET_EVENT, data.event);
  },
  async [FAVORITE_REMOVE](context, slug) {
    const { data } = await FavoriteService.remove(slug);
    // Update list as well. This allows us to favorite an event in the Home view.
    context.commit(UPDATE_EVENT_IN_LIST, data.event, { root: true });
    context.commit(SET_EVENT, data.event);
  },
  [EVENT_PUBLISH]({ state }) {
    return EventsService.create(state.event);
  },
  [EVENT_DELETE](context, slug) {
    return EventsService.destroy(slug);
  },
  [EVENT_EDIT]({ state }) {
    console.log(state.event.slug);
    console.log(state.event.price);
    return EventsService.update(state.event.slug, state.event);
  },
  [EVENT_EDIT_ADD_TAG](context, tag) {
    context.commit(TAG_ADD, tag);
  },
  [EVENT_EDIT_REMOVE_TAG](context, tag) {
    context.commit(TAG_REMOVE, tag);
  },
  [EVENT_RESET_STATE]({ commit }) {
    commit(RESET_STATE);
  },
  [EVENT_SUBSCRIBE]({ commit, dispatch }, payload) {
    EventSubscriptionService.subscribe(payload.slug, payload.paymentData)
      .then(() => {
        commit(RESET_STATE);
        return dispatch(FETCH_EVENT, payload.slug);
      })
      .catch(error => {
        throw new Error(error);
      });
  }
};

/* eslint no-param-reassign: ["error", { "props": false }] */
export const mutations = {
  [SET_EVENT](state, event) {
    state.event = event;
  },
  [SET_COMMENTS](state, comments) {
    state.comments = comments;
  },
  [TAG_ADD](state, tag) {
    if (!state.event.tagList.includes(tag))
      state.event.tagList = state.event.tagList.concat([tag]);
  },
  [TAG_REMOVE](state, tag) {
    state.event.tagList = state.event.tagList.filter(t => t !== tag);
  },
  [RESET_STATE]() {
    Object.assign(state, initialState());
  }
};

const getters = {
  event(state) {
    return state.event;
  },
  comments(state) {
    return state.comments;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
