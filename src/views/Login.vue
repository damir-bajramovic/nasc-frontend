<template>
  <b-container class="bv-example-row">
    <b-row align-h="center" class="my-5">
        <b-col sm="4" md="6">
          <b-card class="p-3">
            <h3 class="mb-4">Login</h3>
            <b-form @submit.prevent="onSubmit(email, password);">
              <b-form-group
                id="input-group-1"
                label="Email address:"
                label-for="input-1"
              >
                <b-form-input
                  id="input-1"
                  v-model="email"
                  type="email"
                  required
                  placeholder="Email"
                ></b-form-input>
              </b-form-group>

              <b-form-group id="input-group-2" label="Password:" label-for="input-2">
                <b-form-input
                  id="input-2"
                  type="password"
                  v-model="password"
                  placeholder="Password"
                  required
                ></b-form-input>
              </b-form-group>

              <div class="d-flex justify-content-between align-items-center flex-wrap">
                <b-button type="submit" variant="primary" class="">Log In</b-button>
                <a href="#">Forgot password?</a>
              </div>
            </b-form>
          </b-card>
        </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState } from "vuex";
import { LOGIN } from "@/store/actions.type";

export default {
  name: "Login",
  data() {
    return {
      email: null,
      password: null
    };
  },
  methods: {
    onSubmit(email, password) {
      this.$store
        .dispatch(LOGIN, { email, password })
        .then(() => this.$router.push({ name: "home" }));
    }
  },
  computed: {
    ...mapState({
      errors: state => state.auth.errors
    })
  }
};
</script>
