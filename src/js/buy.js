import Vue from "vue";
import VueTheMask from "vue-the-mask";

import jQuery from "jquery";
window.$ = window.jQuery = jQuery;

(function () {
  "use strict";

  // ===========================================================================
  // 共通変数定義
  // ---------------------------------------------------------------------------
  let 出店情報Id;

  let price;

  // ===========================================================================
  // イベントハンドラ関数定義
  // ---------------------------------------------------------------------------

  var handlers = {
    submitPurchase: function () {
      var el = document.getElementById("container__loading");
      el.classList.add("active");
      document.getElementById("header").classList.add("under-modal");
      var cardInformation = {
        // name: document.querySelector("#cardName").value,
        // number: document.querySelector("#cardNumber").value,
        // expiration_month: document.querySelector("#cardMonth").value,
        // expiration_year: document.querySelector("#cardYear").value,
        // security_code: document.querySelector("#cardCvv").value,

        // TODO: 暫定機能：仮のカード情報で決済トークン取得
        name: "TEST USER",
        number: "4242424242424242",
        expiration_month: "07",
        expiration_year: "2025",
        security_code: "999",
      };

      Omise.createToken("card", cardInformation, function (
        statusCode,
        response
      ) {
        if (statusCode === 200) {
          var emailVal = document.querySelector("#email").value;
          var purchaserName = document.querySelector("#purchaser-name").value;

          let purchaseFormData = new FormData();
          purchaseFormData.append("omiseトークン", response.id);
          purchaseFormData.append("メールアドレス", emailVal);
          purchaseFormData.append("購入者名", purchaserName);
          purchaseFormData.append("出店Id", 出店情報Id);
          purchaseFormData.append("表示価格", price);

          fetch(process.env.AP_CONTEXT_PATH + "/出店情報/チケット申込を行う", {
            method: "POST",
            body: purchaseFormData,
          })
            .then((response) => response.json())
            .catch((error) => console.error("Error:", error))
            .then((response) => {
              document
                .getElementById("container__loading")
                .classList.remove("active");
              document.getElementById("header").classList.add("under-modal");
              if (response.code != undefined) {
                console.log("Fail", response.message);
                document
                  .getElementById("part__modal-icon")
                  .classList.add("error");
                var vm = new Vue({
                  el: "#container__modal",
                  data: {
                    msg: [],
                  },
                  mounted() {
                    const result = {
                      title: "",
                      text: response.message,
                    };
                    this.msg = result;
                  },
                });
                return;
              }
              console.log("Success", JSON.stringify(response));
              var vm = new Vue({
                el: "#container__modal",
                data: {
                  msg: [],
                },
                mounted() {
                  this.msg = response;
                },
              });
            });
        } else {
          // Error: display an error message. Note that `response.message` contains
          // a preformatted error message. Also note that `response.code` will be
          // "invalid_card" in case of validation error on the card.
          alert(
            "カードの確認でエラーが発生しました.",
            response.code,
            response.message
          );
          document
            .getElementById("container__loading")
            .classList.remove("active");
        }
      });
    },
  };

  // ===========================================================================
  // 初期化関数
  //  - イベントハンドラを設定
  //  - アラートを表示 etc
  // ---------------------------------------------------------------------------
  $(function init() {
    var params = new URL(document.location).searchParams;
    出店情報Id = params.get("id");

    getIzakaya(出店情報Id);

    setLinkBack(出店情報Id);

    Omise.setPublicKey("pkey_test_5k4953yfhskp2xwoquh");
  });
  // ===========================================================================
  // 関数定義 (イベントハンドラ以外)
  // ---------------------------------------------------------------------------

  function getIzakaya(p出店情報Id) {
    fetch(
      process.env.AP_CONTEXT_PATH +
        "/出店情報/出店情報詳細を参照する/" +
        p出店情報Id,
      {
        method: "GET",
        mode: "cors",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then((izakaya) => {
        console.log(izakaya.price);
        var vm = new Vue({
          el: "#box__izakaya",
          data: {
            izakaya: [],
          },
          mounted() {
            this.izakaya = izakaya;
          },
        });

        /*
        See on github: https://github.com/muhammederdem/credit-card-form
        */
        Vue.use(VueTheMask);
        new Vue({
          el: "#card-form-wrapper",
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
              varチケット価格: izakaya.varチケット価格,
            };
          },
          mounted() {
            this.cardNumberTemp = this.otherCardMask;
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
            submitPurchase: handlers.submitPurchase,
          },
        });

        price = izakaya.varチケット価格;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function setLinkBack(izakayaId) {
    document.querySelector(".part__link-top > a").href =
      "/detail.html?id=" + izakayaId;
  }
})();
