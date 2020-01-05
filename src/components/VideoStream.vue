<script>
import { mapGetters } from "vuex";
export default {
    name: "VideoStream",
    props: {
      host: {
        value: String,
      },
      port: {
        value: Number,
      },
      app: {
        value: String,
      },
      streamName: {
        value: String,
      },
    },
    mounted() {

    // TODO: Make this a separate method
    
    let red5prosdkScript = document.createElement('script');

    red5prosdkScript.onload = () => {
      let webRTCScript = document.createElement('script');

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
            protocol: 'wss',
            host: this.host,
            port: this.port,
            app: this.app,
            streamName: this.streamName,
            rtcConfiguration: {
            iceServers: [{urls: 'stun:stun2.l.google.com:19302'}],
            iceCandidatePoolSize: 2,
            bundlePolicy: 'max-bundle'
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
      }

      webRTCScript.setAttribute('src', 'https://webrtc.github.io/adapter/adapter-latest.js');
      webRTCScript.async = true;
      document.head.appendChild(webRTCScript);
    }
    red5prosdkScript.setAttribute('src', 'lib/red5pro/red5pro-sdk.min.js')
    red5prosdkScript.async = true
    document.head.appendChild(red5prosdkScript)
  },
  computed: {
    ...mapGetters(["event"])
  }
}
</script>

<template>
  <div class="row" v-if="event.subscribed">
    <div id="video-container">
      <video v-bind:id="this.streamName" width="640" height="480" controls autoplay></video>
    </div>
  </div>
</template>