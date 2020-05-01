import { PaymentService } from "@/common/api.service";
import { FETCH_PAYMENT_TOKEN } from "./actions.type";
import { SET_PAYMENT_TOKEN } from "./mutations.type";

const state = {
  paymentToken: null
};

const getters = {
  paymentToken(state) {
    return state.paymentToken;
  }
};

const actions = {
  [FETCH_PAYMENT_TOKEN]({ commit }) {
    return PaymentService.getToken()
      .then(({ data }) => {
        commit(SET_PAYMENT_TOKEN, data.clientToken);
      })
      .catch(error => {
        throw new Error(error);
      });
  }
};

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations = {
  [SET_PAYMENT_TOKEN](state, token) {
    state.paymentToken = token;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
