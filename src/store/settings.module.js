import { EventsService, CommentsService } from "@/common/api.service";
import { FETCH_EVENT, FETCH_COMMENTS } from "./actions.type";
import { SET_EVENT, SET_COMMENTS } from "./mutations.type";

export const state = {
  event: {},
  comments: []
};

export const actions = {
  [FETCH_EVENT](context, eventSlug) {
    return EventsService.get(eventSlug)
      .then(({ data }) => {
        context.commit(SET_EVENT, data.event);
      })
      .catch(error => {
        throw new Error(error);
      });
  },
  [FETCH_COMMENTS](context, eventSlug) {
    return CommentsService.get(eventSlug)
      .then(({ data }) => {
        context.commit(SET_COMMENTS, data.comments);
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
  }
};

export default {
  state,
  actions,
  mutations
};
