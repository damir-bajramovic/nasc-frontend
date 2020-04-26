<template>
  <div class="container pb-3">
    <b-container class="bv-example-row">
      <b-row align-h="center" class="my-5">
          <b-col sm="4" md="6">
            <b-card class="p-3">
              <h3 class="mb-4">Your Settings</h3>
              <b-form @submit.prevent="updateSettings();">
                <b-form-group
                  id="input-group-1"
                  label="Profile photo URL:"
                  label-for="input-1"
                >
                <b-form-input
                  id="input-1"
                  v-model="currentUser.Image"
                  type="url"
                  required
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
                  required
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
                  label-for="input-5">
                <b-form-input
                  id="input-5"
                  type="password"
                  v-model="currentUser.password"
                  placeholder="Password"
                ></b-form-input>
                </b-form-group>
                <div class="d-flex justify-content-between align-items-center flex-wrap">
                  <b-button type="submit" variant="primary">Update Settings</b-button>
                </div>
              </b-form>
              <hr>
              <b-button type="button" size="lg" variant="danger" @click="logout">Log Out</b-button>
            </b-card>
          </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { LOGOUT, UPDATE_USER } from "@/store/actions.type";

export default {
  name: "Settings",
  computed: {
    ...mapGetters(["currentUser"])
  },
  methods: {
    updateSettings() {
      this.$store.dispatch(UPDATE_USER, this.currentUser).then(() => {
        // #todo, nice toast and no redirect
        this.$router.push({ name: "home" });
      });
    },
    logout() {
      this.$store.dispatch(LOGOUT).then(() => {
        this.$router.push({ name: "home" });
      });
    }
  }
};
</script>
