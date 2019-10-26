<template>
  <footer>
    <div class="container">
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
