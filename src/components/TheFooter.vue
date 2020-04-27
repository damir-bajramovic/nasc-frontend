<template>
  <footer>
    <div class="container-fluid mt-2 p-1 bg-info">
      <router-link class="logo-font" :to="{ name: 'home', params: {} }">
        NASC Inc.
      </router-link>
      <span class="attribution">
        Make it stream!
      </span>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer"
};
</script>

<style scoped>
.logo-font {
  font-family: titillium web, sans-serif;
  vertical-align: middle;
}
.attribution {
  vertical-align: middle;
  margin-left: 10px;
  font-size: 0.8rem;
  color: #bbb;
  font-weight: 300;
}
</style>
