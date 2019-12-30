<template>
  <div class="home-my-feed"><EventList type="feed" /></div>
</template>

<script>
import EventList from "@/components/EventList";

export default {
  name: "home-my-feed",
  components: {
    EventList
  }
};
</script>
