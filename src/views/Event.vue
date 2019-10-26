<script>
import { mapGetters } from "vuex";
import marked from "marked";
import store from "@/store";
import EventMeta from "@/components/EventMeta";
import Comment from "@/components/Comment";
import CommentEditor from "@/components/CommentEditor";
import Tag from "@/components/VTag";
import { FETCH_EVENT, FETCH_COMMENTS } from "@/store/actions.type";

export default {
  name: "rwv-event",
  props: {
    slug: {
      type: String,
      required: true
    }
  },
  components: {
    EventMeta,
    Comment,
    CommentEditor,
    Tag
  },
  created() {
    // eslint-disable-next-line
    const player = WowzaPlayer.create('playerElement',
        {
        'license': 'PLAY2-apXmY-XjGNc-7P4Qv-X4b33-QuGx9',
        'title': '',
        'description': '',
        'sourceURL': 'http%3A%2F%2F192.168.117.1%3A1935%2Flive%2Froom-2.stream%2Fplaylist.m3u8',
        'autoPlay': false,
        'volume': '75',
        'mute': true,
        'loop': false,
        'audioOnly': false,
        'uiShowQuickRewind': true,
        'uiQuickRewindSeconds': '30'
        }
    );
    console.log(player);
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
      <div class="row event-content">
        <div  id="playerElement"  style="width:100%; height:0; padding:0 0 56.25% 0"></div>
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