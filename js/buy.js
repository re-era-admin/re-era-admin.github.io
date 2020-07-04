(function () {
  "use strict";

  // ===========================================================================
  // 共通変数定義
  // ---------------------------------------------------------------------------
  var checkoutForm = document.getElementById("checkout-form");

  // ===========================================================================
  // 初期化関数
  //  - イベントハンドラを設定
  //  - アラートを表示 etc
  // ---------------------------------------------------------------------------

  Omise.setPublicKey("pkey_test_5k4953yfhskp2xwoquh");

  checkoutForm.addEventListener("submit", submitHandler, false);

  // ===========================================================================
  // イベントハンドラ関数定義
  // ---------------------------------------------------------------------------

  // Submit handler for checkout form.
  function submitHandler(event) {
    event.preventDefault();

    /*
      NOTE: Using `data-name` to prevent sending credit card information fields to the backend server via HTTP Post
      (according to the security best practice https://www.omise.co/security-best-practices#never-send-card-data-through-your-servers).
      */
    var cardInformation = {
      name: document.querySelector('[data-name="nameOnCard"]').value,
      number: document.querySelector('[data-name="cardNumber"]').value,
      expiration_month: document.querySelector('[data-name="expiryMonth"]')
        .value,
      expiration_year: document.querySelector('[data-name="expiryYear"]').value,
      security_code: document.querySelector('[data-name="securityCode"]').value,
    };

    Omise.createToken("card", cardInformation, function (statusCode, response) {
      if (statusCode === 200) {
        // Success: send back the TOKEN_ID to your server. The TOKEN_ID can be
        // found in `response.id`.
        checkoutForm.omiseToken.value = response.id;

        checkoutForm.submit();
      } else {
        // Error: display an error message. Note that `response.message` contains
        // a preformatted error message. Also note that `response.code` will be
        // "invalid_card" in case of validation error on the card.
      }
    });
  }

  // ===========================================================================
  // 関数定義 (イベントハンドラ以外)
  // ---------------------------------------------------------------------------
  /*
  See on github: https://github.com/muhammederdem/credit-card-form
  */

  new Vue({
    el: "#app",
    data() {
      return {
        currentCardBackground: Math.floor(Math.random() * 25 + 1), // just for fun :D
        cardName: "",
        cardNumber: "",
        cardMonth: "",
        cardYear: "",
        cardCvv: "",
        minCardYear: new Date().getFullYear(),
        amexCardMask: "#### ###### #####",
        otherCardMask: "#### #### #### ####",
        cardNumberTemp: "",
        isCardFlipped: false,
        focusElementStyle: null,
        isInputFocused: false,
      };
    },
    mounted() {
      this.cardNumberTemp = this.otherCardMask;
      document.getElementById("cardNumber").focus();
    },
    computed: {
      getCardType() {
        let number = this.cardNumber;
        let re = new RegExp("^4");
        if (number.match(re) != null) return "visa";

        re = new RegExp("^(34|37)");
        if (number.match(re) != null) return "amex";

        re = new RegExp("^5[1-5]");
        if (number.match(re) != null) return "mastercard";

        re = new RegExp("^6011");
        if (number.match(re) != null) return "discover";

        re = new RegExp("^9792");
        if (number.match(re) != null) return "troy";

        return "visa"; // default type
      },
      generateCardNumberMask() {
        return this.getCardType === "amex"
          ? this.amexCardMask
          : this.otherCardMask;
      },
      minCardMonth() {
        if (this.cardYear === this.minCardYear)
          return new Date().getMonth() + 1;
        return 1;
      },
    },
    watch: {
      cardYear() {
        if (this.cardMonth < this.minCardMonth) {
          this.cardMonth = "";
        }
      },
    },
    methods: {
      flipCard(status) {
        this.isCardFlipped = status;
      },
      focusInput(e) {
        this.isInputFocused = true;
        let targetRef = e.target.dataset.ref;
        let target = this.$refs[targetRef];
        this.focusElementStyle = {
          width: `${target.offsetWidth}px`,
          height: `${target.offsetHeight}px`,
          transform: `translateX(${target.offsetLeft}px) translateY(${target.offsetTop}px)`,
        };
      },
      blurInput() {
        let vm = this;
        setTimeout(() => {
          if (!vm.isInputFocused) {
            vm.focusElementStyle = null;
          }
        }, 300);
        vm.isInputFocused = false;
      },
    },
  });
})();
