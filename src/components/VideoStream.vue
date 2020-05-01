<template>
  <b-row v-if="event.subscribed">
    <div id="video-container">
      <video
        v-bind:id="this.streamName"
        controls
        autoplay
        class="video-size"
      ></video>
    </div>
  </b-row>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "VideoStream",
  props: {
    host: {
      value: String
    },
    port: {
      value: Number
    },
    app: {
      value: String
    },
    streamName: {
      value: String
    }
  },
  mounted() {
    // TODO: Make this a separate method

    let red5prosdkScript = document.createElement("script");

    red5prosdkScript.onload = () => {
      let webRTCScript = document.createElement("script");

      webRTCScript.onload = () => {
        // eslint-disable-next-line
        // Create a new instance of the WebRTC subcriber.

        // eslint-disable-next-line
        var subscriber = new red5prosdk.RTCSubscriber();

        // Create a view instance based on video element id.

        // eslint-disable-next-line
        var viewer = new red5prosdk.PlaybackView(this.streamName);
        // Attach the subscriber to the view.

        // eslint-disable-next-line
        viewer.attachSubscriber(subscriber);

        // Using Chrome/Google TURN/STUN servers.

        // eslint-disable-next-line
        var iceServers = [{urls: 'stun:stun2.l.google.com:19302'}];

        // Initialize

        // eslint-disable-next-line
        subscriber.init({
            protocol: "wss",
            host: this.host,
            port: this.port,
            app: this.app,
            streamName: this.streamName,
            rtcConfiguration: {
              iceServers: [{ urls: "stun:stun2.l.google.com:19302" }],
              iceCandidatePoolSize: 2,
              bundlePolicy: "max-bundle"
            } // See https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/RTCPeerConnection#RTCConfiguration_dictionary
          })
          .then(function() {
            // Invoke the playback action
            return subscriber.subscribe();
          })
          .catch(function(error) {
            // A fault occurred while trying to initialize and subscribe to the stream.
            console.error(error);
          });
      };

      webRTCScript.setAttribute(
        "src",
        "https://webrtc.github.io/adapter/adapter-latest.js"
      );
      webRTCScript.async = true;
      document.head.appendChild(webRTCScript);
    };
    red5prosdkScript.setAttribute("src", "lib/red5pro/red5pro-sdk.min.js");
    red5prosdkScript.async = true;
    document.head.appendChild(red5prosdkScript);
  },
  computed: {
    ...mapGetters(["event"])
  }
};
</script>

<style>
@media (min-width: 576px) {
  .video-size {
    height: 380px;
    width: 500px;
  }
}

@media (min-width: 768px) {
  .video-size {
    height: 500px;
    width: 700px;
  }
}

@media (min-width: 992px) {
  .video-size {
    height: 600px;
    width: 900px;
  }
}

@media (min-width: 1200px) {
  .video-size {
    height: 700px;
    width: 1100px;
  }
}

@media (max-width: 575px) {
  .video-size {
    height: 430px;
    width: 480px;
  }
}

@media (max-width: 400px) {
  .video-size {
    height: 320px;
    width: 360px;
  }
}

@media (max-width: 500px) {
  .video-size {
    height: 350px;
    width: 400px;
  }
}
/*
@media (max-width: 767px) {
  .video-size {
    height: 380px;
    width: 500px;
  }
}

@media (max-width: 991px) {
  .video-size {
    height: 380px;
    width: 500px;
  }
}

@media (max-width: 1199px) {
  .video-size {
    height: 380px;
    width: 500px;
  }
} */
</style>
