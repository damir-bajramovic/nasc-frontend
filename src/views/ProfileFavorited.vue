<template>
  <div>
    <EventList :favorited="favorited" :items-per-page="5">
    </EventList>
  </div>
</template>

<script>
import EventList from "@/components/EventList";

export default {
  name: "ProfileFavorited",
  components: {
    EventList
  },
  computed: {
    favorited() {
      return this.$route.params.username;
    }
  }
};
</script>
