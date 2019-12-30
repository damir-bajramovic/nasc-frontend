<template>
  <div class="container">
    <ul v-if="paymentErrors" class="error-messages">
      <!-- <li v-for="(v, k) in errors" :key="k">{{ k }} {{ v | error }}</li> -->
      <li>{{paymentErrors}}</li>
    </ul>

    <div id="dropin-container"></div>

    <button class="btn pull-xs-center btn-primary"
            type="submit" 
            id="submitTransaction" 
            @click="dropinRequestPaymentMethod">
            Confirm Payment
    </button>
  </div>
</template>

<script>

import axios from "axios";
import { API_URL } from "@/common/config";
import { FETCH_EVENT } from "@/store/actions.type"; 


  export default {
    name: "BraintreeDropIn",
    props: {
      authToken: {
        value: String,
      },
      wrapperClass: {
        value: String,
      },
      loaderClass: {
        value: String,
      },
      inputClass: {
        value: String,
      },
      collectCardHolderName: {
        value: Boolean,
      },
      collectPostalCode: {
        value: Boolean,
      },
      enableDataCollector: {
        value: Boolean,
      },
      enablePayPal: {
        value: Boolean,
      }
    },
    async created() {
      console.log("CREATED", this.authToken.token);
      
      const response = await axios.post(`${API_URL}/payment/client_token`);
      this.clientPaymentToken = response.data.clientToken; // TODO: Use VUEX to get the client payment token

      await this.dropinCreate();

      this.$parent.$on('tokenize', () => {
        this.dropinRequestPaymentMethod();
      });
    },
    mounted() {
      console.log("MOUNTED", this.authToken.token);
      console.log()
    },
    data () {
      return {
        paymentErrors: null,
        errorMessage: '',
        dropinInstance: '',
        paymentPayload: '',
        dataCollectorPayload: '',
        clientPaymentToken: '' // TODO: REMOVE
      }
    },
    methods: {
      async dropinCreate() {
        const dropin = require('braintree-web-drop-in');
        console.log("THIS IS TOKEN!!!!!", this.authToken.token);
        // setup drop-in options
        const dropinOptions = {
          authorization: this.clientPaymentToken, // this.authToken.token,
          selector: '#dropin-container',
        }

        // if PayPal enabled, add to options settings
        if (this.enablePayPal) {
          console.log('paypal enabled')
          dropinOptions.paypal = {
            flow: 'vault'
          };
        }

        try {
          this.dropinInstance = await dropin.create(dropinOptions);
        } catch (err) {
          console.log(err);
          console.log(this.authToken.token)
        }
      }, 
      async dropinRequestPaymentMethod() {
        
        try {
          const payload = await this.dropinInstance.requestPaymentMethod();
          this.paymentPayload = payload;
          console.log(payload);
          console.log("EVENT", this.event);
          const subscribeResponse = await axios.post(`${API_URL}/payment/checkout`, { payload: payload, event: this.event });
          console.log("CHECKOUT FINISHED");
          // do something with the payload/nonce
          // await this.$store.dispatch(FETCH_EVENT, this.event.slug);
          // this.$emit("subscribed");
          console.log("BEFORE FORCE UPDATE");
          // await this.$router.push({
          //   name: "event",
          //   params: { slug: data.event.slug }
          // });

          // console.log("try reload");
          // this.Location.reload(true);
          // console.log("RELOAD");
          // await this.$forceUpdate()
          // console.log("EXECUTED FORCE UPDATE");

          let reloadScript = document.createElement('script');
          reloadScript.setAttribute('src', 'reload.js');
          reloadScript.async = true;
          document.head.appendChild(reloadScript);


        } catch (err) {
          console.log(err);
          this.paymentErrors = err.message; // TODO: MA
          this.errorMessage = 'There was an error setting up the client instance. Message: ' + err.message;
          this.$emit('bt.error', this.errorMessage);
          return;
        }
      },
    },
  };
</script>
