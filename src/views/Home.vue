<template>
  <div>
    <b-jumbotron
      header="NASC Inc."
      lead="A place to see your favorite events."
    ></b-jumbotron>
    <b-container>
      <b-row>
        <b-col md="9">
          <b-tabs>
            <b-nav tabs>
              <b-nav-item 
                exact-active-class="active"
                exact
                :to="{ name: 'home-my-feed' }"
              >Your Feed
              </b-nav-item>
              <b-nav-item
                exact-active-class="active"
                exact
                :to="{ name: 'home' }"
              >Global Feed
              </b-nav-item>
              <b-nav-item
                v-if="tag"
                exact-active-class="active"
                :to="{ name: 'home-tag', params: { tag } }"
              ><i class="ion-pound"></i> {{ tag }}
              </b-nav-item>
            </b-nav>
            <router-view></router-view>
          </b-tabs>
        </b-col>
        <b-col md="3">
          <div class="sidebar">
            <p>Popular Tags</p>
            <div class="tag-list">
              <Tag v-for="(tag, index) in tags" :name="tag" :key="index"></Tag>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Tag from "@/components/VTag";
import { FETCH_TAGS } from "@/store/actions.type";

export default {
  name: "home",
  components: {
    Tag
  },
  mounted() {
    this.$store.dispatch(FETCH_TAGS);
  },
  computed: {
    ...mapGetters(["isAuthenticated", "tags"]),
    tag() {
      return this.$route.params.tag;
    }
  }
};
</script>

<style>
.sidebar {
  padding: 5px 10px 10px;
  background: #f3f3f3;
  border-radius: 4px;
}
</style>