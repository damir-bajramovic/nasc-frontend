<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <div class="page" v-if="isLoading">
      <b-spinner v-if="isLoading" class="spinner" variant="primary" key="primary"></b-spinner>
    </div>
    <div class="wrapper flex-grow-1">
      <Header />
      <router-view></router-view>
    </div>
    <Footer />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import Header from "@/components/TheHeader";
import Footer from "@/components/TheFooter";



export default {
  name: "App",
  components: {
    Header,
    Footer
  },
  computed: {
    ...mapGetters(["isLoading"])
  }
};
</script>

<style>
.spinner {
  position: absolute;
  top: 50%;
  left: 50%;
}
.page {
  position: absolute;
  background: rgba(0, 0, 0, 0.3);
  z-index: 25;
  width: 100%;
  height: 100%;
}
</style>
