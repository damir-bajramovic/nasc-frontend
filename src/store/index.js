import Vue from "vue";
import Vuex from "vuex";

import home from "./home.module";
import auth from "./auth.module";
import event from "./event.module";
import profile from "./profile.module";
import payment from "./payment.module";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    home,
    auth,
    event,
    profile,
    payment
  }
});
