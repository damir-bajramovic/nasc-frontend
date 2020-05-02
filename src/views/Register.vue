<template>
  <b-container class="bv-example-row">
    <b-row align-h="center" class="my-5">
      <b-col sm="4" md="6">
        <b-card class="p-3">
          <h3 class="mb-4">Sign Up</h3>
          <b-form @submit.prevent="onSubmit">
            <b-form-group
              id="input-group-1"
              label="Username:"
              label-for="input-1"
            >
              <b-form-input
                id="input-1"
                v-model="username"
                type="text"
                trim
                required
                placeholder="JohnDoe"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              id="input-group-2"
              label="Email address:"
              label-for="input-2"
            >
              <!-- TODO: Add vee-validate validation  -->
              <b-form-input
                id="input-2"
                v-model="email"
                type="email"
                required
                placeholder="Email"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              id="input-group-3"
              label="Password:"
              label-for="input-3"
            >
              <b-form-input
                id="input-3"
                type="password"
                v-model="password"
                placeholder="Password"
                required
              ></b-form-input>
            </b-form-group>

            <div
              class="d-flex justify-content-between align-items-center flex-wrap"
            >
              <b-button type="submit" variant="primary" class=""
                >Sign Up</b-button
              >
              <router-link :to="{ name: 'login' }"
                >Have an account?
              </router-link>
            </div>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState } from "vuex";
import store from "@/store";
import { REGISTER } from "@/store/actions.type";

export default {
  name: "Register",
  data() {
    return {
      username: "",
      email: "",
      password: ""
    };
  },
  computed: {
    ...mapState({
      errors: state => state.auth.errors
    })
  },
  methods: {
    onSubmit() {
      this.$store
        .dispatch(REGISTER, {
          email: this.email,
          password: this.password,
          username: this.username
        })
        .then(() => this.$router.push({ name: "home" }));
    }
  },
  beforeRouteEnter(to, from, next) {
    if (store.state.auth.isAuthenticated) {
      next({ path: "/" });
      return;
    }
    next();
  }
};
</script>
