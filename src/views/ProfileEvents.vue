<template>
  <div class="profile-page">
    <EventList :author="author" :items-per-page="5"></EventList>
  </div>
</template>

<script>
import EventList from "@/components/EventList";

export default {
  name: "ProfileEvents",
  components: {
    EventList
  },
  computed: {
    author() {
      return this.$route.params.username;
    }
  }
};
</script>
