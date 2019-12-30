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
    },
    subscribed() {
      // Force re-rendering
      ++this.componentKey;
    }
  }
};
</script>

<style>
  .constrain {
    width: 480px;
    margin: 0 auto;
    padding: 1rem;
  }
</style>

<template>
  <div class="event-page">
    <div class="banner">
      <div class="container">
        <h1>{{ event.title }}</h1>
        <EventMeta :event="event" :actions="true"></EventMeta>
      </div>
    </div>
    <div class="container page">
      <div class="row event-content">
        <div class="col-xs-12">
          <div v-html="parseMarkdown(event.body)"></div>
          <ul class="tag-list">
            <li v-for="(tag, index) of event.tagList" :key="tag + index">
              <Tag
                :name="tag"
                className="tag-default tag-pill tag-outline"
              ></Tag>
            </li>
          </ul>
        </div>
      </div>
      <hr />
      <div v-if="isAuthenticated" :key="componentKey">
        <div class="row" v-if="event.subscribed">
          <VideoStream
            :host="this.event.host"
            :port="this.event.port"
            :app="this.event.app"
            :streamName="this.event.stream"
          ></VideoStream>
        </div>
        <div v-else>
          Please subscribe so you can see the video stream.
          <BraintreeDropIn
          wrapperClass="constrain"
          :authToken="this.authToken" 
          :collectCardHolderName="true"
          :enableDataCollector="true"
          :enablePayPal="true"
          :event="this.event"
          @subscribed="subscribed"
          >
        </BraintreeDropIn>
        </div>
        <hr />
      </div>
      <div v-else>
        Please log in so you can subscribe to the event and view the stream.
      </div>
      <hr />
      <div class="event-actions">
        <EventMeta :event="event" :actions="true"></EventMeta>
      </div>
      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
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
        </div>
      </div>
    </div>
  </div>
</template>