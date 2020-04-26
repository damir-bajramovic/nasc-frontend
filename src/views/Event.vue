<template>
  <div>
    <div class="banner">
      <b-container>
        <h1>{{ event.title }}</h1>
        <EventMeta :event="event" actions class="mt-4"></EventMeta>
      </b-container>
    </div>
    <hr>
    <b-container>
      <b-row>
        <b-col sm="12">
          <div v-html="parseMarkdown(event.body)"></div>
          <div class="tag-list">
            <Tag v-for="(tag, index) in event.tagList" :name="tag" :key="tag + index"></Tag>
          </div>
        </b-col>
      </b-row>
      <hr />
      <div v-if="isAuthenticated">
        <b-row v-if="event.subscribed">
          <VideoStream
            :host="this.event.host"
            :port="this.event.port"
            :app="this.event.app"
            :streamName="this.event.stream"
            class="d-flex align-items-center"
            >
          </VideoStream>
        </b-row>
        <b-row v-else>
          <h5>Please subscribe to see the video stream. Subscription fee is ${{event.price}}.</h5>
          <BraintreeDropIn
          :authToken="this.authToken" 
          :collectCardHolderName="true"
          :enableDataCollector="true"
          :enablePayPal="true"
          :event="this.event"
          @subscribed="subscribed">
          </BraintreeDropIn>
        </b-row>
      </div>
      <div v-else>
        Please log in so you can subscribe to the event and view the stream.
      </div>
      <b-row>
        <b-col sm="12" md="8" offset-md="2">
          <CommentEditor
            v-if="isAuthenticated"
            :slug="slug"
            :userImage="currentUser.image"
          >
          </CommentEditor>
          <p v-else>
            <router-link :to="{ name: 'login' }">Sign in</router-link>
            or
            <router-link :to="{ name: 'register' }">sign up</router-link>
            to add comments on this event.
          </p>
          <Comment
            v-for="(comment, index) in comments"
            :slug="slug"
            :comment="comment"
            :key="index"
          >
          </Comment>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import marked from "marked";
import store from "@/store";
import EventMeta from "@/components/EventMeta";
import Comment from "@/components/Comment";
import CommentEditor from "@/components/CommentEditor";
import Tag from "@/components/VTag";
import { FETCH_EVENT, FETCH_COMMENTS } from "@/store/actions.type";
import BraintreeDropIn from "@/components/BraintreeDropIn.vue";

import VideoStream from "@/components/VideoStream.vue";

import axios from "axios";
import { API_URL } from "@/common/config";

export default {
  name: "event",
  props: {
    slug: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      authToken: {
        token: ''
      },
      componentKey: 0
    }
  },
  components: {
    EventMeta,
    Comment,
    CommentEditor,
    Tag,
    BraintreeDropIn,
    VideoStream
  },
  async created() {
    const response = await axios.post(`${API_URL}/payment/client_token`);
    this._data.authToken.token = response.data.clientToken;
    // TODO: This shouldn't be here. Use Vuex.
  },
  beforeRouteEnter(to, from, next) {
    Promise.all([
      store.dispatch(FETCH_EVENT, to.params.slug),
      store.dispatch(FETCH_COMMENTS, to.params.slug)
    ]).then(() => {
      next();
    });
  },
  computed: {
    ...mapGetters(["event", "currentUser", "comments", "isAuthenticated"])
  },
  methods: {
    parseMarkdown(content) {
      return marked(content);
    }
  }
};
</script>

<style>
.banner {
  color: #333;
  background: #fff;
  padding: 2rem;
  margin-bottom: 2rem;
}
</style>
