<template>
  <div class="container pb-3">
    <b-container class="bv-example-row">
      <b-row align-h="center" class="my-5">
        <b-col sm="4" md="6">
          <b-card class="p-3">
            <h3 class="mb-4">Your Settings</h3>
            <validation-observer v-slot="{ invalid }">
              <b-form @submit.prevent="updateSettings()">
                <b-form-group
                  id="input-group-1"
                  label="Profile photo URL:"
                  label-for="input-1"
                >
                  <b-form-input
                    id="input-1"
                    v-model="currentUser.Image"
                    type="url"
                    placeholder="Profile photo URL"
                  ></b-form-input>
                </b-form-group>
                <b-form-group
                  id="input-group-2"
                  label="Username:"
                  label-for="input-2"
                >
                  <b-form-input
                    id="input-2"
                    v-model="currentUser.username"
                    type="text"
                    trim
                    placeholder="Your username"
                  ></b-form-input>
                </b-form-group>
                <b-form-group
                  id="input-group-3"
                  label="Your short bio:"
                  label-for="input-3"
                >
                  <b-form-textarea
                    id="input-3"
                    v-model="currentUser.bio"
                    placeholder="Enter something..."
                    rows="3"
                    max-rows="6"
                    trim
                  ></b-form-textarea>
                </b-form-group>
                <b-form-group
                  id="input-group-4"
                  label="Email address:"
                  label-for="input-4"
                >
                  <b-form-input
                    id="input-4"
                    v-model="currentUser.email"
                    type="email"
                    placeholder="Email"
                  ></b-form-input>
                </b-form-group>
                <b-form-group
                  id="input-group-5"
                  label="Password:"
                  label-for="input-5"
                >
                  <ValidationProvider
                    rules="password:@confirm"
                    v-slot="{ errors }"
                  >
                    <b-form-input
                      id="input-5"
                      type="password"
                      v-model="currentUser.password"
                    ></b-form-input>
                    <small class="form-text text-danger">{{ errors[0] }}</small>
                  </ValidationProvider>
                </b-form-group>
                <b-form-group
                  id="input-group-6"
                  label="Confirm Password:"
                  label-for="input-6"
                >
                  <ValidationProvider name="confirm" v-slot="{ errors }">
                    <b-form-input
                      id="input-6"
                      type="password"
                      v-model="confirmationPassword"
                    ></b-form-input>
                    <small class="form-text text-danger">{{ errors[0] }}</small>
                  </ValidationProvider>
                </b-form-group>
                <div
                  class="d-flex justify-content-between align-items-center flex-wrap"
                >
                  <b-button type="submit" variant="primary" :disabled="invalid"
                    >Update Settings</b-button
                  >
                </div>
              </b-form>
            </validation-observer>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { extend } from "vee-validate";

import { mapGetters } from "vuex";
import { UPDATE_USER } from "@/store/actions.type";

export default {
  name: "Settings",
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data() {
    return {
      confirmationPassword: ""
    };
  },
  computed: {
    ...mapGetters(["currentUser"])
  },
  methods: {
    updateSettings() {
      this.$store.dispatch(UPDATE_USER, this.currentUser).then(() => {
        // TODO, nice toast and no redirect
        this.$router.push({ name: "home" });
      });
    }
  }
};

extend("password", {
  params: ["target"],
  validate(value, { target }) {
    return value === target;
  },
  message: "Password confirmation does not match"
});
</script>
