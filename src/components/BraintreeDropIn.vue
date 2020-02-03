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
  export default {
    name: "BraintreeDropIn",
    props: {
      paymentToken: {
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
      try {
        await this.dropinCreate();
      } catch(err) {

      }
      this.$parent.$on('tokenize', () => {
        this.dropinRequestPaymentMethod();
      });
    },
    data () {
      return {
        paymentErrors: null,
        errorMessage: '',
        dropinInstance: '',
        paymentPayload: '',
        dataCollectorPayload: ''
      }
    },
    methods: {
      async dropinCreate() {
        const dropin = require('braintree-web-drop-in');
        // setup drop-in options
        const dropinOptions = {
          authorization: this.paymentToken,
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
        }
      }, 
      async dropinRequestPaymentMethod() {
        try {
          this.paymentPayload = await this.dropinInstance.requestPaymentMethod();
          this.$emit("checkout", this.paymentPayload);
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
