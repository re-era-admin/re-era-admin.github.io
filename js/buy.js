import Vue from "vue";
import VueTheMask from "vue-the-mask";

// import jQuery from "jquery";
// window.$ = window.jQuery = jQuery;

(function () {
  "use strict";

  // ===========================================================================
  // 共通変数定義
  // ---------------------------------------------------------------------------
  let izakayaId;
  let pricePerHour;
  // ===========================================================================
  // イベントハンドラ関数定義
  // ---------------------------------------------------------------------------

  var handlers = {
    clickBuyLink: function (e) {
      window.location.href = "/detail.html?id=" + izakayaId;
    },
    submitPurchase: function () {
      var cardInformation = {
        name: document.querySelector("#cardName").value,
        number: document.querySelector("#cardNumber").value,
        expiration_month: document.querySelector("#cardMonth").value,
        expiration_year: document.querySelector("#cardYear").value,
        security_code: document.querySelector("#cardCvv").value,
      };
      Omise.createToken("card", cardInformation, function (
        statusCode,
        response
      ) {
        if (statusCode === 200) {
          // Success: send back the TOKEN_ID to your server. The TOKEN_ID can be
          // found in `response.id`.

          var emailVal = document.querySelector("#email").value;
          var izakayaId = document.querySelector("#izakayaId").value;

          let purchaseFormData = new FormData();
          purchaseFormData.append("omiseToken", response.id);
          purchaseFormData.append("email", emailVal);
          purchaseFormData.append("izakayaId", izakayaId);

          fetch(process.env.AP_CONTEXT_PATH + "/ticket/buy", {
            method: "POST",
            body: purchaseFormData,
          })
            .then((response) => response.json())
            .catch((error) => console.error("Error:", error))
            .then((response) =>
              console.log("Success", JSON.stringify(response))
            );
        } else {
          // Error: display an error message. Note that `response.message` contains
          // a preformatted error message. Also note that `response.code` will be
          // "invalid_card" in case of validation error on the card.
        }
      });
    },
  };

  // ===========================================================================
  // 初期化関数
  //  - イベントハンドラを設定
  //  - アラートを表示 etc
  // ---------------------------------------------------------------------------
  var params = new URL(document.location).searchParams;
  izakayaId = params.get("id");

  getIzakaya(izakayaId);

  Omise.setPublicKey("pkey_test_5k4953yfhskp2xwoquh");

  document
    .getElementById("link-out")
    .addEventListener("click", handlers.clickBuyLink);
  document
    .getElementById("purchase-btn")
    .addEventListener("click", handlers.submitPurchase);

  // ===========================================================================
  // 関数定義 (イベントハンドラ以外)
  // ---------------------------------------------------------------------------

  function getIzakaya(izakayaId) {
    fetch(process.env.AP_CONTEXT_PATH + "/izakaya/" + izakayaId, {
      method: "GET",
      mode: "cors",
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.pricePerHour);
        pricePerHour = data.pricePerHour;
        var vm = new Vue({
          el: "#box__izakaya",
          data: {
            izakaya: [],
          },
          mounted() {
            this.izakaya = data;
          },
        });

        /*
        See on github: https://github.com/muhammederdem/credit-card-form
        */
        Vue.use(VueTheMask);
        new Vue({
          el: "#app",
          data() {
            return {
              // currentCardBackground: Math.floor(Math.random() * 5 + 1), // just for fun :D
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
              price: pricePerHour,
            };
          },
          mounted() {
            this.cardNumberTemp = this.otherCardMask;
            this.price = pricePerHour;
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
      })
      .catch((err) => {
        console.log(err);
      });
  }
})();
