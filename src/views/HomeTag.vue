<template>
  <div><EventList :tag="tag"></EventList></div>
</template>

<script>
import EventList from "@/components/EventList";

export default {
  name: "HomeTag",
  components: {
    EventList
  },
  computed: {
    tag() {
      return this.$route.params.tag;
    }
  }
};
</script>
