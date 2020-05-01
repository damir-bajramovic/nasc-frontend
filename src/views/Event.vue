<template>
  <div>
    <div class="banner">
      <b-container>
        <h1>{{ event.title }}</h1>
        <EventMeta :event="event" actions class="mt-4"></EventMeta>
      </b-container>
    </div>
    <hr />
    <b-container>
      <b-row>
        <b-col sm="12">
          <div v-html="parseMarkdown(event.body)"></div>
          <div class="tag-list">
            <Tag
              v-for="(tag, index) in event.tagList"
              :name="tag"
              :key="tag + index"
            ></Tag>
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
          <h5 class="my-3">
            Please subscribe to see the video stream. Subscription fee is ${{
              event.price
            }}.
          </h5>
          <BraintreeDropIn
            :paymentToken="paymentToken"
            :collectCardHolderName="true"
            :enableDataCollector="true"
            :enablePayPal="false"
            @checkout="onCheckout"
          >
          </BraintreeDropIn>
        </b-row>
      </div>
      <div v-else class="my-3">
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
import {
  FETCH_EVENT,
  FETCH_COMMENTS,
  FETCH_PAYMENT_TOKEN,
  EVENT_SUBSCRIBE
} from "@/store/actions.type";
import BraintreeDropIn from "@/components/BraintreeDropIn.vue";

import VideoStream from "@/components/VideoStream.vue";

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
      componentKey: 0
    };
  },
  components: {
    EventMeta,
    Comment,
    CommentEditor,
    Tag,
    BraintreeDropIn,
    VideoStream
  },
  async beforeRouteEnter(to, from, next) {
    try {
      await store.dispatch(FETCH_EVENT, to.params.slug);
      await store.dispatch(FETCH_COMMENTS, to.params.slug);
      if (store.state.auth.isAuthenticated)
        await store.dispatch(FETCH_PAYMENT_TOKEN)
      next();
    } catch (error) {
      next(error);
    }
  },
  computed: {
    ...mapGetters([
      "event",
      "currentUser",
      "comments",
      "isAuthenticated",
      "paymentToken"
    ])
  },
  methods: {
    parseMarkdown(content) {
      return marked(content);
    },
    onCheckout(payload) {
      store.dispatch(EVENT_SUBSCRIBE, {
        paymentData: payload,
        slug: this.event.slug
      });
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
